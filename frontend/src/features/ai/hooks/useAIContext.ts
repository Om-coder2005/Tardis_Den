import { useAIStore } from '../useAIStore';
import type { AIContextData } from '../types/ai.types';

export const useAIContext = () => {
  const { context, setContext, openPanel, closePanel, isOpen } = useAIStore();

  const setModuleContext = (newContext: AIContextData) => {
    setContext(newContext);
  };

  const openWithContext = (newContext?: AIContextData) => {
    openPanel(newContext);
  };

  return {
    context,
    isOpen,
    setModuleContext,
    openWithContext,
    closePanel,
  };
};
