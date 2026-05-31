// Chatbot UI — Cumulus Helm component
// Requires backend running on port 8001. Frontend works without it — chat silently degrades.

const CHAT_API_URL = 'http://localhost:8001/api/chat';

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
  const emptyState = document.getElementById('chatbotEmptyState');

  if (!trigger || !chatWindow) return;

  let isOpen = false;

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

  function sendMessage() {
    if (!input || !messages || input.disabled) return;
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    scrollToBottom();

    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-message bot-message';
    emptyState?.classList.add('hidden');
    messages.appendChild(botMsg);
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
              botMsg.appendChild(time);
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
                  botMsg.textContent += data.token;
                  scrollToBottom();
                }
                if (data.error) {
                  botMsg.textContent = data.error;
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
        botMsg.remove();
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
      });
  }

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${type}-message`;
    msg.textContent = text;

    const time = document.createElement('span');
    time.className = 'chatbot-message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.appendChild(time);

    emptyState?.classList.add('hidden');
    messages.appendChild(msg);
    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }
}
