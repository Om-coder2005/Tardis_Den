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

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        systemInstruction: {
          role: 'system',
          parts: [{ text: payload.systemInstruction }]
        }
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
