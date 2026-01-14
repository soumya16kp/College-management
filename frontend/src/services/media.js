// src/utils/media.js
export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  return `${process.env.REACT_APP_BACKEND_URL}${path}`;
};
