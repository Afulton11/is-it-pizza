# Is It Pizza?

A React Native app that uses the Vercel AI SDK and OpenAI's vision model to determine whether an image contains pizza or not.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. For production, add `EXPO_PUBLIC_API_BASE_URL` to your environment variables

## Running the App

```bash
npm start
```

Then, scan the QR code with the Expo Go app on your phone, or press 'i' to open in iOS simulator or 'a' for Android emulator.

## How to Use

1. Open the app
2. Tap "Select an Image" button
3. Choose an image from your device
4. The app will use OpenAI's vision model to determine if the image contains pizza
5. View the AI's response in the chat area below
