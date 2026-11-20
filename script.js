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

// Division-page subject and issue filters. All filtering happens locally in the browser.
document.querySelectorAll('.filter-search, .filter-category').forEach(control => {
  control.addEventListener('input', applyLocalFilter);
  control.addEventListener('change', applyLocalFilter);
});
function applyLocalFilter() {
  const search = (document.querySelector('.filter-search')?.value || '').trim().toLowerCase();
  const category = document.querySelector('.filter-category')?.value || 'all';
  document.querySelectorAll('[data-searchable]').forEach(card => {
    const text = (card.textContent || '').toLowerCase();
    const matchesText = !search || text.includes(search);
    const matchesCategory = category === 'all' || card.dataset.category === category;
    card.hidden = !(matchesText && matchesCategory);
  });
}

// Reusable, client-side quiz interaction.
document.querySelectorAll('.interactive-quiz').forEach(quiz => {
  const result = quiz.querySelector('.quiz-result');
  const answer = quiz.dataset.answer;
  quiz.querySelectorAll('.quiz-choice').forEach(choice => {
    choice.addEventListener('click', () => {
      quiz.querySelectorAll('.quiz-choice').forEach(button => {
        button.disabled = true;
        if (button.dataset.choice === answer) button.style.borderColor = '#55765e';
      });
      const correct = choice.dataset.choice === answer;
      if (!correct) choice.style.borderColor = '#c96e4d';
      result.textContent = (correct ? 'Correct. ' : 'Not quite. ') + quiz.dataset.explanation;
    });
  });
});

// Lightweight converters; inputs remain on-device and are not transmitted.
function bindConverter(inputId, modeId, outputId, convert) {
  const input = document.getElementById(inputId);
  const mode = document.getElementById(modeId);
  const output = document.getElementById(outputId);
  if (!input || !mode || !output) return;
  const update = () => {
    if (input.value === '') { output.textContent = 'Result appears here'; return; }
    const value = Number(input.value);
    if (!Number.isFinite(value)) { output.textContent = 'Enter a valid number'; return; }
    const result = convert(value, mode.value);
    output.textContent = result.text;
  };
  input.addEventListener('input', update);
  mode.addEventListener('change', update);
}
bindConverter('distance-value', 'distance-mode', 'distance-output', (v, mode) =>
  mode === 'km'
    ? {text: (v * 0.621371).toLocaleString(undefined, {maximumFractionDigits: 4}) + ' miles'}
    : {text: (v * 1.609344).toLocaleString(undefined, {maximumFractionDigits: 4}) + ' kilometres'}
);
bindConverter('temperature-value', 'temperature-mode', 'temperature-output', (v, mode) =>
  mode === 'c'
    ? {text: ((v * 9 / 5) + 32).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' °F'}
    : {text: ((v - 32) * 5 / 9).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' °C'}
);
