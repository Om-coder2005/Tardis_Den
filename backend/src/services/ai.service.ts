import { GoogleGenAI } from '@google/genai';

export const AIService = {
  async *streamChat(prompt: string, context: any, history: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      // Mock stream for testing if no key is provided
      const mockText = "I see you haven't configured a Gemini API Key yet! Please add one to the `.env` file in the backend to awaken my true form.\n\nIn the meantime, I am but a humble mock responder. Beep boop!";
      const chunks = mockText.split(' ');
      for (const chunk of chunks) {
        yield chunk + ' ';
        await new Promise(r => setTimeout(r, 50));
      }
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format history for Gemini
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Construct the system instruction from context
    let systemInstruction = "You are a quiet, knowledgeable observatory assistant named Tardis. You assist the user with astronomy, journaling, and general knowledge. Be concise, accurate, and educational.";
    if (context) {
      systemInstruction += `\n\nCurrent Context:\nModule: ${context.module}\nData: ${JSON.stringify(context.data)}`;
    }

    // Add current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: {
            role: 'system',
            parts: [{ text: systemInstruction }]
        }
      }
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  }
};
