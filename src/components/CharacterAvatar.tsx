'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CharacterAvatarProps {
  character: string;
  emotion: string;
  className?: string;
}

export default function CharacterAvatar({ character, emotion, className = '' }: CharacterAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Normalize character name and emotion for file path
  const normalizedCharacter = character.charAt(0).toUpperCase() + character.slice(1).toLowerCase();
  const normalizedEmotion = emotion.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  const imagePath = `/${normalizedCharacter}/${normalizedEmotion}.png`;

  if (imageError) {
    return (
      <div className={`w-48 h-48 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm font-semibold">{character}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-48 h-48 ${className}`}>
      <Image
        src={imagePath}
        alt={`${character} - ${emotion}`}
        fill
        className="object-contain rounded-lg shadow-lg"
        onError={() => setImageError(true)}
        priority
      />
    </div>
  );
}