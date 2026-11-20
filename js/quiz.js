/**
 * Kahoot-Style Quiz Engine for Round 1: Rapid Fire
 * Handles single-correct & multi-select questions, speed scoring, and auto-sync to Firebase.
 */
const Quiz = {
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  timerInterval: null,
  secondsLeft: 20,
  quizStartTime: null,
  totalTimeTakenSec: 0,
  selectedIndices: new Set(),
  hasAnswered: false,
  answersRecord: [],

  init() {
    this.questions = (typeof ROUND1_QUESTIONS !== 'undefined' && ROUND1_QUESTIONS.length > 0)
      ? ROUND1_QUESTIONS
      : [];
  },

  start() {
    if (!Auth.currentTeam && Auth.currentRole !== 'admin') {
      alert('Please sign in with your Team ID to begin Round 1.');
      App.openLoginModal();
      return;
    }

    this.init();
    if (this.questions.length === 0) {
      alert('No questions loaded in js/questions.js.');
      return;
    }

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.answersRecord = [];
    this.quizStartTime = Date.now();
    this.totalTimeTakenSec = 0;

    document.getElementById('quiz-intro-card').style.display = 'none';
    document.getElementById('quiz-result-card').style.display = 'none';
    document.getElementById('quiz-arena').style.display = 'block';

    this.loadQuestion(0);
  },

  loadQuestion(index) {
    if (index >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    this.currentIndex = index;
    this.hasAnswered = false;
    this.selectedIndices.clear();

    const q = this.questions[index];
    this.secondsLeft = q.timeLimitSec || 20;

    document.getElementById('quiz-q-num').textContent = `${index + 1} / ${this.questions.length}`;
    document.getElementById('quiz-category').textContent = q.category || 'Technical Concepts';
    document.getElementById('quiz-current-score').textContent = this.score.toLocaleString();

    const streakEl = document.getElementById('quiz-streak-pill');
    if (this.streak > 1) {
      streakEl.style.display = 'inline-flex';
      streakEl.textContent = `🔥 ${this.streak} Streak!`;
    } else {
      streakEl.style.display = 'none';
    }

    const formatBadge = document.getElementById('quiz-format-badge');
    if (q.type === 'multiple') {
      formatBadge.innerHTML = `<span class="badge-multi">☑️ Multiple Select (Choose ALL that apply)</span>`;
    } else {
      formatBadge.innerHTML = `<span class="badge-single">🔘 Single Choice (One correct answer)</span>`;
    }

    document.getElementById('quiz-question-text').textContent = q.question;
    const codeBox = document.getElementById('quiz-code-box');
    if (q.code && q.code.trim()) {
      codeBox.style.display = 'block';
      codeBox.querySelector('pre').textContent = q.code;
    } else {
      codeBox.style.display = 'none';
    }

    const optionsGrid = document.getElementById('quiz-options-grid');
    const kahootSymbols = ['▲', '◆', '●', '■'];
    const cardThemes = ['theme-orange', 'theme-teal', 'theme-yellow', 'theme-sky'];

    optionsGrid.innerHTML = q.options.map((opt, i) => `
      <button 
        type="button"
        class="kahoot-card ${cardThemes[i % 4]}" 
        id="opt-btn-${i}"
        onclick="Quiz.handleOptionClick(${i})"
      >
        <span class="card-shape">${kahootSymbols[i % 4]}</span>
        <span class="card-text">${opt}</span>
        <span class="card-indicator" id="opt-indicator-${i}"></span>
      </button>
    `).join('');

    const multiSubmitBtn = document.getElementById('quiz-multi-submit-btn');
    if (q.type === 'multiple') {
      multiSubmitBtn.style.display = 'inline-flex';
      multiSubmitBtn.disabled = true;
    } else {
      multiSubmitBtn.style.display = 'none';
    }

    document.getElementById('quiz-feedback-bar').style.display = 'none';
    this.startTimer(this.secondsLeft);
  },

  startTimer(totalSeconds) {
    clearInterval(this.timerInterval);
    const timerBar = document.getElementById('quiz-timer-bar');
    const timerText = document.getElementById('quiz-timer-text');

    timerBar.style.width = '100%';
    timerBar.classList.remove('critical');
    timerText.textContent = `${totalSeconds}s`;

    this.timerInterval = setInterval(() => {
      this.secondsLeft--;
      const percent = (this.secondsLeft / totalSeconds) * 100;
      timerBar.style.width = `${Math.max(0, percent)}%`;
      timerText.textContent = `${this.secondsLeft}s`;

      if (this.secondsLeft <= 5 && this.secondsLeft > 0) {
        timerBar.classList.add('critical');
        sounds.tick();
      }

      if (this.secondsLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  },

  handleOptionClick(index) {
    if (this.hasAnswered) return;
    const q = this.questions[this.currentIndex];

    if (q.type === 'single') {
      this.selectedIndices.clear();
      this.selectedIndices.add(index);
      this.evaluateAnswer();
    } else {
      const btn = document.getElementById(`opt-btn-${index}`);
      if (this.selectedIndices.has(index)) {
        this.selectedIndices.delete(index);
        btn.classList.remove('selected-multi');
      } else {
        this.selectedIndices.add(index);
        btn.classList.add('selected-multi');
      }

      const submitBtn = document.getElementById('quiz-multi-submit-btn');
      submitBtn.disabled = this.selectedIndices.size === 0;
    }
  },

  submitMultiSelect() {
    if (this.hasAnswered || this.selectedIndices.size === 0) return;
    this.evaluateAnswer();
  },

  handleTimeout() {
    this.hasAnswered = true;
    this.selectedIndices.clear();
    sounds.wrong();
    this.revealAnswers(false, 0, 'Time expired! No points awarded.');
  },

  evaluateAnswer() {
    this.hasAnswered = true;
    clearInterval(this.timerInterval);

    const q = this.questions[this.currentIndex];
    const correctSet = new Set(q.correct);
    const selected = Array.from(this.selectedIndices);

    const isCorrect = selected.length === correctSet.size &&
                      selected.every(idx => correctSet.has(idx));

    let pointsAwarded = 0;

    if (isCorrect) {
      const totalSec = q.timeLimitSec || 20;
      const speedRatio = Math.max(0.1, this.secondsLeft / totalSec);
      const speedPoints = Math.round(500 + 500 * speedRatio);
      const streakBonus = this.streak * 50;
      pointsAwarded = speedPoints + streakBonus;

      this.score += pointsAwarded;
      this.streak += 1;
      sounds.correct();
      this.revealAnswers(true, pointsAwarded, q.explanation);
    } else {
      this.streak = 0;
      sounds.wrong();
      this.revealAnswers(false, 0, q.explanation);
    }

    this.answersRecord.push({
      questionId: q.id,
      isCorrect,
      pointsEarned: pointsAwarded
    });
  },

  revealAnswers(isCorrect, points, explanation) {
    const q = this.questions[this.currentIndex];
    const correctSet = new Set(q.correct);

    q.options.forEach((_, i) => {
      const btn = document.getElementById(`opt-btn-${i}`);
      const indicator = document.getElementById(`opt-indicator-${i}`);
      const isThisCorrect = correctSet.has(i);
      const isThisSelected = this.selectedIndices.has(i);

      if (isThisCorrect) {
        btn.classList.add('correct-answer');
        indicator.textContent = '✓ Correct';
      } else if (isThisSelected && !isThisCorrect) {
        btn.classList.add('wrong-answer');
        indicator.textContent = '✕ Selected';
      } else {
        btn.classList.add('faded-answer');
      }
    });

    const submitBtn = document.getElementById('quiz-multi-submit-btn');
    if (submitBtn) submitBtn.style.display = 'none';

    const feedbackBar = document.getElementById('quiz-feedback-bar');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackPoints = document.getElementById('feedback-points');
    const feedbackExplanation = document.getElementById('feedback-explanation');

    feedbackBar.style.display = 'block';
    if (isCorrect) {
      feedbackBar.className = 'feedback-bar feedback-correct';
      feedbackTitle.textContent = '🎉 Correct Answer!';
      feedbackPoints.textContent = `+${points.toLocaleString()} pts`;
    } else {
      feedbackBar.className = 'feedback-bar feedback-wrong';
      feedbackTitle.textContent = this.selectedIndices.size === 0 ? '⏰ Time Out!' : '❌ Incorrect!';
      feedbackPoints.textContent = '+0 pts';
    }

    feedbackExplanation.textContent = explanation || '';
    document.getElementById('quiz-current-score').textContent = this.score.toLocaleString();
  },

  nextQuestion() {
    this.loadQuestion(this.currentIndex + 1);
  },

  finishQuiz() {
    clearInterval(this.timerInterval);
    this.totalTimeTakenSec = Math.round((Date.now() - this.quizStartTime) / 1000);

    document.getElementById('quiz-arena').style.display = 'none';
    document.getElementById('quiz-result-card').style.display = 'block';

    const correctCount = this.answersRecord.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / this.questions.length) * 100);

    document.getElementById('result-team-name').textContent = Auth.currentTeam?.name || 'Guest Team';
    document.getElementById('result-final-score').textContent = this.score.toLocaleString();
    document.getElementById('result-accuracy').textContent = `${accuracy}% (${correctCount}/${this.questions.length})`;
    document.getElementById('result-time').textContent = `${this.totalTimeTakenSec} seconds`;

    // AUTO-RECORD TO LEADERBOARD & FIREBASE:
    if (Auth.currentTeam) {
      Leaderboard.recordQuizScore(Auth.currentTeam.id, this.score, this.totalTimeTakenSec);
    }
  }
};
