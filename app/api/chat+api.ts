import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  console.log('received request', req.body);
  const { messages } = await req.json();

  console.log('messages', messages);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content:
          'You are a pizza detector. Your job is to analyze images and determine if they contain pizza. Only respond with "Yes" if the image contains pizza, or "No" if it does not. Be strict in your analysis - only respond with "Yes" for actual pizza images.',
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
