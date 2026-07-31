import React, { useRef, useState } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';

interface PasscodeInputProps {
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export const PasscodeInput: React.FC<PasscodeInputProps> = ({ onComplete, disabled = false }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length > 1) return; // Handle paste separately

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((c) => c !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
    if (pastedData.length === 0) return;

    const newCode = [...code];
    pastedData.forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((c) => c === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    if (newCode.every((c) => c !== '')) {
      onComplete(newCode.join(''));
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {code.map((char, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="password"
          maxLength={1}
          value={char}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-[#0d0f18]/80 border-2 border-[#f3d26a]/30 rounded-xl focus:border-[#f3d26a] focus:ring-2 focus:ring-[#f3d26a]/40 focus:shadow-[0_0_20px_rgba(243,210,106,0.3)] outline-none transition-all duration-200 disabled:opacity-40 text-[#f6e8b2] shadow-inner"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};
