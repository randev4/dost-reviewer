/**
 * Quiz Screen — Displays questions one at a time with navigation
 */

import { getSubjectById } from '../lib/subjects.js';
import { renderLatex } from '../lib/katex-render.js';
import { saveProgress } from '../lib/storage.js';
import { bindImageZoom } from '../lib/lightbox.js';
import { haptic } from '../lib/haptics.js';
import { sound, isSoundEnabled, toggleSound } from '../lib/audio.js';

export function renderQuiz(app, { subject, subtopicId = 'all', subtopicName, questions, currentIndex = 0, answers = {}, onBack, onFinish }) {
  const subjectInfo = getSubjectById(subject);
  const total = questions.length;
  const displayTitle = subtopicName && subtopicId !== 'all'
    ? `${subjectInfo?.name || subject} · ${subtopicName}`
    : (subjectInfo?.name || subject);

  function render(index) {
    const q = questions[index];
    const selectedAnswer = answers[index] || null;
    const progress = ((index + 1) / total) * 100;
    const isLast = index === total - 1;

    // Difficulty dots
    const diffDots = Array.from({ length: 3 }, (_, i) =>
      `<span class="dot ${i < q.difficulty ? 'active' : ''}"></span>`
    ).join('');

    app.innerHTML = `
      <header class="header">
        <div class="header-content">
          <button class="header-back" id="btn-back">← Back</button>
          <div style="display: flex; align-items: center; gap: var(--space-sm);">
            <button class="header-sound-btn" id="btn-sound" aria-label="Toggle Sound" style="width: 36px; height: 36px; font-size: 1.05rem;">
              ${isSoundEnabled() ? '🔊' : '🔇'}
            </button>
            <div style="text-align: right;">
              <div class="header-title">${displayTitle}</div>
              <div class="header-subtitle">Question ${index + 1} of ${total}</div>
            </div>
          </div>
        </div>
      </header>

      <div class="screen">
        <div class="quiz-progress">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="quiz-progress-text">${index + 1}/${total}</span>
        </div>

        <div class="question-card" id="question-card">
          <div class="question-number">
            Question ${index + 1}
            <span class="question-difficulty">${diffDots}</span>
          </div>
          <div class="question-text" id="question-text">Loading...</div>
          ${q.image ? `<img class="question-image" src="/images/questions/${q.image}" alt="Question diagram" />` : ''}
          <div class="choices" id="choices-container">
            <!-- Choices rendered after LaTeX -->
          </div>
        </div>

        <div class="quiz-nav">
          <button class="nav-btn secondary" id="btn-prev" ${index === 0 ? 'disabled' : ''}>
            ← Prev
          </button>
          ${isLast ? `
            <button class="nav-btn submit" id="btn-submit">
              Submit ✓
            </button>
          ` : `
            <button class="nav-btn primary" id="btn-next">
              Next →
            </button>
          `}
        </div>

        <div class="quiz-dots">
          ${Array.from({ length: total }, (_, i) => {
      const answered = answers[i] != null;
      const isCurrent = i === index;
      return `<div class="q-dot ${isCurrent ? 'current' : ''} ${answered ? 'answered' : ''}" style="${isCurrent ? 'border-color: var(--primary-500);' : ''} ${answered ? 'background: var(--primary-600); color: white;' : ''}" data-index="${i}">${i + 1}</div>`;
    }).join('')}
        </div>
      </div>
    `;

    // Render question text with LaTeX
    renderQuestionContent(q, selectedAnswer).then(() => {
      bindImageZoom();
    });

    // Bind events
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      haptic.tap();
      const enabled = toggleSound();
      const soundBtn = document.getElementById('btn-sound');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    document.getElementById('btn-back').addEventListener('click', () => {
      haptic.light();
      sound.tap();
      if (confirm('Leave quiz? Your progress will be saved.')) {
        saveQuizProgress(subject, subtopicId, questions, index, answers);
        onBack();
      }
    });

    document.getElementById('btn-prev')?.addEventListener('click', () => {
      haptic.light();
      sound.prev();
      if (index > 0) render(index - 1);
    });

    document.getElementById('btn-next')?.addEventListener('click', () => {
      haptic.light();
      sound.next();
      render(index + 1);
    });

    document.getElementById('btn-submit')?.addEventListener('click', () => {
      const unanswered = Object.keys(answers).length;
      if (unanswered < total) {
        haptic.warning();
        sound.incorrect();
        const proceed = confirm(`You have ${total - unanswered} unanswered question(s). Submit anyway?`);
        if (!proceed) return;
      }
      haptic.success();
      sound.submit();
      onFinish(answers);
    });

    // Question number dots
    document.querySelectorAll('.q-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        haptic.tap();
        sound.tap();
        render(parseInt(dot.dataset.index));
      });
    });
  }

  async function renderQuestionContent(q, selectedAnswer) {
    const questionTextEl = document.getElementById('question-text');
    const choicesEl = document.getElementById('choices-container');

    // Render question text
    const questionContent = q.questionLatex || q.question;
    questionTextEl.innerHTML = await renderLatex(questionContent);

    // Render choices
    let choicesHtml = '';
    for (const choice of q.choices.items) {
      const isSelected = selectedAnswer === choice.key;
      const choiceText = await renderLatex(choice.textLatex ?? choice.text);
      choicesHtml += `
        <button class="choice-btn ${isSelected ? 'selected' : ''}" data-key="${choice.key}">
          <span class="choice-key">${choice.key}</span>
          <span class="choice-text">${choiceText}</span>
          ${choice.image ? `<img class="choice-image" src="/images/questions/${choice.image}" alt="Choice ${choice.key}" />` : ''}
        </button>
      `;
    }
    choicesEl.innerHTML = choicesHtml;

    // Bind choice events
    choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic.tap();
        sound.tap();
        const key = btn.dataset.key;
        answers[questions.indexOf(q)] = key;

        // Update UI
        choicesEl.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Update the question dot
        const currentIdx = questions.indexOf(q);
        const dot = document.querySelector(`.q-dot[data-index="${currentIdx}"]`);
        if (dot) {
          dot.classList.add('answered');
          dot.style.background = 'var(--primary-600)';
          dot.style.color = 'white';
        }

        // Save progress
        saveQuizProgress(subject, subtopicId, questions, currentIdx, answers);
      });
    });
  }

  render(currentIndex);
}

function saveQuizProgress(subject, subtopicId, questions, currentIndex, answers) {
  saveProgress({
    subject,
    subtopicId,
    questions,
    currentIndex,
    answers
  });
}
