import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PhotoUploadDto, EntitiesAssociation } from "../../types/photo";
import * as FileSystem from 'expo-file-system';

interface AddPhotoComponentProps {
  entityId: string;
  entityType: EntitiesAssociation;
  onPhotoSelect?: (photo: PhotoUploadDto) => void;
}

const AddPhotoComponent: React.FC<AddPhotoComponentProps> = ({
  entityId,
  entityType,
  onPhotoSelect,
}) => {
  const [error, setError] = useState<string>("");

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        
        // Check file size (10MB limit)
        if (selectedAsset.fileSize && selectedAsset.fileSize > 10 * 1024 * 1024) {
          setError("A imagem deve ter no máximo 10MB");
          return;
        }
        
        // For mobile, we need to handle files differently
        if (Platform.OS !== 'web') {
          // Get file info
          const fileInfo = await FileSystem.getInfoAsync(selectedAsset.uri);
          
          // Create a FormData object for the file
          const fileExtension = selectedAsset.uri.split('.').pop() || 'jpg';
          const fileName = `photo_${Date.now()}.${fileExtension}`;
          
          // Instead of trying to create a Blob or File object directly,
          // we'll just pass the URI and let the API handle the file upload
          const photoData: PhotoUploadDto = {
            uri: selectedAsset.uri,
            name: fileName,
            type: 'image/jpeg',
            entityId: entityId,
            entityType: entityType,
          };
          
          console.log("Photo data:", photoData);
          
          onPhotoSelect?.(photoData);
          setError("");
        } else {
          // Web handling (your original code)
          const response = await fetch(selectedAsset.uri);
          const blob = await response.blob();

          if (blob.size > 10 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 10MB");
            return;
          }

          const photoData: PhotoUploadDto = {
            file: new File([blob], "photo.jpg", { type: "image/jpeg" }),
            entityId: entityId,
            entityType: entityType,
          };

          onPhotoSelect?.(photoData);
          setError("");
        }
      }
    } catch (err) {
      console.error("Error picking image:", err);
      setError("Erro ao selecionar imagem: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Selecionar Foto</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});

export default AddPhotoComponent;
