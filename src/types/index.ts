export interface Character {
  name: string;
  emotion: string;
  dialogue?: string;
  action?: string;
}

export interface Choice {
  id: string;
  text: string;
}

export interface StorySegment {
  type: 'character' | 'narrator';
  speaker?: string;
  emotion?: string;
  text: string;
  choices?: Choice[];
}

export interface StreamingState {
  currentText: string;
  isTyping: boolean;
  currentSpeaker?: string;
  currentEmotion?: string;
  choices: Choice[];
  isComplete: boolean;
}