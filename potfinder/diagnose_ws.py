
import asyncio
import websockets
import sys

async def test_connection():
    # User provided token
    token = "a695edeaa7bac48be1b2679a3154721d87b6af97"
    # Using group ID 1 as seen in logs
    uri = f"ws://localhost:8000/ws/chat/groups/1/?token={token}"
    
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Successfully connected!")
            await websocket.send('{"type": "test"}')
            response = await websocket.recv()
            print(f"Received: {response}")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Failed with status code: {e.status_code}")
        print(f"Headers: {e.headers}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
