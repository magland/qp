# QP Chat Widget

A portable, embeddable chat widget for QP assistants. Drop it into any website to add an AI chat assistant.

## Features

- Standalone vanilla JavaScript (no frameworks required)
- Configurable for any QP assistant
- Markdown rendering (headers, lists, tables, code blocks)
- Streaming responses
- Suggested questions
- Resizable chat window
- **Pop-out to new window** for side-by-side viewing with documentation
- Mobile responsive
- Dark mode support (auto-detects `data-bs-theme`, `data-theme`, or `.dark` class)
- Persistent chat history via localStorage (shared across pages and pop-out windows)

## Quick Start

Add the widget to your HTML page:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://your-cdn.com/qp-chat-widget.css">

<!-- Include the JavaScript -->
<script src="https://your-cdn.com/qp-chat-widget.js"></script>

<!-- Initialize the widget -->
<script>
  QPChat.init({
    title: 'My Assistant',
    systemPrompt: 'You are a helpful assistant.',
    initialMessage: 'Hi! How can I help you today?'
  });
</script>
```

## Configuration Options

```javascript
QPChat.init({
  // API Configuration
  apiEndpoint: 'https://qp-worker.neurosift.app/api/completion',  // QP API endpoint
  model: 'openai/gpt-4o-mini',      // Model to use
  provider: 'Cerebras',              // Optional: LLM provider
  app: 'my-assistant',               // Optional: App identifier for API key routing

  // Assistant Configuration
  systemPrompt: 'You are a helpful assistant.',
  initialMessage: 'Hi! How can I help you today?',
  suggestedQuestions: [
    'What can you help me with?',
    'Tell me about yourself',
    'How do I get started?'
  ],

  // Display
  title: 'Chat Assistant',           // Header title
  subtitle: null,                    // Optional: Custom subtitle (replaces status)
  position: 'bottom-right',          // Widget position

  // Storage
  storageKey: 'qp-chat-history',     // localStorage key for chat history

  // Theming
  theme: {
    primaryColor: '#055c9d',         // Primary color for buttons/accents
    darkMode: false                  // Not used; dark mode auto-detected from page
  },

  // Advanced
  cssUrl: 'qp-chat-widget.css',      // Custom CSS file URL
  jsUrl: 'qp-chat-widget.js',        // Custom JS file URL (used for pop-out)
  fullscreen: false                  // When true, renders as full-page chat (for pop-out windows)
});
```

## API Methods

```javascript
// Initialize the widget
QPChat.init(config);

// Open the chat window
QPChat.open();

// Close the chat window
QPChat.close();

// Toggle the chat window
QPChat.toggle();

// Reset the conversation
QPChat.reset();

// Remove the widget from the page
QPChat.destroy();
```

## Example: HED Assistant

```html
<!DOCTYPE html>
<html>
<head>
  <title>HED Assistant</title>
  <link rel="stylesheet" href="qp-chat-widget.css">
</head>
<body>
  <h1>Welcome to HED</h1>
  <p>Click the chat button to ask questions about HED.</p>

  <script src="qp-chat-widget.js"></script>
  <script>
    QPChat.init({
      model: 'openai/gpt-oss-120b',
      provider: 'Cerebras',
      app: 'hed-assistant',
      title: 'HED Assistant',
      systemPrompt: `You are a technical assistant specialized in Hierarchical Event Descriptors (HED).
You provide explanations and guidance for annotating events using HED tags.
Key resources: https://www.hedtags.org/`,
      initialMessage: 'Hi! I\'m the HED Assistant. Ask me anything about HED tags, annotation, or validation.',
      suggestedQuestions: [
        'What is HED and how is it used?',
        'How do I annotate an event with HED tags?',
        'What tools are available for working with HED?'
      ],
      theme: {
        primaryColor: '#055c9d'
      }
    });
  </script>
</body>
</html>
```

## Example: Custom Styling

Override CSS variables for custom theming:

```css
:root {
  --qp-primary: #7c3aed;        /* Purple theme */
  --qp-primary-hover: #6d28d9;
  --qp-bg-light: #fafafa;
  --qp-bg-white: #ffffff;
  --qp-border: #e5e7eb;
  --qp-text: #1f2937;
  --qp-text-muted: #6b7280;
  --qp-text-light: #9ca3af;
}
```

## Pop-out Window

Click the pop-out button (arrow icon) in the chat header to open the chat in a new window. This allows you to:

- View documentation and chat side-by-side
- Continue the same conversation in the pop-out window
- Resize the pop-out window independently

The chat history is shared via localStorage, so the conversation persists between the embedded widget and the pop-out window (as long as they're on the same domain).

**Note:** For the pop-out feature to work correctly, you should configure `jsUrl` and `cssUrl` with absolute URLs pointing to where your widget files are hosted:

```javascript
QPChat.init({
  // ... other options
  cssUrl: 'https://your-cdn.com/qp-chat-widget.css',
  jsUrl: 'https://your-cdn.com/qp-chat-widget.js'
});
```

## Dark Mode

The widget automatically detects dark mode from:
- `data-bs-theme="dark"` on `<html>` (Bootstrap 5)
- `data-theme="dark"` on `<html>` (common pattern)
- `.dark` class on `<html>` or `<body>` (Tailwind CSS)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Self-Hosting

1. Download `qp-chat-widget.js` and `qp-chat-widget.css`
2. Host them on your server or CDN
3. Update the URLs in your HTML

## License

MIT License - see the main QP repository for details.

