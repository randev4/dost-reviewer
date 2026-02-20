/**
 * Dashboard Screen — Progress stats, history, and readiness meter
 */

import { SUBJECTS } from '../lib/subjects.js';
import { getOverallStats, getSubjectStats, getHistory, resetAllData } from '../lib/storage.js';

export function renderDashboard(app, { onBack }) {
    const stats = getOverallStats();
    const history = getHistory().slice(-20).reverse(); // Last 20, newest first

    // Calculate readiness (weighted average across subjects with attempts)
    const subjectScores = SUBJECTS.map(s => getSubjectStats(s.id)).filter(s => s.attempts > 0);
    const readiness = subjectScores.length > 0
        ? Math.round(subjectScores.reduce((sum, s) => sum + s.avgScore, 0) / subjectScores.length)
        : 0;

    app.innerHTML = `
    <header class="header">
      <div class="header-content">
        <button class="header-back" id="btn-back">← Back</button>
        <div style="text-align: right;">
          <div class="header-title">Dashboard</div>
          <div class="header-subtitle">Your Progress</div>
        </div>
      </div>
    </header>

    <div class="screen">
      <!-- Readiness Meter -->
      <div class="dashboard-card">
        <div class="readiness-meter">
          <div class="readiness-value">${readiness > 0 ? readiness + '%' : '—'}</div>
          <div class="readiness-label">Overall Readiness Score</div>
        </div>
      </div>

      <!-- Overall Stats -->
      <div class="stats-summary" style="margin-bottom: var(--space-md);">
        <div class="stat-card">
          <div class="stat-value">${stats.totalAttempts}</div>
          <div class="stat-label">Total Quizzes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCorrect}</div>
          <div class="stat-label">Correct</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalQuestions > 0 ? Math.round(stats.avgScore) + '%' : '—'}</div>
          <div class="stat-label">Average</div>
        </div>
      </div>

      <!-- Per-Subject Breakdown -->
      <div class="dashboard-card">
        <div class="dashboard-card-title">📊 Subject Breakdown</div>
        ${SUBJECTS.map(subject => {
        const subStats = getSubjectStats(subject.id);
        return `
            <div class="subject-stat-row">
              <span class="subject-stat-name">
                ${subject.icon} ${subject.name}
              </span>
              ${subStats.attempts > 0 ? `
                <span class="subject-stat-score">${subStats.avgScore}% <span style="color: var(--text-muted); font-weight: 400;">(${subStats.attempts})</span></span>
              ` : `
                <span style="font-size: var(--font-xs); color: var(--text-muted);">Not started</span>
              `}
            </div>
          `;
    }).join('')}
      </div>

      <!-- Recent History -->
      <div class="dashboard-card">
        <div class="dashboard-card-title">📅 Recent History</div>
        ${history.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>No quizzes taken yet.<br/>Select a subject to start!</p>
          </div>
        ` : history.map(h => {
        const subject = SUBJECTS.find(s => s.id === h.subject);
        const pct = Math.round((h.score / h.total) * 100);
        const scoreClass = pct >= 70 ? 'good' : pct >= 40 ? 'ok' : 'low';
        const date = formatDate(h.date);
        return `
            <div class="history-item">
              <div>
                <div class="history-subject">${subject?.icon || ''} ${subject?.name || h.subject}</div>
                <div class="history-date">${date}</div>
              </div>
              <span class="history-score ${scoreClass}">${h.score}/${h.total} (${pct}%)</span>
            </div>
          `;
    }).join('')}
      </div>

      <button class="btn-reset" id="btn-reset">
        🗑️ Reset All Progress
      </button>
    </div>
  `;

    // Bind events
    document.getElementById('btn-back').addEventListener('click', onBack);

    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetAllData();
            onBack();
        }
    });
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
