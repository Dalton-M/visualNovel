'use client';

import { useState } from 'react';
import StoryDisplay from '@/components/StoryDisplay';
import { StreamingXMLParser } from '@/lib/xml-parser';
import { StorySegment, StreamingState } from '@/types';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [streamingState] = useState<StreamingState>({
    currentText: '',
    isTyping: false,
    choices: [],
    isComplete: false
  });
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startStory = async (userPrompt: string) => {
    setIsLoading(true);
    setSegments([]);
    
    const parser = new StreamingXMLParser();
    parser.reset(); // Ensure clean state
    
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const newSegments = parser.parseChunk(chunk);
        
        if (newSegments.length > 0) {
          console.log('New segments parsed:', newSegments);
          setSegments(prev => [...prev, ...newSegments]);
        }
      }
    } catch (error) {
      console.error('Error streaming story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = (choiceId: string) => {
    console.log('Choice selected:', choiceId);
    // TODO: Implement choice handling
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-100 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.jpg)' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Visual Novel Adventure
          </h1>
          <p className="text-blue-200">
            Enter a prompt to begin your interactive story
          </p>
        </div>

        {/* Prompt Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="story-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Story Prompt
            </label>
            <textarea
              id="story-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your story prompt here... (e.g., 'A lone wanderer discovers a hidden, ancient library in the middle of a desert.')"
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              disabled={isLoading}
            />
            <button
              onClick={() => startStory(prompt)}
              disabled={!prompt.trim() || isLoading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                         text-white font-semibold py-3 px-6 rounded-lg transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Generating Story...' : 'Begin Adventure'}
            </button>
          </div>
        </div>

        {/* Story Display */}
        <StoryDisplay
          segments={segments}
          choices={streamingState.choices}
          onChoiceSelect={handleChoiceSelect}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}