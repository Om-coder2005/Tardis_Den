import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PasscodeInput } from '../components/PasscodeInput';
import { useSessionStore } from '../store';
import { Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useSessionStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (code: string) => {
    setError(null);
    setIsSubmitting(true);
    
    const success = await login(code);
    if (success) {
      navigate('/room');
    } else {
      setError('Invalid passcode');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-light tracking-widest mb-2 text-slate-300">TARDIS DEN</h1>
        <p className="text-slate-500 mb-10 tracking-wide text-sm">Enter administrator passcode</p>
        
        <PasscodeInput onComplete={handleComplete} disabled={isSubmitting || isLoading} />
        
        <div className="h-8 mt-6 flex items-center justify-center">
          {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
          {isSubmitting && <Loader2 className="animate-spin text-brand w-6 h-6" />}
        </div>
      </div>
      <div className="absolute bottom-8 text-xs text-slate-600">
        Private Access Only
      </div>
    </div>
  );
};
