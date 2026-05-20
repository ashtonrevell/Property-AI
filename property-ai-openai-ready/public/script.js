const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if (menuBtn && mainNav) menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function addMessage(text, type = 'ai') {
  if (!messages) return null;
  const div = document.createElement('div');
  div.className = `bubble ${type}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

async function askAssistant(question) {
  addMessage(question, 'user');
  const typing = addMessage('Thinking…', 'ai typing');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();
    typing.remove();

    if (!response.ok) {
      addMessage(data.error || 'Something went wrong. Please try again or use the contact page.', 'ai error');
      return;
    }

    addMessage(data.answer || 'I could not generate a response. Please use the contact page for help.', 'ai');
  } catch (error) {
    typing.remove();
    addMessage('The AI server is not running yet. Start it with npm install, add your OpenAI API key to .env, then run npm start.', 'ai error');
  }
}

if (chatForm && chatInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = '';
    askAssistant(question);
  });
}

document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => askAssistant(button.getAttribute('data-question')));
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = encodeURIComponent(document.getElementById('name').value || '');
    const visitorEmail = encodeURIComponent(document.getElementById('visitorEmail').value || '');
    const phone = encodeURIComponent(document.getElementById('phone').value || '');
    const enquiryType = encodeURIComponent(document.getElementById('enquiryType').value || '');
    const message = encodeURIComponent(document.getElementById('message').value || '');
    const subject = encodeURIComponent('Property AI website enquiry');
    const body = `Name: ${name}%0AEmail: ${visitorEmail}%0APhone: ${phone}%0AEnquiry type: ${enquiryType}%0A%0AMessage:%0A${message}`;
    window.location.href = `mailto:ashtonrevell@gmail.com?subject=${subject}&body=${body}`;
    formStatus.textContent = 'Opening your email app with the enquiry prepared.';
  });
}
