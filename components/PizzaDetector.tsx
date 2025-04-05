import { useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Button } from 'react-native';
import { fetch as expoFetch } from 'expo/fetch';

import { generateAPIUrl } from '../utils';
import { ImagePicker } from './ImagePicker';

// Define message types
type MessageRole = 'user' | 'assistant';
type MessageContent = { type: 'text'; text: string } | { type: 'image'; image: string };
type Message = {
  id: string;
  role: MessageRole;
  content: MessageContent[];
};

export function PizzaDetector() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (uri: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setImageUrl(uri);

      // Create a new user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this image and tell me if it is a pizza or not.' },
          { type: 'image', image: uri }
        ]
      };

      // Add the user message to the messages array
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Prepare the API request
      const response = await expoFetch(generateAPIUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image and tell me if it is a pizza or not.' },
                { type: 'image', image: uri }
              ]
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      // Create an assistant message from the response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: [{ type: 'text', text: data.text || data.content || 'No response from API' }]
      };

      // Add the assistant message to the messages array
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (err) {
      console.error('Error in image analysis:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render message content
  const renderMessageContent = (content: MessageContent[]) => {
    return content.map((item, index) => {
      if (item.type === 'text') {
        return <Text key={`text-${index}`} className="text-base">{item.text}</Text>;
      } else if (item.type === 'image') {
        return (
            <Image
                key={`image-${index}`}
                source={{ uri: item.image }}
                style={{ width: 200, height: 200, marginVertical: 8, borderRadius: 8 }}
                resizeMode="cover"
            />
        );
      }
      return null;
    });
  };

  return (
      <View className="flex-1 p-4">
        <Text className="mb-4 text-center text-2xl font-bold">Is it Pizza?</Text>

        <ImagePicker onImageSelected={handleImageSelected} isLoading={isLoading} />

        {error && (
            <View className="mt-2 p-3 bg-red-100 rounded-md">
              <Text className="text-red-700">{error}</Text>
            </View>
        )}

        <ScrollView className="mt-4 flex-1">
          {messages.map((message) => (
              <View
                  key={message.id}
                  className={`mb-3 rounded-lg p-3 ${
                      message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
              >
                <Text className="mb-1 font-semibold">
                  {message.role === 'user' ? 'You' : 'AI'}
                </Text>
                {renderMessageContent(message.content)}
              </View>
          ))}

          {isLoading && (
              <View className="mb-3 rounded-lg bg-gray-100 p-4 items-center">
                <ActivityIndicator size="small" color="#0000ff" />
                <Text className="mt-2">Analyzing image...</Text>
              </View>
          )}
        </ScrollView>

        {messages.length > 0 && (
            <Button
                title="Clear Chat"
                onPress={() => setMessages([])}
                color="#FF6347"
            />
        )}
      </View>
  );
}