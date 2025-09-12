'use client';

import { useState, useEffect } from 'react';
import CharacterAvatar from './CharacterAvatar';
import TypingText from './TypingText';
import { StorySegment, Choice } from '@/types';

interface StoryDisplayProps {
  segments: StorySegment[];
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
  isLoading: boolean;
}

export default function StoryDisplay({ 
  segments, 
  choices, 
  onChoiceSelect,
  isLoading 
}: StoryDisplayProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isNewStory, setIsNewStory] = useState(true);

  const currentSegment = segments[currentSegmentIndex];

  const handleTypingComplete = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setTimeout(() => {
        setCurrentSegmentIndex(prev => prev + 1);
      }, 1000);
    } else if (choices.length > 0) {
      setShowChoices(true);
    }
  };

  useEffect(() => {
    // Only reset to index 0 when segments array is completely new (length goes from 0 to something)
    if (segments.length === 1 && isNewStory) {
      setCurrentSegmentIndex(0);
      setShowChoices(false);
      setIsNewStory(false);
    }
    // Reset for new story when segments is empty
    if (segments.length === 0) {
      setCurrentSegmentIndex(0);
      setShowChoices(false);
      setIsNewStory(true);
    }
  }, [segments, isNewStory]);

  if (!currentSegment && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white-500">Start your story by entering a prompt above.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Story Display Area */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 min-h-[400px]">
        {currentSegment && (
          <div className="flex items-start gap-6">
            {/* Character Avatar - only show for character segments */}
            {currentSegment.type === 'character' && currentSegment.speaker && (
              <div className="flex-shrink-0">
                <CharacterAvatar 
                  character={currentSegment.speaker}
                  emotion={currentSegment.emotion || 'neutral'}
                  className="transition-all duration-300"
                />
                <p className="text-center mt-2 text-sm font-semibold text-gray-700">
                  {currentSegment.speaker}
                </p>
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1">
              <TypingText
                text={currentSegment.text}
                speed={30}
                onComplete={handleTypingComplete}
                className={
                  currentSegment.type === 'narrator' 
                    ? 'text-gray-700 italic' 
                    : 'text-gray-900'
                }
              />
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Generating story...</span>
          </div>
        )}
      </div>

      {/* Choices */}
      {showChoices && choices.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What do you do?</h3>
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoiceSelect(choice.id)}
              className="block w-full text-left p-4 bg-blue-50 hover:bg-blue-100 
                         border border-blue-200 rounded-lg transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}