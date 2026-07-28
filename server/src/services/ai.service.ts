import { getGeminiModel, getGeminiApiKey } from '../config/gemini';
import { AppError } from '../utils/appError';
import { TaskSuggestionInput, aiSubtasksResponseSchema, AISubtasksResponse } from '../validations/ai.validation';

const stripMarkdown = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

export const generateTaskSuggestion = async (
  input: TaskSuggestionInput
): Promise<AISubtasksResponse> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new AppError('Gemini API key is not configured on the server', 500);
  }

  const prompt = `You are an expert AI productivity assistant. Analyze the task title and description below and generate 3 to 4 actionable, specific, concise subtasks in logical execution order.

Task Title: "${input.title}"
Task Description: "${input.description || 'No description provided'}"

Requirements:
- Generate ONLY 3 to 4 subtasks.
- Each subtask must be actionable, concise, clear, and practical.
- Do NOT generate tips, roadmap, difficulty, or time estimates.
- Do NOT modify title or description.

Return ONLY valid JSON matching this exact JSON schema format without markdown backticks:
{
  "subtasks": [
    {
      "title": "Subtask title",
      "completed": false
    }
  ]
}`;

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonString = stripMarkdown(responseText);
    let parsed: any;

    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', responseText);
      throw new AppError('Failed to parse AI response into valid JSON', 502);
    }

    const validated = aiSubtasksResponseSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('AI response validation error:', validated.error.format());
      throw new AppError('AI generated an invalid response structure', 502);
    }

    return validated.data;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Gemini API Error:', error);
    if (error.status === 429 || error.message?.includes('429')) {
      throw new AppError('AI service rate limit exceeded. Please try again later.', 429);
    }
    throw new AppError(error.message || 'Failed to generate AI subtask suggestions', 500);
  }
};
