import { openai } from '@ai-sdk/openai';
import { textCompletion } from 'ai';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    // Extract messages from the request
    const { messages } = body;

    console.log('Received messages:', JSON.stringify(messages).slice(0, 200) + '...');

    // Validate the messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
          JSON.stringify({ error: 'Invalid request: messages must be an array' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the complete response using the AI SDK (non-streaming)
    const result = await textCompletion({
      model: openai('gpt-4o'),
      messages: messages,
    });

    console.log('Completed response:', result.slice(0, 100) + '...');

    // Return the complete response
    return new Response(
        JSON.stringify({ response: result }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
        JSON.stringify({ error: 'Internal server error', message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}