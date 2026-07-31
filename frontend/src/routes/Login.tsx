import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PasscodeInput } from '../components/PasscodeInput';
import { useSessionStore } from '../store';
import { Loader2, ShieldCheck, KeyRound, Sparkles, Compass } from 'lucide-react';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useSessionStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/room', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleComplete = async (code: string) => {
    setError(null);
    setIsSubmitting(true);
    
    const success = await login(code);
    if (success) {
      navigate('/room');
    } else {
      setError('Access Denied: Invalid Passkey');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#06070b] text-[#f3d26a] font-mono p-4 overflow-hidden select-none">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,191,58,0.15),transparent_45%),linear-gradient(180deg,rgba(255,214,94,0.06),transparent_35%),linear-gradient(135deg,#06070b,#0f111a_50%,#08090e)]" />
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,215,96,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,96,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Main Terminal Box */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center rounded-3xl border border-[#f3d26a]/40 bg-black/60 p-8 sm:p-12 shadow-[0_0_80px_rgba(236,191,58,0.15)] backdrop-blur-md">
        
        {/* Header Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#f3d26a]/30 bg-[#f3d26a]/10 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#f3d26a]/80 mb-6">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>TARDIS Den • Observatory Control</span>
        </div>

        {/* Logo / Icon */}
        <div className="w-16 h-16 rounded-2xl border border-[#f3d26a]/50 bg-[#f3d26a]/10 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(243,210,106,0.2)]">
          <KeyRound className="w-8 h-8 text-[#f3d26a]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.22em] text-center uppercase text-[#f6e8b2] mb-2 drop-shadow-[0_2px_10px_rgba(243,210,106,0.3)]">
          TARDIS DEN
        </h1>
        <p className="text-xs sm:text-sm text-[#f6e8b2]/70 mb-8 tracking-wider text-center max-w-xs">
          Enter Admin Passkey to Access Observatory Room & Controls
        </p>

        {/* Passcode Input Component */}
        <div className="w-full flex justify-center mb-2">
          <PasscodeInput onComplete={handleComplete} disabled={isSubmitting || isLoading} />
        </div>

        {/* Status / Feedback */}
        <div className="h-10 mt-4 flex items-center justify-center">
          {error && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-red-500/40 bg-red-950/40 text-red-400 text-xs tracking-wide animate-bounce">
              <span>{error}</span>
            </div>
          )}
          {(isSubmitting || isLoading) && (
            <div className="flex items-center gap-2 text-[#f3d26a] text-xs tracking-widest uppercase animate-pulse">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Authenticating Passkey...</span>
            </div>
          )}
        </div>

        {/* Action button prompt hint */}
        <div className="mt-4 pt-6 border-t border-[#f3d26a]/15 w-full flex items-center justify-between text-[11px] text-[#f6e8b2]/50 tracking-wider">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f3d26a]/70" /> Admin Encrypted
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#f3d26a]/70" /> Enter 6 Digits
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 z-10 text-[11px] tracking-[0.2em] text-[#f3d26a]/40 uppercase">
        TardisOS v1.2.0 • Restricted Gateway
      </div>
    </div>
  );
};
