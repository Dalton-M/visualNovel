'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  onTypingChange?: (isTyping: boolean) => void;
  skipTyping?: boolean;
}

export default function TypingText({ 
  text, 
  speed = 50, 
  onComplete, 
  className = '',
  onTypingChange,
  skipTyping = false
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    // Reset typing state when text changes to prevent skip from persisting
    if (onTypingChange) onTypingChange(false);
  }, [text, onTypingChange]);

  useEffect(() => {
    if (skipTyping) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      if (onTypingChange) onTypingChange(false);
      if (onComplete) onComplete();
      return;
    }

    if (currentIndex < text.length) {
      if (onTypingChange) onTypingChange(true);
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && text.length > 0) {
      if (onTypingChange) onTypingChange(false);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, onComplete, skipTyping, onTypingChange]);

  return (
    <div className={`font-serif text-lg leading-relaxed ${className}`}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}