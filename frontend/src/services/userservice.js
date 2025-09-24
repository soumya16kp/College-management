import authService from "./authService"; // use the apiClient from your file

const getProfile = async () => {
  const response = await authService.apiClient.get("/profile/");
  return response.data;
};

const updateProfile = async (data) => {
  const formData = new FormData();
  formData.append("bio", data.bio || "");
  formData.append("phone", data.phone || "");
  formData.append("designation", data.designation || "");
  if (data.profile_image instanceof File) {
    formData.append("profile_image", data.profile_image);
  }

  const response = await authService.apiClient.put("/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
};

export default userService;
