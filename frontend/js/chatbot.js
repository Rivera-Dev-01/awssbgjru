// Chatbot UI — Cumulus Helm component
// Requires backend running on port 8001. Frontend works without it — chat silently degrades.

const CHAT_API_URL = '/api/chat';

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('chatbot-placeholder', '../components/chatbot.html')
    .then(() => initChatbot())
    .catch(() => console.warn('Chatbot component not loaded'));
});

function initChatbot() {
  const trigger = document.getElementById('chatbotTrigger');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const sendBtn = document.getElementById('chatbotSend');
  const input = document.getElementById('chatbotInput');
  const messages = document.getElementById('chatbotMessages');
  const charCounter = document.getElementById('chatbotCharCounter');

  if (!trigger || !chatWindow) return;

  let isOpen = false;

  // Add first bot greeting
  addBotMessage('Hi there! 👋 Welcome aboard! Ask me anything about AWS, the cloud, or our community.');

  trigger.addEventListener('click', () => {
    if (isOpen) closeChat(); else openChat();
  });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen) closeChat(); else openChat();
    }
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeChat();
  });

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Character counter
  input?.addEventListener('input', () => {
    if (charCounter) {
      const len = input.value.length;
      charCounter.textContent = `${len}/1000`;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (!chatWindow.contains(e.target) && !trigger.contains(e.target)) {
      closeChat();
    }
  });

  function openChat() {
    if (isOpen) return;
    isOpen = true;
    chatWindow.classList.add('open');
    trigger.style.animation = 'none';
    trigger.offsetHeight;
    trigger.style.animation = '';
    setTimeout(() => input?.focus(), 400);
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    chatWindow.classList.remove('open');
    trigger.style.animation = 'none';
    trigger.offsetHeight;
    trigger.style.animation = '';
  }

  function addBotMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chatbot-message bot-message';

    const author = document.createElement('div');
    author.className = 'chatbot-message-author';

    const avatar = document.createElement('div');
    avatar.className = 'chatbot-message-avatar';
    const img = document.createElement('img');
    img.src = '../assets/icons/AWS LOGO.webp';
    img.alt = 'Captain Hima';
    avatar.appendChild(img);

    const name = document.createElement('span');
    name.className = 'chatbot-message-author-name';
    name.textContent = 'Captain Hima';

    author.appendChild(avatar);
    author.appendChild(name);

    const bubble = document.createElement('div');
    bubble.className = 'chatbot-message-bubble';
    bubble.textContent = text;

    wrapper.appendChild(author);
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    scrollToBottom();
  }

  function sendMessage() {
    if (!input || !messages || input.disabled) return;
    const text = input.value.trim();
    if (!text) return;

    // User message
    const userWrapper = document.createElement('div');
    userWrapper.className = 'chatbot-message user-message';
    const userBubble = document.createElement('div');
    userBubble.className = 'chatbot-message-bubble';
    userBubble.textContent = text;
    userWrapper.appendChild(userBubble);
    messages.appendChild(userWrapper);

    input.value = '';
    if (charCounter) charCounter.textContent = '0/1000';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    scrollToBottom();

    // Bot message placeholder
    const botWrapper = document.createElement('div');
    botWrapper.className = 'chatbot-message bot-message';

    const author = document.createElement('div');
    author.className = 'chatbot-message-author';
    const avatar = document.createElement('div');
    avatar.className = 'chatbot-message-avatar';
    const img = document.createElement('img');
    img.src = '../assets/icons/AWS LOGO.webp';
    img.alt = 'Captain Hima';
    avatar.appendChild(img);
    const name = document.createElement('span');
    name.className = 'chatbot-message-author-name';
    name.textContent = 'Captain Hima';
    author.appendChild(avatar);
    author.appendChild(name);

    const bubble = document.createElement('div');
    bubble.className = 'chatbot-message-bubble';

    botWrapper.appendChild(author);
    botWrapper.appendChild(bubble);
    messages.appendChild(botWrapper);
    scrollToBottom();

    const controller = new AbortController();

    fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          bubble.textContent = 'Sorry, I am having trouble connecting. Please try again later.';
          input.disabled = false;
          if (sendBtn) sendBtn.disabled = false;
          scrollToBottom();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              input.disabled = false;
              if (sendBtn) sendBtn.disabled = false;
              input.focus();
              const time = document.createElement('span');
              time.className = 'chatbot-message-time';
              time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              botWrapper.appendChild(time);
              scrollToBottom();
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
              if (!part.startsWith('data: ')) continue;
              try {
                const data = JSON.parse(part.slice(6));
                if (data.token === '[DONE]') continue;
                if (data.token) {
                  bubble.textContent += data.token;
                  scrollToBottom();
                }
                if (data.error) {
                  bubble.textContent = data.error;
                  scrollToBottom();
                }
              } catch (_) {}
            }

            read();
          }).catch(() => {
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
          });
        }

        read();
      })
      .catch(() => {
        bubble.textContent = 'Sorry, I am having trouble connecting. Please try again later.';
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
      });
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }
}