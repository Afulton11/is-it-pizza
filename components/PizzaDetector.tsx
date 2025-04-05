import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { ImagePicker } from './ImagePicker';

export function PizzaDetector() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { complete } = useCompletion({
    api: '/api/chat',
    onResponse: () => {
      setIsLoading(true);
    },
    onFinish: (prompt, completion) => {
      setIsLoading(false);
      setResult(completion);
    },
  });

  const handleImageSelected = async (base64Image: string) => {
    try {
      console.log('sending image', base64Image);
      const prompt = `Analyze this image and tell me if it's a pizza. Just respond with "Yes" if it's pizza or "No" if it's not pizza. Here's the image: ${base64Image}`;
      await complete(prompt);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult('Error analyzing image. Please try again.');
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-2xl font-bold">Is it Pizza?</Text>

      <ImagePicker onImageSelected={handleImageSelected} isLoading={isLoading} />

      {isLoading && (
        <View className="mt-4">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-center">Analyzing image...</Text>
        </View>
      )}

      {result && (
        <View className="mt-4 rounded-lg bg-gray-100 p-4">
          <Text className="text-lg font-semibold">
            {result === 'Yes' ? "🍕 Yes, that's pizza!" : "❌ No, that's not pizza."}
          </Text>
        </View>
      )}
    </View>
  );
}
