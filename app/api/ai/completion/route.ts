import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContentStream({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Given the following information about this skateboarding spot. 
            Respond with with a paragraph or two to describe the spot based on the name and skateboarding features: ${prompt}`,
          },
        ],
      },
    ],
  });

  const stream = GoogleGenerativeAIStream(response);

  return new StreamingTextResponse(stream);
}
