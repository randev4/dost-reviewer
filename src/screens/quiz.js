/**
 * Quiz Screen — Displays questions one at a time with instant "Check Answer" feedback
 */

import { getSubjectById } from '../lib/subjects.js';
import { renderLatex } from '../lib/katex-render.js';
import { saveProgress } from '../lib/storage.js';
import { bindImageZoom } from '../lib/lightbox.js';
import { haptic } from '../lib/haptics.js';
import { sound, isSoundEnabled, toggleSound } from '../lib/audio.js';

export function renderQuiz(app, {
  subject,
  subtopicId = 'all',
  subtopicName,
  questions,
  currentIndex = 0,
  answers = {},
  checkedItems = {},
  onBack,
  onFinish
}) {
  const subjectInfo = getSubjectById(subject);
  const total = questions.length;
  const displayTitle = subtopicName && subtopicId !== 'all'
    ? `${subjectInfo?.name || subject} · ${subtopicName}`
    : (subjectInfo?.name || subject);

  function render(index) {
    const q = questions[index];
    const selectedAnswer = answers[index] || null;
    const isChecked = !!checkedItems[index];
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
          <div class="choices ${isChecked ? 'locked' : ''}" id="choices-container">
            <!-- Choices rendered after LaTeX -->
          </div>
          <div id="feedback-container">
            <!-- Immediate feedback rendered here after Check -->
          </div>
        </div>

        <div class="quiz-nav">
          <button class="nav-btn secondary" id="btn-prev" ${index === 0 ? 'disabled' : ''}>
            ← Prev
          </button>
          ${!isChecked ? `
            <button class="nav-btn check" id="btn-check" ${!selectedAnswer ? 'disabled' : ''}>
              Check Answer 🔍
            </button>
          ` : isLast ? `
            <button class="nav-btn submit" id="btn-submit">
              Finish Quiz ✓
            </button>
          ` : `
            <button class="nav-btn primary" id="btn-next">
              Next →
            </button>
          `}
        </div>

        <div class="quiz-dots">
          ${Array.from({ length: total }, (_, i) => {
            const isCheckedDot = !!checkedItems[i];
            const isCurrentDot = i === index;
            const dotCorrect = isCheckedDot && answers[i] === questions[i].choices.correctKey;

            let dotClass = 'q-dot';
            if (isCurrentDot) dotClass += ' current';
            if (isCheckedDot) {
              dotClass += dotCorrect ? ' correct' : ' incorrect';
            } else if (answers[i] != null) {
              dotClass += ' answered';
            }

            return `<div class="${dotClass}" data-index="${i}">${i + 1}</div>`;
          }).join('')}
        </div>
      </div>
    `;

    // Render question content & choices
    renderQuestionContent(q, selectedAnswer, isChecked).then(() => {
      bindImageZoom();
    });

    // Bind header & navigation events
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
        saveQuizProgress(subject, subtopicId, questions, index, answers, checkedItems);
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

    bindSubmitEvent();
    bindCheckEvent(q, index);

    // Question number dots navigation
    document.querySelectorAll('.q-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        haptic.tap();
        sound.tap();
        render(parseInt(dot.dataset.index, 10));
      });
    });
  }

  function bindSubmitEvent() {
    document.getElementById('btn-submit')?.addEventListener('click', () => {
      const checkedCount = Object.keys(checkedItems).length;
      if (checkedCount < total) {
        haptic.warning();
        sound.incorrect();
        const proceed = confirm(`You have ${total - checkedCount} unchecked question(s). Finish anyway?`);
        if (!proceed) return;
      }
      haptic.success();
      sound.submit();
      onFinish(answers);
    });
  }

  function bindCheckEvent(q, index) {
    document.getElementById('btn-check')?.addEventListener('click', async () => {
      const currentAnswer = answers[index];
      if (!currentAnswer) return;

      checkedItems[index] = true;
      const isCorrect = currentAnswer === q.choices.correctKey;

      if (isCorrect) {
        haptic.success();
        sound.correct();
      } else {
        haptic.warning();
        sound.incorrect();
      }

      // Lock choices and highlight correct & incorrect answers
      const choicesEl = document.getElementById('choices-container');
      if (choicesEl) {
        choicesEl.classList.add('locked');
        choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
          btn.disabled = true;
          const key = btn.dataset.key;
          if (key === q.choices.correctKey) {
            btn.classList.add('correct');
          } else if (key === currentAnswer) {
            btn.classList.add('incorrect');
          }
        });
      }

      // Update question dot immediately
      const dot = document.querySelector(`.q-dot[data-index="${index}"]`);
      if (dot) {
        dot.classList.remove('answered');
        dot.classList.add(isCorrect ? 'correct' : 'incorrect');
      }

      // Render feedback card with explanation
      await renderFeedback(q, currentAnswer);

      // Smooth scroll into view for long questions
      const feedbackEl = document.getElementById('feedback-container');
      if (feedbackEl) {
        feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Transform button to Next or Finish
      const navContainer = document.querySelector('.quiz-nav');
      if (navContainer) {
        const isLast = index === total - 1;
        const nextBtnHtml = isLast ? `
          <button class="nav-btn submit" id="btn-submit">
            Finish Quiz ✓
          </button>
        ` : `
          <button class="nav-btn primary" id="btn-next">
            Next →
          </button>
        `;

        document.getElementById('btn-check')?.remove();
        navContainer.insertAdjacentHTML('beforeend', nextBtnHtml);

        if (isLast) {
          bindSubmitEvent();
        } else {
          document.getElementById('btn-next')?.addEventListener('click', () => {
            haptic.light();
            sound.next();
            render(index + 1);
          });
        }
      }

      // Save progress
      saveQuizProgress(subject, subtopicId, questions, index, answers, checkedItems);
    });
  }

  async function renderQuestionContent(q, selectedAnswer, isChecked) {
    const questionTextEl = document.getElementById('question-text');
    const choicesEl = document.getElementById('choices-container');
    const feedbackEl = document.getElementById('feedback-container');

    // Render question text with LaTeX
    const questionContent = q.questionLatex || q.question;
    questionTextEl.innerHTML = await renderLatex(questionContent);

    // Render choices
    let choicesHtml = '';
    for (const choice of q.choices.items) {
      const isSelected = selectedAnswer === choice.key;
      let choiceClasses = 'choice-btn';
      if (isSelected) choiceClasses += ' selected';
      if (isChecked) {
        if (choice.key === q.choices.correctKey) {
          choiceClasses += ' correct';
        } else if (isSelected) {
          choiceClasses += ' incorrect';
        }
      }

      const choiceText = await renderLatex(choice.textLatex ?? choice.text);
      choicesHtml += `
        <button class="${choiceClasses}" data-key="${choice.key}" ${isChecked ? 'disabled' : ''}>
          <span class="choice-key">${choice.key}</span>
          <span class="choice-text">${choiceText}</span>
          ${choice.image ? `<img class="choice-image" src="/images/questions/${choice.image}" alt="Choice ${choice.key}" />` : ''}
        </button>
      `;
    }
    choicesEl.innerHTML = choicesHtml;

    // Render feedback card if already checked
    if (isChecked) {
      await renderFeedback(q, selectedAnswer);
    } else if (feedbackEl) {
      feedbackEl.innerHTML = '';
      feedbackEl.className = '';
    }

    // Bind choice events (only active before checking)
    if (!isChecked) {
      choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          haptic.tap();
          sound.tap();
          const key = btn.dataset.key;
          answers[questions.indexOf(q)] = key;

          // Update UI
          choicesEl.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          // Enable Check button
          const checkBtn = document.getElementById('btn-check');
          if (checkBtn) {
            checkBtn.disabled = false;
          }

          // Save progress
          saveQuizProgress(subject, subtopicId, questions, questions.indexOf(q), answers, checkedItems);
        });
      });
    }
  }

  async function renderFeedback(q, selectedAnswer) {
    const feedbackEl = document.getElementById('feedback-container');
    if (!feedbackEl) return;

    const isCorrect = selectedAnswer === q.choices.correctKey;
    const correctChoice = q.choices.items.find(c => c.key === q.choices.correctKey);
    const correctText = correctChoice ? await renderLatex(correctChoice.textLatex ?? correctChoice.text) : q.choices.correctKey;

    // Explanation
    const explanationContent = q.explanationLatex || q.explanation;
    const renderedExplanation = await renderLatex(explanationContent);

    // Wrong reason if user made an incorrect choice
    let wrongReasonHtml = '';
    if (!isCorrect && selectedAnswer) {
      const selectedChoice = q.choices.items.find(c => c.key === selectedAnswer);
      if (selectedChoice && q.wrongExplanations && q.wrongExplanations[selectedChoice.originalKey]) {
        const renderedWrongReason = await renderLatex(q.wrongExplanations[selectedChoice.originalKey]);
        wrongReasonHtml = `
          <div class="quiz-feedback-wrong-reason">
            <strong>Why "${selectedAnswer}" is incorrect:</strong><br/>
            ${renderedWrongReason}
          </div>
        `;
      }
    }

    feedbackEl.className = `quiz-feedback-card ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = `
      <div class="quiz-feedback-header">
        <span class="quiz-feedback-badge ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </span>
        ${!isCorrect ? `
          <span class="quiz-feedback-answer-tag">
            Correct Answer: <strong>${q.choices.correctKey}. ${correctText}</strong>
          </span>
        ` : ''}
      </div>
      <div class="quiz-feedback-body">
        <strong>💡 Explanation:</strong><br/>
        ${renderedExplanation}
      </div>
      ${wrongReasonHtml}
    `;

    bindImageZoom();
  }

  render(currentIndex);
}

function saveQuizProgress(subject, subtopicId, questions, currentIndex, answers, checkedItems) {
  saveProgress({
    subject,
    subtopicId,
    questions,
    currentIndex,
    answers,
    checkedItems
  });
}
