(function () {
  var root = document.querySelector('[data-elysian-quiz]');
  if (!root) return;

  var steps = root.querySelectorAll('[data-quiz-step]');
  var result = root.querySelector('[data-quiz-result]');
  var progress = root.querySelector('[data-quiz-progress]');
  var stepLabel = root.querySelector('[data-quiz-step-label]');
  var backBtn = root.querySelector('[data-quiz-back]');
  var restartBtn = root.querySelector('[data-quiz-restart]');
  var resultTitle = root.querySelector('[data-quiz-result-title]');
  var resultText = root.querySelector('[data-quiz-result-text]');
  var resultLink = root.querySelector('[data-quiz-result-link]');
  var nav = root.querySelector('.elysian-quiz-nav');

  var answers = { texture: '', origin: '', product: '' };
  var stepIndex = 0;
  var totalSteps = steps.length;

  var textureLabels = {
    straight: 'Straight',
    wavy: 'Wavy',
    curly: 'Curly',
    'deep-curly': 'Deep Curly'
  };

  var originLabels = {
    indian: 'Indian',
    vietnamese: 'Vietnamese',
    cambodian: 'Cambodian',
    burmese: 'Burmese',
    any: 'All origins'
  };

  function showStep(index) {
    stepIndex = index;
    steps.forEach(function (step, i) {
      var active = i === index;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    result.hidden = true;
    nav.hidden = false;
    backBtn.hidden = index === 0;
    stepLabel.hidden = false;
    stepLabel.textContent = 'Question ' + (index + 1) + ' of ' + totalSteps;
    if (progress) {
      progress.style.width = ((index + 1) / totalSteps) * 100 + '%';
    }
  }

  function buildResultUrl() {
    var texture = answers.texture || 'straight';
    var origin = answers.origin || 'any';
    var base = '/collections/';

    if (origin !== 'any') {
      return base + origin;
    }
    return base + texture;
  }

  function showResult() {
    steps.forEach(function (step) {
      step.hidden = true;
      step.classList.remove('is-active');
    });
    nav.hidden = true;
    stepLabel.hidden = true;
    result.hidden = false;
    if (progress) progress.style.width = '100%';

    var texture = textureLabels[answers.texture] || 'Your ideal';
    var origin = originLabels[answers.origin] || '';
    var title = texture + ' hair';
    if (origin && answers.origin !== 'any') {
      title = origin + ' ' + texture + ' hair';
    }

    resultTitle.textContent = title;
    resultText.textContent =
      'Based on your answers, we recommend exploring our ' +
      (answers.origin !== 'any' ? origin + ' collection' : texture + ' texture collection') +
      '. Every piece is raw, single-donor, and ready for your install.';
    resultLink.href = buildResultUrl();
    resultLink.textContent = 'Shop ' + (answers.origin !== 'any' ? origin : texture);
  }

  root.querySelectorAll('.elysian-quiz-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-quiz-key');
      var value = btn.getAttribute('data-quiz-value');
      if (key) answers[key] = value;

      root.querySelectorAll('.elysian-quiz-option').forEach(function (b) {
        b.classList.remove('is-selected');
      });
      btn.classList.add('is-selected');

      if (stepIndex < totalSteps - 1) {
        showStep(stepIndex + 1);
      } else {
        showResult();
      }
    });
  });

  backBtn.addEventListener('click', function () {
    if (stepIndex > 0) showStep(stepIndex - 1);
  });

  restartBtn.addEventListener('click', function () {
    answers = { texture: '', origin: '', product: '' };
    root.querySelectorAll('.elysian-quiz-option').forEach(function (b) {
      b.classList.remove('is-selected');
    });
    showStep(0);
  });

  showStep(0);
})();
