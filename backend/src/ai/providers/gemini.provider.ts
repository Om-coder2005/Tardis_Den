import { IAIProvider, AIMessagePayload } from '../types/ai.types';

export class GeminiProvider implements IAIProvider {
  public name = 'Gemini';

  public async *streamChat(payload: { prompt: string; systemInstruction: string; history: AIMessagePayload[] }): AsyncGenerator<string> {
    if (!process.env.GEMINI_API_KEY) {
      const mockText = "I see you haven't configured a Gemini API Key yet! Please add one to the `.env` file in the backend to awaken my true form.\n\nIn the meantime, I am but a humble mock responder. Beep boop!";
      const chunks = mockText.split(' ');
      for (const chunk of chunks) {
        yield chunk + ' ';
        await new Promise(r => setTimeout(r, 50));
      }
      return;
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = payload.history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    contents.push({ role: 'user', parts: [{ text: payload.prompt }] });

    // Prioritized list of free-tier compatible Gemini models
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
    ].filter(Boolean) as string[];

    let responseStream = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction: {
              role: 'system',
              parts: [{ text: payload.systemInstruction }]
            }
          }
        });
        // If stream creation succeeds without throwing 404/NOT_FOUND, break loop
        if (responseStream) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini Provider] Model ${modelName} failed or unavailable. Trying next candidate...`);
      }
    }

    if (!responseStream) {
      throw lastError || new Error('No available Gemini model could be reached on your API key.');
    }

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
