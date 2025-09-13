# AI Visual Novel Adventure

An interactive web-based visual novel with AI-powered storytelling, featuring real-time streaming, dynamic character avatars, and immersive typing effects.

## Features

- **Real-time Streaming**: Progressive story display as content is generated character-by-character
- **Dynamic Character System**: 4 characters (Lumine, Tartaglia, Venti, Zhongli) with 16+ emotions each
- **Interactive Typing Animation**: Character-by-character text reveal with skip functionality
- **Fast Forward Controls**: Three-stage skip system for optimal user experience
- **Responsive Design**: Beautiful glass morphism UI with gradient backgrounds
- **XML Parsing**: Real-time parsing of streaming XML story content

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd visual-novel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if needed:
   ```env
   # Application settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   
   # Optional: Analytics or other services
   NEXT_PUBLIC_GA_ID=your_analytics_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
visual-novel/
├── src/
│   ├── app/
│   │   ├── api/story/route.ts     # Streaming API endpoint
│   │   ├── page.tsx               # Main application UI
│   │   ├── layout.tsx             # App layout and metadata
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── CharacterAvatar.tsx    # Dynamic avatar component
│   │   ├── StoryDisplay.tsx       # Story interface with fast-forward
│   │   └── TypingText.tsx         # Character-by-character animation
│   ├── lib/
│   │   └── xml-parser.ts          # Streaming XML parser
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── public/
│   ├── background.jpg             # Main background image
│   ├── fast-forward.png           # Fast forward button icon
│   └── [Character]/               # Character avatar folders
│       └── [Emotion].png          # Character emotion images
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Character System

### Available Characters
- **Lumine**: The traveler protagonist
- **Tartaglia**: Hydro Harbinger  
- **Venti**: Anemo Archon
- **Zhongli**: Geo Archon

### Available Emotions
`Neutral`, `Happy`, `Sad`, `Angry`, `Surprised`, `Confident`, `Annoyed`, `Very Happy`, `Thinking`, `Concern`, `Blushing`, `Crying`, `Deeply In Love`, `Disgusted`, `Fear`

### Asset Requirements
Character avatars are located in:
```
public/[CharacterName]/[Emotion].png
```
- **Size**: 192x192 pixels
- **Format**: PNG with transparency
- **Naming**: Exact case-sensitive emotion names

## Fast Forward System

The application features a three-stage fast forward system:

### Stage 1: Disabled (Sentence Not Ready)
- Button appears grayed out when content is still streaming
- Tooltip: "Waiting for content..."

### Stage 2: Skip Typing Animation  
- Button becomes active when sentence is fully received
- Click to instantly display all text
- Tooltip: "Skip typing animation"

### Stage 3: Advance to Next Sentence
- After text is fully displayed, click to move to next segment
- Tooltip: "Move to next sentence"
- Disabled when no more content available

## XML Story Format

The application expects streaming XML in this format:

```xml
<Narrator>The story begins in a mysterious forest...</Narrator>

<character name="Lumine">
  <action expression="Surprised">Nearly dropping her chopsticks</action>
  <say>Another traveler? Here in Liyue Harbor?</say>
  <action expression="Happy">Standing gracefully</action>
  <say>It's rare to meet someone else who journeys between worlds.</say>
</character>

<character name="Zhongli">
  <action expression="Thinking">Pouring tea with practiced elegance</action>
  <say>Please, sit. In Liyue, we honor guests with proper hospitality.</say>
</character>
```

## Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Environment Variables

Create a `.env.local` file in the project root for local configuration:

```env
# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: API Configuration (for future AI integration)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
```

## Technical Implementation

### Streaming Architecture
- **Character-by-character streaming** from `/api/story` endpoint
- **Real-time XML parsing** with duplicate prevention
- **Progressive segment display** as content becomes available
- **State management** for typing animations and user interactions

### Performance Optimizations
- **Next.js 15** with Turbopack for fast development and builds
- **React 19** for improved performance and concurrent features
- **Tailwind CSS 4** for optimized styling
- **Image optimization** with Next.js Image component
- **Efficient XML parsing** with position-based deduplication

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**Issue**: Typing animation not working
- **Solution**: Check that `speed` prop is set correctly (default: 30ms)
- **Check**: Verify `onTypingChange` callback is properly connected

**Issue**: Characters not displaying
- **Solution**: Verify character images exist in `public/[Character]/[Emotion].png`
- **Check**: Ensure exact case-sensitive file naming

**Issue**: Fast forward button not appearing
- **Solution**: Check that segments are being parsed correctly
- **Debug**: Open browser console for parsing logs

**Issue**: Skip functionality not working properly
- **Solution**: Verify `shouldSkip` state is resetting between segments
- **Check**: Ensure `lastProcessedText` ref is tracking text changes

### Debug Mode

Enable debug logging by checking the browser console for:
- `"New segments parsed:"` - Shows when content is successfully parsed
- Network tab - Verify streaming API responses
- React DevTools - Check component state management

## Technical Notes & Assumptions

### Architecture Decisions
- **Next.js 15** chosen for built-in streaming support and App Router
- **Streaming XML parser** implemented for real-time content processing
- **Component-based architecture** for maintainability and reusability
- **Tailwind CSS** for rapid UI development and design consistency

### Key Assumptions
1. **Content Format**: Stories are provided in structured XML format with narrator and character segments
2. **Character Assets**: All character emotions are available as PNG images with exact naming
3. **Browser Support**: Modern browsers with streaming fetch and ReadableStream support
4. **Content Safety**: Story content is appropriate for general audiences
5. **Performance**: Users have reasonable internet connections for character-by-character streaming

### State Management
- **Segment tracking**: Each story segment maintains independent state
- **Skip functionality**: Three-stage system with proper state isolation
- **Typing animations**: Character-by-character reveal with skip capability
- **Auto-progression**: 1-second delay between segments for natural pacing

### Known Limitations
- **Choice System**: Interactive choices are parsed but not fully implemented
- **Save System**: No conversation history or save/load functionality
- **Accessibility**: Limited screen reader support for dynamic content
- **Mobile Optimization**: Designed primarily for desktop experience

### Future Enhancements
- [ ] Implement interactive choice system with branching narratives
- [ ] Add conversation history and save/load functionality
- [ ] Integrate with real AI services for dynamic story generation
- [ ] Add sound effects and background music
- [ ] Implement character voice synthesis
- [ ] Enhanced mobile responsiveness
- [ ] Accessibility improvements for screen readers

## Development Workflow

### Making Changes
1. **Components**: Edit files in `src/components/`
2. **Styling**: Use Tailwind classes for consistent design
3. **API**: Modify `src/app/api/story/route.ts` for backend changes
4. **Types**: Update `src/types/index.ts` for TypeScript interfaces

### Adding New Characters
1. Create folder: `public/[CharacterName]/`
2. Add emotion images: `[Emotion].png` (192x192px)
3. Update XML parser if needed
4. Test with sample XML content

### Testing
1. **Manual Testing**: Use the web interface with various inputs
2. **Stream Testing**: Monitor browser network tab for proper streaming
3. **State Testing**: Verify skip functionality works per sentence
4. **Cross-browser**: Test on supported browsers

## License

This project is for educational and demonstration purposes.

## Acknowledgments

- Character designs inspired by Genshin Impact
- Built with Next.js, TypeScript, and Tailwind CSS
- Streaming implementation based on modern web standards

---

For questions or issues, please check the troubleshooting section above or review the code comments for detailed implementation notes.