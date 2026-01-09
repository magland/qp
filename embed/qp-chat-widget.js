/**
 * QP Chat Widget
 * A portable, embeddable chat widget for QP assistants.
 *
 * https://github.com/magland/qp
 * Author: Seyed Yahya Shirazi (https://neuromechanist.github.io)
 */

(function(global) {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    apiEndpoint: 'https://qp-worker.neurosift.app/api/completion',
    model: 'openai/gpt-4o-mini',
    provider: null,
    app: null,
    systemPrompt: 'You are a helpful assistant.',
    initialMessage: 'Hi! How can I help you today?',
    suggestedQuestions: [],
    title: 'Chat Assistant',
    subtitle: null,
    position: 'bottom-right',
    storageKey: 'qp-chat-history',
    theme: {
      primaryColor: '#055c9d',
      darkMode: false
    }
  };

  // Current configuration
  let config = { ...DEFAULT_CONFIG };

  // State
  let isOpen = false;
  let isLoading = false;
  let messages = [];
  let backendOnline = false;
  let widgetCreated = false;

  // Icons (SVG)
  const ICONS = {
    chat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
    brain: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
    reset: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>'
  };

  // Load chat history from localStorage
  function loadHistory() {
    try {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        messages = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    if (messages.length === 0) {
      messages = [{
        role: 'assistant',
        content: config.initialMessage
      }];
    }
  }

  // Save chat history to localStorage
  function saveHistory() {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }

  // Reset conversation
  function resetConversation() {
    messages = [{
      role: 'assistant',
      content: config.initialMessage
    }];
    saveHistory();
    renderMessages();
  }

  // Check backend connectivity
  async function checkBackendStatus() {
    const statusDot = document.getElementById('qp-chat-status-dot');
    const statusText = document.getElementById('qp-chat-status-text');

    if (!statusDot || !statusText) return;

    try {
      const requestBody = {
        model: config.model,
        systemMessage: config.systemPrompt,
        messages: [{ role: 'user', content: 'ping' }],
        tools: []
      };
      if (config.provider) requestBody.provider = config.provider;
      if (config.app) requestBody.app = config.app;

      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok || response.status === 200) {
        backendOnline = true;
        statusDot.className = 'qp-chat-status-dot';
        statusText.textContent = 'Online';
      } else {
        backendOnline = false;
        statusDot.className = 'qp-chat-status-dot offline';
        statusText.textContent = 'Offline';
      }
    } catch (e) {
      backendOnline = false;
      statusDot.className = 'qp-chat-status-dot offline';
      statusText.textContent = 'Offline';
    }

    renderMessages();
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Render inline markdown
  function renderInlineMarkdown(text) {
    if (!text) return '';
    let result = '';
    let remaining = text;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const urlMatch = remaining.match(/(?<!\]\()(https?:\/\/[^\s\)]+)/);

      const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
      const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : -1;
      const urlIndex = urlMatch ? remaining.indexOf(urlMatch[0]) : -1;

      const indices = [boldIndex, linkIndex, urlIndex].filter(i => i !== -1);
      if (indices.length === 0) {
        result += escapeHtml(remaining);
        break;
      }
      const minIndex = Math.min(...indices);

      if (minIndex === boldIndex && boldMatch) {
        if (boldIndex > 0) result += escapeHtml(remaining.substring(0, boldIndex));
        result += '<strong>' + escapeHtml(boldMatch[1]) + '</strong>';
        remaining = remaining.substring(boldIndex + boldMatch[0].length);
      } else if (minIndex === linkIndex && linkMatch) {
        if (linkIndex > 0) result += escapeHtml(remaining.substring(0, linkIndex));
        result += '<a href="' + escapeHtml(linkMatch[2]) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(linkMatch[1]) + '</a>';
        remaining = remaining.substring(linkIndex + linkMatch[0].length);
      } else if (minIndex === urlIndex && urlMatch) {
        if (urlIndex > 0) result += escapeHtml(remaining.substring(0, urlIndex));
        result += '<a href="' + escapeHtml(urlMatch[0]) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(urlMatch[0]) + '</a>';
        remaining = remaining.substring(urlIndex + urlMatch[0].length);
      }
    }
    return result;
  }

  // Markdown to HTML converter
  function markdownToHtml(text) {
    if (!text) return '';

    const lines = text.split('\n');
    let result = '';
    let inCodeBlock = false;
    let codeBlockContent = [];
    let inTable = false;
    let tableRows = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        result += '<ul class="qp-chat-list">' + currentList.join('') + '</ul>';
        currentList = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        let tableHtml = '<div class="qp-chat-table-wrapper"><table class="qp-chat-table">';
        tableRows.forEach((row, idx) => {
          const cells = row.split('|').filter(c => c.trim() !== '');
          if (cells.every(c => /^[\s\-:]+$/.test(c))) return;
          const tag = idx === 0 ? 'th' : 'td';
          tableHtml += '<tr>';
          cells.forEach(cell => {
            tableHtml += '<' + tag + '>' + renderInlineMarkdown(cell.trim()) + '</' + tag + '>';
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</table></div>';
        result += tableHtml;
        tableRows = [];
        inTable = false;
      }
    };

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];

      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          result += '<pre class="qp-chat-code-block"><code>' + escapeHtml(codeBlockContent.join('\n')) + '</code></pre>';
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      if (line.includes('|') && (line.trim().startsWith('|') || line.match(/\|.*\|/))) {
        flushList();
        inTable = true;
        tableRows.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (/^[-\*_\u2013\u2014]{3,}\s*$/.test(line.trim())) {
        flushList();
        flushTable();
        result += '<hr class="qp-chat-hr">';
        continue;
      }

      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        flushList();
        const level = headerMatch[1].length;
        result += '<h' + level + ' class="qp-chat-h' + level + '">' + renderInlineMarkdown(headerMatch[2]) + '</h' + level + '>';
        continue;
      }

      const bulletMatch = line.match(/^[\*\-]\s+(.+)$/);
      if (bulletMatch) {
        currentList.push('<li>' + renderInlineMarkdown(bulletMatch[1]) + '</li>');
        continue;
      }

      flushList();

      if (line.trim()) {
        let processedLine = line.replace(/`([^`]+)`/g, function(match, code) {
          return '<code class="qp-chat-inline-code">' + escapeHtml(code) + '</code>';
        });
        processedLine = processedLine.replace(/(<code[^>]*>.*?<\/code>)|([^<]+)/g, function(match, codeTag, text) {
          if (codeTag) return codeTag;
          if (text) return renderInlineMarkdown(text);
          return match;
        });
        result += '<p class="qp-chat-p">' + processedLine + '</p>';
      }
    }

    flushList();
    flushTable();
    if (inCodeBlock && codeBlockContent.length > 0) {
      result += '<pre class="qp-chat-code-block"><code>' + escapeHtml(codeBlockContent.join('\n')) + '</code></pre>';
    }

    return result || text;
  }

  // Check if should show suggestions
  function shouldShowSuggestions() {
    return messages.length === 1 && !isLoading && config.suggestedQuestions.length > 0;
  }

  // Render messages
  function renderMessages() {
    const container = document.getElementById('qp-chat-messages');
    if (!container) return;

    let html = '';
    for (const msg of messages) {
      const isUser = msg.role === 'user';
      const label = isUser ? 'You' : config.title;
      const content = isUser ? escapeHtml(msg.content) : markdownToHtml(msg.content);

      html += `
        <div class="qp-chat-message ${isUser ? 'user' : 'assistant'}">
          <span class="qp-chat-message-label">${escapeHtml(label)}</span>
          <div class="qp-chat-message-content">${content}</div>
        </div>
      `;
    }

    if (shouldShowSuggestions()) {
      html += `
        <div class="qp-chat-suggestions">
          <span class="qp-chat-suggestions-label">Try asking:</span>
          ${config.suggestedQuestions.map(q =>
            `<button class="qp-chat-suggestion" data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`
          ).join('')}
        </div>
      `;
    }

    if (isLoading) {
      html += `
        <div class="qp-chat-loading">
          <span class="qp-chat-loading-label">${escapeHtml(config.title)}</span>
          <div class="qp-chat-loading-dots">
            <span class="qp-chat-loading-dot"></span>
            <span class="qp-chat-loading-dot"></span>
            <span class="qp-chat-loading-dot"></span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Add click handlers for suggestions
    container.querySelectorAll('.qp-chat-suggestion').forEach(btn => {
      btn.onclick = () => handleSuggestedQuestion(btn.dataset.question);
    });

    // Update reset button state
    const resetBtn = document.getElementById('qp-chat-reset');
    if (resetBtn) {
      resetBtn.disabled = messages.length <= 1 || isLoading;
    }

    scrollToBottom();
  }

  // Scroll to bottom
  function scrollToBottom() {
    const container = document.getElementById('qp-chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Handle suggested question click
  async function handleSuggestedQuestion(question) {
    if (isLoading) return;

    messages.push({ role: 'user', content: question });
    isLoading = true;
    renderMessages();
    saveHistory();

    try {
      const response = await sendMessage();
      messages.push({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
    }

    isLoading = false;
    renderMessages();
    saveHistory();
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();

    const input = document.getElementById('qp-chat-input');
    const text = input.value.trim();

    if (!text || isLoading) return;

    messages.push({ role: 'user', content: text });
    input.value = '';
    isLoading = true;
    renderMessages();
    saveHistory();

    try {
      const response = await sendMessage();
      messages.push({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
    }

    isLoading = false;
    renderMessages();
    saveHistory();
  }

  // Send message to API
  async function sendMessage() {
    const apiMessages = messages
      .filter((_, i) => i > 0)
      .map(msg => ({ role: msg.role, content: msg.content }));

    const requestBody = {
      model: config.model,
      systemMessage: config.systemPrompt,
      messages: apiMessages,
      tools: []
    };
    if (config.provider) requestBody.provider = config.provider;
    if (config.app) requestBody.app = config.app;

    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              updateStreamingMessage(fullContent);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    return fullContent || 'I received your message but had no response.';
  }

  // Update streaming message
  function updateStreamingMessage(content) {
    const container = document.getElementById('qp-chat-messages');
    if (!container) return;

    let streamingEl = container.querySelector('.qp-chat-streaming');
    if (!streamingEl) {
      const loadingEl = container.querySelector('.qp-chat-loading');
      if (loadingEl) loadingEl.remove();

      streamingEl = document.createElement('div');
      streamingEl.className = 'qp-chat-message assistant qp-chat-streaming';
      streamingEl.innerHTML = `
        <span class="qp-chat-message-label">${escapeHtml(config.title)}</span>
        <div class="qp-chat-message-content"></div>
      `;
      container.appendChild(streamingEl);
    }

    const contentEl = streamingEl.querySelector('.qp-chat-message-content');
    if (contentEl) {
      contentEl.innerHTML = markdownToHtml(content);
    }

    scrollToBottom();
  }

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    const toggleBtn = document.getElementById('qp-chat-toggle');
    const chatWindow = document.getElementById('qp-chat-window');

    if (isOpen) {
      toggleBtn.className = 'qp-chat-toggle open';
      toggleBtn.innerHTML = ICONS.close;
      chatWindow.classList.remove('hidden');
      scrollToBottom();
      document.getElementById('qp-chat-input').focus();
    } else {
      toggleBtn.className = 'qp-chat-toggle closed';
      toggleBtn.innerHTML = ICONS.chat;
      chatWindow.classList.add('hidden');
    }
  }

  // Setup resize functionality
  function setupResize(chatWindow) {
    const resizeHandle = chatWindow.querySelector('.qp-chat-resize-handle');
    if (!resizeHandle) return;

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = chatWindow.offsetWidth;
      startHeight = chatWindow.offsetHeight;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const newWidth = startWidth - (e.clientX - startX);
      const newHeight = startHeight - (e.clientY - startY);

      if (newWidth >= 280 && newWidth <= 600) {
        chatWindow.style.width = newWidth + 'px';
        chatWindow.style.left = 'auto';
      }
      if (newHeight >= 300 && newHeight <= 800) {
        chatWindow.style.height = newHeight + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });
  }

  // Create the widget
  function createWidget() {
    if (widgetCreated) return;

    // Inject CSS if not already present
    if (!document.getElementById('qp-chat-widget-styles')) {
      const link = document.createElement('link');
      link.id = 'qp-chat-widget-styles';
      link.rel = 'stylesheet';
      link.href = (config.cssUrl || 'qp-chat-widget.css');
      document.head.appendChild(link);
    }

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'qp-chat-toggle';
    toggleBtn.className = 'qp-chat-toggle closed';
    toggleBtn.setAttribute('aria-label', 'Toggle Chat Assistant');
    toggleBtn.innerHTML = ICONS.chat;
    toggleBtn.onclick = toggleChat;

    // Apply custom primary color
    if (config.theme.primaryColor) {
      toggleBtn.style.setProperty('--qp-primary', config.theme.primaryColor);
    }

    // Create chat window
    const subtitle = config.subtitle ? `<span id="qp-chat-status-text">${escapeHtml(config.subtitle)}</span>` :
      `<span class="qp-chat-status-dot checking" id="qp-chat-status-dot"></span><span id="qp-chat-status-text">Checking...</span>`;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'qp-chat-window';
    chatWindow.className = 'qp-chat-window hidden';
    chatWindow.innerHTML = `
      <div class="qp-chat-header">
        <div class="qp-chat-avatar">${ICONS.brain}</div>
        <div class="qp-chat-title">
          <span class="qp-chat-title-text">${escapeHtml(config.title)}</span>
          <span class="qp-chat-status" id="qp-chat-status">${subtitle}</span>
        </div>
        <button class="qp-chat-reset" id="qp-chat-reset" title="Reset conversation">${ICONS.reset}</button>
      </div>
      <div class="qp-chat-messages" id="qp-chat-messages"></div>
      <div class="qp-chat-input-area">
        <form class="qp-chat-input-wrapper" id="qp-chat-form">
          <input type="text" class="qp-chat-input" id="qp-chat-input" placeholder="Type a message..." autocomplete="off">
          <button type="submit" class="qp-chat-send" id="qp-chat-send">${ICONS.send}</button>
        </form>
      </div>
      <div class="qp-chat-footer">
        <a href="https://github.com/magland/qp" target="_blank" rel="noopener noreferrer">Powered by magland/qp</a>
      </div>
      <div class="qp-chat-resize-handle"></div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(chatWindow);

    // Event listeners
    document.getElementById('qp-chat-form').onsubmit = handleSubmit;
    document.getElementById('qp-chat-reset').onclick = () => {
      if (messages.length <= 1 || isLoading) return;
      resetConversation();
    };

    setupResize(chatWindow);
    widgetCreated = true;
  }

  // Initialize the widget
  function init(userConfig = {}) {
    // Merge configurations
    config = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      theme: { ...DEFAULT_CONFIG.theme, ...(userConfig.theme || {}) }
    };

    loadHistory();
    createWidget();
    renderMessages();

    // Check backend status if no custom subtitle
    if (!config.subtitle) {
      checkBackendStatus();
    }
  }

  // Destroy the widget
  function destroy() {
    const toggle = document.getElementById('qp-chat-toggle');
    const window = document.getElementById('qp-chat-window');
    const styles = document.getElementById('qp-chat-widget-styles');

    if (toggle) toggle.remove();
    if (window) window.remove();
    if (styles) styles.remove();

    widgetCreated = false;
    isOpen = false;
    messages = [];
  }

  // Export API
  global.QPChat = {
    init: init,
    destroy: destroy,
    reset: resetConversation,
    open: () => { if (!isOpen) toggleChat(); },
    close: () => { if (isOpen) toggleChat(); },
    toggle: toggleChat
  };

})(typeof window !== 'undefined' ? window : this);
