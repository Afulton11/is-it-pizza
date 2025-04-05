import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { generateAPIUrl } from '../utils';
import { ImagePicker } from './ImagePicker';

export function PizzaDetector() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { messages, error, isLoading, append } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: (error) => console.error(error, 'ERROR'),
  });

  const handleImageSelected = async (uri: string) => {
    console.log('image uri', uri);
    setImageUrl(uri);
    await append({
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this image and tell me if it is a pizza or not.' },
        { type: 'image', image: uri },
      ],
    });
  };

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-center text-2xl font-bold">Is it Pizza?</Text>

      <ImagePicker onImageSelected={handleImageSelected} isLoading={isLoading} />

      {error && <Text className="mt-2 text-red-500">{error.message}</Text>}

      <ScrollView className="mt-4 flex-1">
        {messages.map((m) => (
          <View key={m.id} className="mb-3 rounded-lg bg-gray-100 p-2">
            <Text className="mb-1 font-semibold">{m.role === 'user' ? 'You' : 'AI'}</Text>
            <Text>{m.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
