/**
 * Home Screen — Subject selection grid with progress stats
 */

import { SUBJECTS, getSubjectById, getSubtopicName, TOTAL_QUESTIONS_COUNT } from '../lib/subjects.js';
import { getOverallStats, getSubjectStats, getInProgress } from '../lib/storage.js';
import { haptic } from '../lib/haptics.js';
import { sound, isSoundEnabled, toggleSound } from '../lib/audio.js';

export function renderHome(app, { onSelectSubject, onOpenDashboard, onResumeQuiz }) {
  const stats = getOverallStats();
  const inProgress = getInProgress();

  app.innerHTML = `
    <header class="header">
      <div class="header-content">
        <div class="header-logo">
          <div class="header-logo-icon">D</div>
          <div>
            <div class="header-title">DOST-SEI Reviewer</div>
            <div class="header-subtitle">Scholarship Exam Practice</div>
          </div>
        </div>
        <div class="header-actions">
          <button class="header-sound-btn" id="btn-sound" aria-label="Toggle Sound">
            🔊
          </button>
          <button class="header-theme-btn" id="btn-theme" aria-label="Toggle Theme">
            🌙
          </button>
          <button class="header-stats-btn" id="btn-dashboard" aria-label="View Dashboard">
            📊
          </button>
        </div>
      </div>
    </header>

    <div class="notification-bar d-none" id="notif-bar">
      <div class="notification-content" id="notif-text">Loading...</div>
      <button class="notification-close" id="btn-close-notif" aria-label="Dismiss">&times;</button>
    </div>

    <div class="screen">
      <div class="hero">
        <div class="hero-badge">🎓 Free Reviewer · ${TOTAL_QUESTIONS_COUNT.toLocaleString()} Questions</div>
        <h1>Ace the DOST Exam</h1>
        <p>Practice with ${TOTAL_QUESTIONS_COUNT.toLocaleString()} questions across Science, Math, English & Reasoning with instant feedback and step-by-step explanations.</p>
      </div>

      ${inProgress ? `
        <div class="dashboard-card" style="margin-bottom: var(--space-lg); cursor: pointer; border-color: var(--primary-500);" id="resume-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: var(--font-xs); color: var(--primary-400); font-weight: 600; text-transform: uppercase;">Continue Quiz</div>
              <div style="font-size: var(--font-sm); font-weight: 600; margin-top: 2px;">
                ${getSubjectName(inProgress.subject)}${inProgress.subtopicId && inProgress.subtopicId !== 'all' ? ` · ${getSubtopicName(inProgress.subject, inProgress.subtopicId)}` : ''}
              </div>
              <div style="font-size: var(--font-xs); color: var(--text-muted);">Question ${inProgress.currentIndex + 1} of ${inProgress.questions.length}</div>
            </div>
            <div style="font-size: 1.5rem;">▶️</div>
          </div>
        </div>
      ` : ''}

      <div class="stats-summary">
        <div class="stat-card">
          <div class="stat-value">${stats.totalAttempts}</div>
          <div class="stat-label">Quizzes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalQuestions}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.avgScore > 0 ? Math.round(stats.avgScore) + '%' : '—'}</div>
          <div class="stat-label">Avg Score</div>
        </div>
      </div>

      <div class="section-title">Choose a Subject</div>
      <div class="subject-grid">
        ${SUBJECTS.map(subject => {
    const subStats = getSubjectStats(subject.id);
    return `
            <div class="subject-card" data-subject="${subject.id}" style="--subject-color: ${subject.color}">
              <span class="subject-icon">${subject.icon}</span>
              <div class="subject-name">${subject.name}</div>
              <div class="subject-meta">${subject.description}</div>
              ${subStats.attempts > 0 ? `
                <div class="subject-progress">
                  <div class="subject-progress-bar" style="width: ${Math.min(subStats.avgScore, 100)}%"></div>
                </div>
                <div class="subject-meta" style="margin-top: 4px;">${subStats.avgScore}% avg · ${subStats.attempts} tries</div>
              ` : `
                <div class="subject-meta" style="margin-top: var(--space-sm); color: var(--primary-400);">Start →</div>
              `}
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;

  // Bind events
  document.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      haptic.medium();
      sound.select();
      openSubtopicModal(card.dataset.subject);
    });
  });

  function openSubtopicModal(subjectId) {
    const subject = getSubjectById(subjectId);
    if (!subject) return;

    closeSubtopicModal();

    const overlay = document.createElement('div');
    overlay.className = 'subtopic-modal-overlay';
    overlay.id = 'subtopic-modal-overlay';

    const subtopics = subject.subtopics || [];

    overlay.innerHTML = `
      <div class="subtopic-modal" role="dialog" aria-modal="true" style="--modal-color: ${subject.color}">
        <div class="subtopic-modal-header">
          <div class="subtopic-modal-title-group">
            <span class="subtopic-modal-icon">${subject.icon}</span>
            <div>
              <h2 class="subtopic-modal-title">${subject.name}</h2>
              <p class="subtopic-modal-subtitle">Choose a focus area or practice all combined</p>
            </div>
          </div>
          <button class="subtopic-modal-close" id="btn-close-subtopics" aria-label="Close">✕</button>
        </div>

        <div class="subtopic-list">
          ${subtopics.map(st => `
            <button class="subtopic-item ${st.id === 'all' ? 'featured' : ''}" data-subtopic="${st.id}">
              <span class="subtopic-item-icon">${st.icon}</span>
              <div class="subtopic-item-info">
                <div class="subtopic-item-header">
                  <span class="subtopic-item-name">${st.name}</span>
                  <span class="subtopic-item-badge">${st.count} Qs</span>
                </div>
                <p class="subtopic-item-desc">${st.description}</p>
              </div>
              <span class="subtopic-item-arrow">→</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Click subtopic
    overlay.querySelectorAll('.subtopic-item').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic.medium();
        sound.select();
        const subtopicId = btn.dataset.subtopic;
        closeSubtopicModal();
        onSelectSubject(subjectId, subtopicId);
      });
    });

    // Close button
    document.getElementById('btn-close-subtopics')?.addEventListener('click', () => {
      haptic.tap();
      sound.tap();
      closeSubtopicModal();
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        haptic.tap();
        sound.tap();
        closeSubtopicModal();
      }
    });

    // Esc key to close
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSubtopicModal();
        window.removeEventListener('keydown', onKeyDown);
      }
    };
    window.addEventListener('keydown', onKeyDown);
  }

  function closeSubtopicModal() {
    const existing = document.getElementById('subtopic-modal-overlay');
    if (existing) {
      existing.remove();
      document.body.style.overflow = '';
    }
  }

  document.getElementById('btn-dashboard')?.addEventListener('click', () => {
    haptic.light();
    sound.tap();
    onOpenDashboard();
  });

  document.getElementById('resume-card')?.addEventListener('click', () => {
    haptic.medium();
    sound.select();
    if (inProgress) onResumeQuiz(inProgress);
  });

  // Sound Toggle Logic
  const soundBtn = document.getElementById('btn-sound');
  const updateSoundIcon = () => {
    if (soundBtn) soundBtn.textContent = isSoundEnabled() ? '🔊' : '🔇';
  };
  updateSoundIcon();

  soundBtn?.addEventListener('click', () => {
    haptic.tap();
    toggleSound();
    updateSoundIcon();
  });

  // Theme Toggle Logic
  const themeBtn = document.getElementById('btn-theme');
  const updateThemeIcon = () => {
    themeBtn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
  };
  updateThemeIcon(); // init

  themeBtn?.addEventListener('click', () => {
    haptic.tap();
    sound.toggle();
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
  });

  // Notification Logic
  const notifBar = document.getElementById('notif-bar');
  const notifText = document.getElementById('notif-text');
  const closeNotifBtn = document.getElementById('btn-close-notif');

  fetch('/notif.txt?t=' + Date.now())
    .then(res => {
      if (!res.ok) throw new Error('No notif.txt');
      return res.text();
    })
    .then(text => {
      const trimmed = text.trim();
      if (trimmed) {
        const dismissedNotif = localStorage.getItem('dismissed_notif');
        if (dismissedNotif !== trimmed) {
          // Show it
          notifText.textContent = trimmed;
          notifBar.classList.remove('d-none');
        }
      }
    })
    .catch(() => { /* do nothing */ });

  closeNotifBtn?.addEventListener('click', () => {
    haptic.tap();
    sound.tap();
    notifBar.classList.add('d-none');
    localStorage.setItem('dismissed_notif', notifText.textContent.trim());
  });
}

function getSubjectName(id) {
  const subject = SUBJECTS.find(s => s.id === id);
  return subject ? subject.name : id;
}
