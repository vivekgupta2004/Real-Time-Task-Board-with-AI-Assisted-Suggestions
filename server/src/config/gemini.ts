import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const getGeminiApiKey = (): string => process.env.GEMINI_API_KEY || '';
export const getGeminiModelName = (): string => process.env.GEMINI_MODEL || 'gemini-3.6-flash';

export const getGeminiClient = (): GoogleGenerativeAI => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

export const getGeminiModel = () => {
  const genAI = getGeminiClient();
  const modelName = getGeminiModelName();
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
};
