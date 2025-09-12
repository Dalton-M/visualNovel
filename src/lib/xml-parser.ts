import { StorySegment } from '@/types';

export class StreamingXMLParser {
  private buffer: string = '';
  private processedMatches: Set<string> = new Set();

  public parseChunk(chunk: string): StorySegment[] {
    this.buffer += chunk;
    return this.extractNewSegments();
  }

  private extractNewSegments(): StorySegment[] {
    const newSegments: StorySegment[] = [];
    
    // Parse Narrator segments
    const narratorRegex = /<Narrator>(.*?)<\/Narrator>/gs;
    let match;
    
    while ((match = narratorRegex.exec(this.buffer)) !== null) {
      const matchKey = `narrator:${match.index}:${match[0]}`;
      if (!this.processedMatches.has(matchKey)) {
        this.processedMatches.add(matchKey);
        newSegments.push({
          type: 'narrator',
          text: match[1].trim()
        });
      }
    }

    // Parse Character segments
    const characterRegex = /<character\s+name="([^"]+)"\s*>(.*?)<\/character>/gs;
    
    while ((match = characterRegex.exec(this.buffer)) !== null) {
      const matchKey = `character:${match.index}:${match[0]}`;
      if (!this.processedMatches.has(matchKey)) {
        this.processedMatches.add(matchKey);
        
        const characterName = match[1];
        const content = match[2];
        
        // Extract emotion from action tags
        const emotionMatch = content.match(/expression="([^"]+)"/);
        const emotion = emotionMatch ? emotionMatch[1] : 'neutral';
        
        // Extract dialogue from say tags
        const dialogueMatches = content.match(/<say>(.*?)<\/say>/gs);
        let dialogue = '';
        
        if (dialogueMatches) {
          dialogue = dialogueMatches
            .map(d => d.replace(/<\/?say>/g, '').trim())
            .join(' ');
        }

        if (dialogue) {
          newSegments.push({
            type: 'character',
            speaker: characterName,
            emotion: emotion,
            text: dialogue
          });
        }
      }
    }
    
    return newSegments;
  }

  public reset(): void {
    this.buffer = '';
    this.processedMatches.clear();
  }

  public getBuffer(): string {
    return this.buffer;
  }
}