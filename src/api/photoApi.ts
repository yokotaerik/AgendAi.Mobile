import { Platform } from "react-native";
import { PhotoUploadDto } from "../types/photo";
import api from "../api";

// Example of how to modify your API call
export const uploadPhoto = async (photoData: PhotoUploadDto) => {
  const formData = new FormData();
  
  if (Platform.OS !== 'web' && photoData.uri) {
    // For mobile, append the file using the URI
    formData.append('file', {
      uri: photoData.uri,
      name: photoData.name || 'photo.jpg',
      type: photoData.type || 'image/jpeg',
    } as any);
  } else if (photoData.file) {
    // For web, append the File object
    formData.append('file', photoData.file);
  }
  
  formData.append('entityId', photoData.entityId);
  formData.append('entityType', String(photoData.entityType));
  
  return api.post('/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};