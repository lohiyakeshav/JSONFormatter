# Minimal JSON Formatter

A clean, minimal JSON formatter website inspired by Notion's design philosophy, with strategic ad placement for monetization.

## Features

### Core Functionality
- **Format/Beautify**: Instantly format messy JSON with proper indentation
- **Minify**: Compress JSON by removing unnecessary whitespace
- **Validate**: Check for syntax errors with helpful error messages
- **Syntax Highlighting**: Color-coded JSON output for better readability
- **Copy to Clipboard**: One-click copy of formatted output
- **Local Storage**: Automatically saves your work

### Design Principles
- **Ultra-clean aesthetic**: White/light gray background with minimal visual noise
- **Typography**: Clean Inter font with carefully chosen sizes
- **Spacing**: Generous white space for breathing room
- **Subtle interactions**: Gentle hover states and smooth transitions
- **Responsive design**: Works perfectly on all screen sizes

## Responsive Breakpoints

- **Mobile**: 320px - 767px (single column layout)
- **Tablet**: 768px - 1199px (two-column editor layout)
- **Desktop**: 1200px+ (three-column with vertical ad)
- **Large Desktop**: 1600px+ (includes sticky side ad)

## Ad Strategy

The website implements a strategic ad placement system that maintains the clean aesthetic while maximizing revenue potential:

1. **Native Ads**: Styled to look like content cards
2. **Banner Ads**: Clean typography-based ads (728x90)
3. **Vertical Ads**: 300x600 between editors on desktop
4. **Sticky Side Ad**: 160x600 fixed position on large screens
5. **In-content Ads**: Naturally placed between sections

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No dependencies, pure JS
- **Responsive Design**: Mobile-first approach
- **Local Storage API**: For data persistence

### CSS Features
- CSS Custom Properties for theming
- Clamp() for fluid typography
- Grid and Flexbox for layouts
- Media queries for responsiveness
- Dark mode support (prefers-color-scheme)
- High contrast mode support
- Print styles

### JavaScript Features
- ES6 Class-based architecture
- Event delegation
- Debounced resize handler
- Keyboard shortcuts
- Local storage integration
- Syntax highlighting engine

## Performance Optimizations

- Minimal dependencies (no frameworks)
- Optimized font loading
- Debounced event handlers
- Efficient DOM manipulation
- CSS containment for ad blocks
- Lazy loading for below-fold content

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states
- Reduced motion support
- High contrast mode support

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Development

1. Clone the repository
2. Open `index.html` in a browser, or
3. Run a local server: `python3 -m http.server 8080`
4. Navigate to `http://localhost:8080`

## File Structure

```
/workspace/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with responsive design
├── script.js       # JSON formatter functionality
├── test.json       # Sample JSON for testing
└── README.md       # This file
```

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Format JSON
- **Ctrl/Cmd + Shift + C**: Copy output
- **Ctrl/Cmd + Shift + X**: Clear all

## Future Enhancements

- JSON Schema validation
- JSON to CSV/XML conversion
- JSON diff tool
- API integration
- More export formats
- Theme customization
- Advanced formatting options

## License

This project is created for demonstration purposes. Feel free to use and modify as needed.