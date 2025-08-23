
import  authService  from './authService';

export const getClubs = async () => {
  const response = await authService.apiClient.get("/clubs/");
  return response.data;
};

export const createClub = async (clubData) => {
  const response = await authService.apiClient.post("/clubs/", clubData);
  return response.data;
};

export const updateClub = async (id, clubData) => {
  const response = await authService.apiClient.put(`/clubs/${id}/`, clubData);
  return response.data;
};

export const deleteClub = async (id) => {
  await authService.apiClient.delete(`/clubs/${id}/`);
};
