import authService from './authService';

// 🔹 Get all events (global)
export const getAllEvents = async () => {
  const response = await authService.apiClient.get(`/clubs/events/`);
  return response.data;
};

// 🔹 Get all events for a specific club
export const getEvents = async (clubId) => {
  const response = await authService.apiClient.get(`/clubs/${clubId}/events/`);
  return response.data;
};

// 🔹 Create a new event under a specific club
export const createEvent = async (clubId, eventData) => {
  console.log("This is eventData", eventData);
  console.log("The ClubId is ",clubId)
  const payload = { ...eventData  }; // 👈 attach club
  const response = await authService.apiClient.post(`/clubs/${clubId}/events/`, payload);
  return response.data;
};

// 🔹 Get details of a single event
export const getEventDetail = async (eventId) => {
  const response = await authService.apiClient.get(`/clubs/events/${eventId}/`);
  return response.data;
};

// 🔹 Update an event
export const updateEvent = async (eventId, eventData) => {
  const response = await authService.apiClient.put(`/clubs/events/${eventId}/`, eventData);
  return response.data;
};

// 🔹 Delete an event
export const deleteEvent = async (eventId) => {
  await authService.apiClient.delete(`/clubs/events/${eventId}/`);
};
