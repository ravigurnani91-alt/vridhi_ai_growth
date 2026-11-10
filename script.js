const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));
}
document.querySelectorAll('.answer-option').forEach(button => {
  button.addEventListener('click', () => {
    const feedback = document.querySelector('.answer-feedback');
    document.querySelectorAll('.answer-option').forEach(option => {
      option.disabled = true;
      if (option.dataset.answer === 'right') option.classList.add('correct');
    });
    if (button.dataset.answer === 'right') {
      feedback.textContent = 'That’s right. Excess nutrients, warmth and sunlight can encourage algae to multiply. The exact causes and risks depend on the lake and should be investigated with water-quality evidence.';
    } else {
      button.classList.add('incorrect');
      feedback.textContent = 'Not quite. Algal growth is often linked to excess nutrients, sunlight and suitable temperatures. Some blooms can affect water quality and aquatic life.';
    }
  });
});
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();