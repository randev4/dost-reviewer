/**
 * Results Screen — Shows score, review of each question with explanations
 */

import { getSubjectById } from '../lib/subjects.js';
import { renderLatex } from '../lib/katex-render.js';
import { bindImageZoom } from '../lib/lightbox.js';
import { haptic } from '../lib/haptics.js';
import { sound } from '../lib/audio.js';
import { fireGrandConfetti } from '../lib/confetti.js';

export function renderResults(app, { subject, subtopicId = 'all', subtopicName, gradeResult, onRetry, onHome }) {
  const subjectInfo = getSubjectById(subject);
  const displaySubtitle = subtopicName && subtopicId !== 'all'
    ? `${subjectInfo?.name || subject} · ${subtopicName}`
    : (subjectInfo?.name || subject);
  const { correct, total, results } = gradeResult;
  const percentage = Math.round((correct / total) * 100);

  // Determine color and message
  let scoreColor, message, submessage;
  if (percentage >= 80) {
    scoreColor = 'var(--success)';
    message = 'Excellent! 🌟';
    submessage = 'You\'re well prepared for this section!';
  } else if (percentage >= 60) {
    scoreColor = 'var(--primary-400)';
    message = 'Good Job! 👍';
    submessage = 'Keep practicing to improve further.';
  } else if (percentage >= 40) {
    scoreColor = 'var(--warning)';
    message = 'Keep Going! 💪';
    submessage = 'Review your answers below to learn from mistakes.';
  } else {
    scoreColor = 'var(--danger)';
    message = 'Needs More Practice 📚';
    submessage = 'Don\'t worry — review your answers and try again!';
  }

  // SVG ring calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  app.innerHTML = `
    <header class="header">
      <div class="header-content">
        <button class="header-back" id="btn-home">← Home</button>
        <div style="text-align: right;">
          <div class="header-title">Results</div>
          <div class="header-subtitle">${displaySubtitle}</div>
        </div>
      </div>
    </header>

    <div class="screen">
      <div class="results-hero">
        <div class="results-score-ring">
          <svg viewBox="0 0 128 128">
            <circle class="ring-bg" cx="64" cy="64" r="${radius}" />
            <circle class="ring-fill" cx="64" cy="64" r="${radius}"
              stroke="${scoreColor}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"
            />
          </svg>
          <div class="results-score-value">
            <div class="number" style="color: ${scoreColor}">${correct}/${total}</div>
            <div class="percent">${percentage}%</div>
          </div>
        </div>
        <div class="results-message">${message}</div>
        <div class="results-submessage">${submessage}</div>
      </div>

      <div class="results-actions">
        <button class="nav-btn primary" id="btn-retry" style="flex: 1;">
          🔄 ${subtopicName && subtopicId !== 'all' ? `New ${subtopicName} Set` : 'New Set'}
        </button>
        <button class="nav-btn secondary" id="btn-home-bottom" style="flex: 1;">
          📋 Subjects
        </button>
      </div>

      <div class="review-section">
        <div class="section-title">Question Review</div>
        <div id="review-items">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `;

  // Bind actions
  document.getElementById('btn-home').addEventListener('click', () => {
    haptic.light();
    sound.tap();
    onHome();
  });
  document.getElementById('btn-home-bottom').addEventListener('click', () => {
    haptic.light();
    sound.tap();
    onHome();
  });
  document.getElementById('btn-retry').addEventListener('click', () => {
    haptic.medium();
    sound.select();
    onRetry();
  });

  // Play celebration or completion audio
  setTimeout(() => {
    if (percentage >= 70) {
      sound.fanfare();
      fireGrandConfetti();
    } else {
      sound.select();
    }
  }, 180);

  // Render review items with LaTeX (async)
  renderReviewItems(results);
}

async function renderReviewItems(results) {
  const container = document.getElementById('review-items');
  if (!container) return;

  let html = '';
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const q = r.question;

    let statusClass = 'incorrect';
    let statusIcon = '❌';
    let statusText = 'Incorrect';

    if (r.isCorrect) {
      statusClass = 'correct';
      statusIcon = '✅';
      statusText = 'Correct';
    } else if (!r.userAnswer) {
      statusClass = 'unanswered';
      statusIcon = '⚪';
      statusText = 'Unanswered';
    }

    // Render question text
    const questionText = await renderLatex(q.questionLatex || q.question);

    const isUnanswered = !r.userAnswer;

    // Find answer texts (omit correct answer lookup when unanswered)
    const correctChoice = (!isUnanswered && q.choices.items) ? q.choices.items.find(c => c.key === r.correctKey) : null;
    const userChoice = r.userAnswer ? q.choices.items.find(c => c.key === r.userAnswer) : null;

    const correctText = correctChoice ? await renderLatex(correctChoice.textLatex ?? correctChoice.text) : '';
    const userText = userChoice ? await renderLatex(userChoice.textLatex ?? userChoice.text) : '';

    // Choice images
    const correctImg = correctChoice?.image ? `<img class="choice-image" src="/images/questions/${correctChoice.image}" alt="Correct choice" style="max-width:120px; margin-top:4px; border-radius:4px; display:block;" />` : '';
    const userImg = userChoice?.image ? `<img class="choice-image" src="/images/questions/${userChoice.image}" alt="Your choice" style="max-width:120px; margin-top:4px; border-radius:4px; display:block;" />` : '';

    html += `
      <div class="review-item ${statusClass}">
        <div class="review-header">
          <span style="font-size: var(--font-xs); color: var(--text-muted); font-weight: 600;">
            Question ${i + 1}
          </span>
          <span class="review-status ${statusClass}">
            ${statusIcon} ${statusText}
          </span>
        </div>
        <div class="review-question">${questionText}</div>
        ${q.image ? `<img class="question-image" src="/images/questions/${q.image}" alt="Question diagram" style="max-width: 100%; margin-bottom: var(--space-md);" />` : ''}
        <div class="review-answer-row">
          ${r.isCorrect ? `
            <span class="review-answer-tag correct-answer">
              Your answer: ${r.correctKey}. ${correctText}${correctImg}
            </span>
          ` : r.userAnswer ? `
            <span class="review-answer-tag your-answer">
              Your answer: ${r.userAnswer}. ${userText}${userImg}
            </span>
            <span class="review-answer-tag correct-answer">
              Correct: ${r.correctKey}. ${correctText}${correctImg}
            </span>
          ` : `
            <span class="review-answer-tag unanswered-tag">
              Your answer: <em>Unanswered</em>
            </span>
          `}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  bindImageZoom();
}
