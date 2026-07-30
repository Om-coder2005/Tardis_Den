import { AIContextPayload } from '../types/ai.types';

export const ContextManager = {
  formatContext(context?: AIContextPayload | null): string {
    if (!context) {
      return '';
    }

    const moduleName = context.module || 'General';
    let formatted = `Module: ${moduleName}`;

    if (context.title) {
      formatted += `\nTitle: ${context.title}`;
    }

    if (context.selectedObject) {
      formatted += `\nSelected Object: ${JSON.stringify(context.selectedObject)}`;
    }

    if (context.data) {
      formatted += `\nData: ${JSON.stringify(context.data)}`;
    }

    if (context.userAction) {
      formatted += `\nUser Action: ${context.userAction}`;
    }

    if (context.metadata) {
      formatted += `\nMetadata: ${JSON.stringify(context.metadata)}`;
    }

    return formatted;
  }
};
