import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PhotoUploadDto, EntitiesAssociation } from '../../types/photo';

interface AddPhotoComponentProps {
  entityId: string;
  entityType: EntitiesAssociation;
  onPhotoSelect?: (photo: PhotoUploadDto) => void;
}

const AddPhotoComponent: React.FC<AddPhotoComponentProps> = ({
  entityId,
  entityType,
  onPhotoSelect
}) => {
  const [error, setError] = useState<string>('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      
      // Verificar tamanho do arquivo (5MB = 5 * 1024 * 1024 bytes)
      const response = await fetch(selectedAsset.uri);
      const blob = await response.blob();
      
      if (blob.size > 10 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      const photoData: PhotoUploadDto = {
        file: new File([blob], 'photo.jpg', { type: 'image/jpeg' }),
        entityId: entityId,
        entityType: entityType
      };

      onPhotoSelect?.(photoData);
      setError('');
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
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  }
});

export default AddPhotoComponent;
