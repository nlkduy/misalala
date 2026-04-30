# Custom Instructions for MisaLala Game Modernization

## Project Context
- **Current State:** A legacy 2017 mini-game built with vanilla HTML/JS, using `table` for layout and global variables/functions for logic.
- **Goal:** Refactor and modernize the game while preserving the core "matching photos" gameplay.

## Technical Preferences & Standards
- **JavaScript:** - Use modern ES6+ syntax (const/let, arrow functions, template literals).
    - Remove global variables; use ES modules or a state management pattern.
    - Refactor DOM manipulation from inline `onClick` attributes to `addEventListener`.
- **HTML & CSS:** - Replace table-based layouts with modern CSS Flexbox or CSS Grid.
    - Improve responsiveness for mobile devices.
    - Use semantic HTML tags.
- **Refactoring Strategy:** - Consolidate repetitive logic from `level1.js`, `level2.js`, and `level3.js` into a single reusable `Game` class or engine.
    - Use `sessionStorage` or `localStorage` consistently for score tracking.
    - Implement a clean separation of concerns (Logic vs. UI).

## Coding Guidelines
- **DRY (Don't Repeat Yourself):** Avoid duplicating the random shuffle and matching logic across multiple files.
- **Performance:** Optimize image loading and timing functions (`setInterval`/`setTimeout`).
- **Naming:** Use clear, descriptive variable names (e.g., `isMatch` instead of `appear`).

## Interaction Style
- Suggest modern alternatives whenever you see legacy code (e.g., suggesting `fetch` instead of older patterns).
- Provide explanations for refactoring choices to help me learn modern best practices.
- Responses should be concise and focus on modularity.