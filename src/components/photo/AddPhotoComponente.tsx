import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PhotoUploadDto, EntitiesAssociation } from "../../types/photo";
import * as FileSystem from 'expo-file-system';
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

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
  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async () => {
    try {
      setLoading(true);
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
          setLoading(false);
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
            setLoading(false);
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
      setLoading(false);
    } catch (err) {
      console.error("Error picking image:", err);
      setError("Erro ao selecionar imagem: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={pickImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Selecionar Foto</Text>
          </>
        )}
      </TouchableOpacity>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.error || "#FFEBEE",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  errorText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
  },
});

export default AddPhotoComponent;
