import { AIContextPayload } from '../types/ai.types';
import { MODULE_TEMPLATES } from './templates/moduleTemplates';
import { ContextManager } from '../context/contextManager';

export class PromptOrchestrator {
  public static orchestrateSystemInstruction(
    context?: AIContextPayload | null,
    styleLevel?: 'concise' | 'standard' | 'detailed',
    explanationLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): string {
    const moduleKey = (context?.module || 'room').toLowerCase();
    const persona = MODULE_TEMPLATES[moduleKey] || MODULE_TEMPLATES['room'];

    let instruction = `You are a quiet, knowledgeable observatory companion named Tardis, operating as an ${persona.roleName}.\n`;
    instruction += `Tone: ${persona.toneDescription}\n\n`;

    if (styleLevel) {
      instruction += `Response Style: ${styleLevel.toUpperCase()}\n`;
    }
    if (explanationLevel) {
      instruction += `Target Explanation Depth: ${explanationLevel.toUpperCase()}\n`;
    }

    instruction += `\n--- Output Rules ---\n`;
    instruction += `- Maintain scientific accuracy and avoid inventing facts.\n`;
    instruction += `- Use markdown formatting for readability.\n`;
    for (const rule of persona.outputConstraints) {
      instruction += `- ${rule}\n`;
    }

    const formattedContext = ContextManager.formatContext(context);
    if (formattedContext) {
      instruction += `\n--- Active Context ---\n${formattedContext}`;
    }

    return instruction;
  }
}
