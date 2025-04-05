import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, imageUrl } = await req.json();

  console.log('imageUrl', imageUrl);

  // Add the image to the messages if it exists
  const messagesWithImage = imageUrl
    ? [
        ...messages,
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Is this a pizza?' },
            { type: 'image', image: imageUrl },
          ],
        },
      ]
    : messages;

  const result = streamText({
    model: openai('gpt-4o'),
    messages: messagesWithImage,
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
