import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  isLoading: boolean;
}

export function ImagePicker({ onImageSelected, isLoading }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      onImageSelected(selectedImage);
    }
  };

  return (
    <View className="items-center justify-center py-4">
      <TouchableOpacity
        onPress={pickImage}
        className="mb-4 rounded-lg bg-blue-500 px-4 py-2"
        disabled={isLoading}>
        <Text className="font-semibold text-white">Select an Image</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {image && (
        <View className="mt-2 overflow-hidden rounded-lg">
          <Image source={{ uri: image }} className="h-72 w-72 rounded-lg" />
        </View>
      )}
    </View>
  );
}
