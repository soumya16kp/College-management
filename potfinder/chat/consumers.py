# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from django.db import IntegrityError
User = get_user_model()

class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get token from query string
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        print(f"Query string: {query_string}")
        
        token = None
        # Parse query parameters
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break
        
        print(f"Extracted token: {token}")
        
        # Authenticate user using DRF token
        if token:
            user = await self.authenticate_with_drf_token(token)
            if user:
                self.scope['user'] = user
                print(f"✅ User authenticated: {user.username} (ID: {user.id})")
            else:
                self.scope['user'] = AnonymousUser()
                print("❌ Token authentication failed")
        else:
            print("❌ No token provided in query string")
            self.scope['user'] = AnonymousUser()
        
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f'chat_group_{self.group_id}'

        user = self.scope["user"]
        print(f"🔐 WebSocket connection attempt - User: {user}, Group: {self.group_id}")
        
        if user.is_anonymous:
            print("🚫 Rejecting: User is anonymous")
            await self.close(code=4001)
            return

        # Check group membership
        is_allowed = await database_sync_to_async(self._check_membership)()
        if not is_allowed:
            print("🚫 Rejecting: User not allowed in group")
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f"✅ WebSocket connected successfully to group {self.group_id}")

    @database_sync_to_async
    def authenticate_with_drf_token(self, token_key):
        """
        Authenticate using Django REST Framework Token
        """
        try:
            from rest_framework.authtoken.models import Token
            
            # Get the token object
            token = Token.objects.select_related('user').get(key=token_key)
            print(f"🔑 Token found for user: {token.user.username}")
            return token.user
            
        except Token.DoesNotExist:
            print(f"❌ Token not found: {token_key}")
            return None
        except ImportError:
            print("❌ DRF Token auth not available")
            return None
        except Exception as e:
            print(f"❌ Token authentication error: {e}")
            return None

    def _check_membership(self):
        """
        Check if user is allowed to access this group
        """
        from .models import ChatGroup
        try:
            group = ChatGroup.objects.get(pk=self.group_id)
            user = self.scope["user"]
            
            # If group is not private, allow all authenticated users
            if not group.is_private:
                return True
                
            # For private groups, check membership
            return user in group.members.all() or group.created_by == user
            
        except ChatGroup.DoesNotExist:
            print(f"❌ Group {self.group_id} not found")
            return False

    async def disconnect(self, close_code):
        print(f"🔌 WebSocket disconnected, code: {close_code}")
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("type")
            print(f"📨 Received WebSocket message: {data}")

            if action == "send_message":
                msg = await database_sync_to_async(self._create_message)(data)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message", 
                        "message": msg
                    }
                )
            elif action == "test":
                # Echo back for testing
                await self.send(text_data=json.dumps({
                    "type": "echo",
                    "message": "WebSocket is working!",
                    "user": self.scope["user"].username,
                    "received_data": data
                }))
                
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
        except Exception as e:
            print(f"❌ Error processing message: {e}")

    def _create_message(self, data):
        """
        Create a new message in the database, with highly detailed error logging.
        """
        from .models import ChatGroup, Message
        print("--- [_create_message]: Function started ---")
        
        try:
            user = self.scope.get("user")
            group_id = self.group_id
            
            # --- PRE-FLIGHT CHECKS ---
   
            
            if not user or user.is_anonymous:
                print("❌ PRE-FLIGHT CHECK FAILED: User is Anonymous or None.")
                return {"error": "User not authenticated."}

            if not group_id:
                print("❌ PRE-FLIGHT CHECK FAILED: Group ID is missing.")
                return {"error": "Group ID is missing."}

            # --- DATABASE OPERATIONS ---
            print("   - Fetching ChatGroup from DB...")
            group = ChatGroup.objects.get(pk=group_id)
            print(f"   - Fetched group successfully: {group}")
            
            text_to_save = data.get("text", "")
            print(f"   - Text to save: '{text_to_save}'")
            
            print("   - Attempting Message.objects.create()...")
            m = Message.objects.create(
                group=group, 
                sender=user, 
                text=text_to_save
            )
            print("✅✅✅ Message.objects.create() SUCCEEDED.")
            print(f"   - New message object: {m} (ID: {m.id})")
            
            return {
                "id": m.id,
                "type": "new_message",
                "group": group.id,
                "sender": {"id": user.id, "username": user.username},
                "text": m.text,
                "pinned": m.pinned,
                "created_at": m.created_at.isoformat()
            }

        # --- SPECIFIC ERROR HANDLING ---
        except IntegrityError as e:
            print(f"🔥🔥🔥 DATABASE INTEGRITY ERROR: The database rejected the save. {e}")
            return {"error": f"Database IntegrityError: {e}"}
        except ChatGroup.DoesNotExist:
            print(f"🔥🔥🔥 DATABASE ERROR: ChatGroup with ID {group_id} does not exist.")
            return {"error": "ChatGroup not found."}
        except Exception as e:
            print(f"🔥🔥🔥 UNEXPECTED ERROR in _create_message: {type(e).__name__} - {e}")
            return {"error": f"An unexpected error occurred: {e}"}

    async def chat_message(self, event):
        """Handle 'chat_message' type events from the group"""
        await self.send(text_data=json.dumps(event["message"]))