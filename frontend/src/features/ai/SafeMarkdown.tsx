import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface SafeMarkdownProps {
  source: string;
  isStreaming?: boolean;
}

const MarkdownFallback = ({ source }: { source: string }) => (
  <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-black font-sans bg-red-50 p-2 rounded border border-red-200">
    <p className="text-red-800 text-xs font-bold mb-2">Error rendering markdown, falling back to plain text:</p>
    <pre className="whitespace-pre-wrap text-sm text-black bg-transparent border-0">{source}</pre>
  </div>
);

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ source, isStreaming }) => {
  return (
    <ErrorBoundary fallback={<MarkdownFallback source={source} />}>
      <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-black prose-a:text-retro-blue font-sans">
        <MDEditor.Markdown 
          source={source || ''} 
          style={{ backgroundColor: 'transparent', color: 'black', fontFamily: 'inherit', fontSize: '0.875rem' }} 
        />
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse align-middle" />
        )}
      </div>
    </ErrorBoundary>
  );
};
