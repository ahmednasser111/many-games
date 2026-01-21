# Many Games

Small online games with clean separation of concerns and maintainable architecture.

## Build Requirements

- No build step required; static HTML/CSS/JS.
- Any static web server can serve the project (e.g., Python http.server, Node serve, VS Code Live Server).

## Testing Instructions

- Cross-browser: Open in Chrome, Firefox, Safari, Edge and verify layout and interactions.
- Visual regression: Compare pages before/after using browser dev tools screenshots.
- Functionality:
  - Tic Tac Toe: verify turns, win detection, draw state, reset, score persistence.
  - Responsive: test on mobile widths (<600px) and desktop.
- Performance: Run Lighthouse audits from browser DevTools.
- Links: Ensure index tiles navigate correctly to tic-tac-toe.html.
## Dependencies

- No third-party runtime dependencies; vanilla HTML/CSS/JS.

