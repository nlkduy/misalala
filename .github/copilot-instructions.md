# Custom Instructions for MisaLala Game

## Project Context
- **Current State:** Fully modernized 2017 photo-matching mini-game with contemporary ES6+ architecture
- **Architecture:** Single `Game.js` class, unified `game.html` with dynamic level loading, consolidated responsive CSS
- **Goal:** Maintain modern standards, enhance features, and ensure code quality across the project

## Current Project Structure
```
misalala/
├── index.html              # Home page with level selection
├── game.html              # Dynamic game page (handles all levels via ?level= params)
├── script/
│   └── Game.js            # Unified game engine (ES6 class, no global vars)
├── style/
│   └── level.css          # Consolidated responsive CSS (all styles external)
├── img/
│   ├── cat/               # Level 1 images
│   ├── dog/               # Level 2 images
│   └── baby/              # Level 3 images
├── MODERNIZATION.md       # Modernization documentation
├── README.md              # Project documentation
└── LICENSE.md             # License
```

## Technical Standards & Best Practices

### JavaScript (ES6+ Modern)
- **Use ES6+ features**: const/let, arrow functions, template literals, destructuring
- **No global variables**: All state encapsulated in Game class instance
- **No inline event handlers**: Use `addEventListener` exclusively
- **Dynamic level loading**: Parse `?level=X` from URL and configure Game instance accordingly
- **localStorage**: Persist scores per level using `localStorage.getItem('level_X_completed')`
- **Immutable patterns**: Avoid mutating state directly; use methods to manage state changes

### HTML & CSS
- **Semantic HTML**: Use `<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>` tags appropriately
- **External CSS only**: All styles in `style/level.css`; no inline `style` attributes or `<style>` tags
- **CSS Grid & Flexbox**: Use modern layout techniques (never tables for layout)
- **Responsive design**: Implement mobile-first approach with media queries
- **Media breakpoints**:
  - Desktop: Full 3-column layout
  - Tablet (1024px): Single column
  - Mobile (768px): Compact reference grid
  - Small Mobile (480px): Further optimizations

### Game Class Architecture
- **Single responsibility**: Game class handles logic, rendering, and event management
- **Configuration-driven**: Accept config object for level-specific settings (gridSize, timeLimit, imageSource, etc.)
- **Key methods**:
  - `init()` - Initialize game state and render
  - `shuffleImages()` - Fisher-Yates algorithm
  - `renderGrid()` - Create game cards with CSS Grid
  - `handleCardClick()` - Card interaction logic
  - `checkMatch()` - Match validation and scoring
  - `startTimer()` - Countdown timer
  - `saveScore()` / `loadScore()` - localStorage persistence
  - `playAgain()` - Reset game state

### Code Quality Guidelines
- **DRY principle**: Eliminate code duplication; reuse methods across levels
- **Clear naming**: Use descriptive variable names (`isMatched`, `timeRemaining`, `currentScore`)
- **Comments**: Document complex logic; explain scoring rules and game mechanics
- **Error handling**: Validate level access, handle missing images gracefully
- **Performance**: Minimize DOM reflows; cache selectors; use efficient event delegation

## Dynamic Level System
All three levels load through the same `game.html` via URL parameters:

```javascript
// Parse level from URL
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level') || '1';

// Validate level progression
if (level !== '1' && !localStorage.getItem(`level_${level - 1}_completed`)) {
  alert(`Complete Level ${level - 1} first!`);
  window.location.href = 'index.html';
}

// Level-specific configurations
const configs = {
  1: { gridSize: 9, timeLimit: 30 },
  2: { gridSize: 16, timeLimit: 60 },
  3: { gridSize: 36, timeLimit: 120 }
};

// Initialize with configuration
const game = new Game({
  level: parseInt(level),
  ...configs[level],
  imageSource: imageSources[level],
  containerSelector: '#game-grid',
  scoreDisplaySelector: '#score',
  timerDisplaySelector: '#timer',
  statusDisplaySelector: '#status',
});
```

## Coding Conventions
- **File naming**: camelCase for JS files, kebab-case for CSS classes
- **CSS classes**: Use BEM-like naming (`.game-card`, `.game-card.flipped`, `.game-card.matched`)
- **Scoring system**:
  - +100 points per successful match
  - -50 points per failed match attempt
  - +1000 bonus for completing a level
- **localStorage keys**: `level_X_completed` (boolean), `level_X_score` (number)

## When Adding Features
- Follow ES6+ patterns used in existing code
- Add CSS to `style/level.css` (never inline styles)
- Use Game class methods; don't create global functions
- Maintain responsive design across all breakpoints
- Test on desktop, tablet, and mobile layouts
- Ensure features work with all three levels dynamically

## Interaction Style
- Provide concise, practical explanations
- Suggest modern alternatives for any legacy patterns
- Focus on maintainability and performance
- Help maintain the DRY principle and clean architecture