import { useState, useCallback } from 'react';
import { useAIStore } from '../useAIStore';
import { AIClient } from '../services/aiClient';
import { logger } from '../../../utils/logger';

export const useAIChat = () => {
  const {
    messages,
    addMessage,
    updateMessage,
    context,
    activeRequest,
    setRequestController,
    abortRequest,
  } = useAIStore();

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    if (activeRequest) {
      abortRequest();
    }

    addMessage({ role: 'user', content: prompt.trim() });
    setIsLoading(true);

    const responseId = addMessage({ role: 'model', content: '', isStreaming: true });
    const controller = new AbortController();
    setRequestController(controller);

    let accumulatedText = '';

    try {
      await AIClient.streamChat(
        {
          prompt: prompt.trim(),
          context,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        },
        (chunk) => {
          accumulatedText += chunk;
          updateMessage(responseId, accumulatedText, true);
        },
        (errorMsg) => {
          accumulatedText += `\n\n**Error:** ${errorMsg}`;
          updateMessage(responseId, accumulatedText, false);
        },
        controller.signal
      );

      updateMessage(responseId, accumulatedText, false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.info('Request was aborted by the user.');
        updateMessage(responseId, 'Request cancelled.', false);
      } else {
        logger.error('Chat error:', error.message);
        const errorMessage = error.message || 'Sorry, I encountered an error communicating with my neural matrix.';
        updateMessage(responseId, errorMessage, false);
      }
    } finally {
      setIsLoading(false);
      setRequestController(null);
    }
  }, [isLoading, activeRequest, abortRequest, addMessage, context, messages, setRequestController, updateMessage]);

  return {
    sendMessage,
    isLoading,
    abortRequest,
  };
};
