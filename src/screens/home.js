/**
 * Home Screen — Subject selection grid with progress stats
 */

import { SUBJECTS } from '../lib/subjects.js';
import { getOverallStats, getSubjectStats, getInProgress } from '../lib/storage.js';

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
        <button class="header-stats-btn" id="btn-dashboard" aria-label="View Dashboard">
          📊
        </button>
      </div>
    </header>

    <div class="screen">
      <div class="hero">
        <div class="hero-badge">🎓 Free Reviewer</div>
        <h1>Ace the DOST Exam</h1>
        <p>Practice with randomized questions, get instant feedback, and track your progress.</p>
      </div>

      ${inProgress ? `
        <div class="dashboard-card" style="margin-bottom: var(--space-lg); cursor: pointer; border-color: var(--primary-500);" id="resume-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: var(--font-xs); color: var(--primary-400); font-weight: 600; text-transform: uppercase;">Continue Quiz</div>
              <div style="font-size: var(--font-sm); font-weight: 600; margin-top: 2px;">${getSubjectName(inProgress.subject)}</div>
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
            onSelectSubject(card.dataset.subject);
        });
    });

    document.getElementById('btn-dashboard')?.addEventListener('click', onOpenDashboard);

    document.getElementById('resume-card')?.addEventListener('click', () => {
        if (inProgress) onResumeQuiz(inProgress);
    });
}

function getSubjectName(id) {
    const subject = SUBJECTS.find(s => s.id === id);
    return subject ? subject.name : id;
}
