/**
 * DOST-SEI Reviewer — Main Entry Point
 * Simple client-side router connecting all screens
 */

import './style.css';
import { renderHome } from './screens/home.js';
import { renderQuiz } from './screens/quiz.js';
import { renderResults } from './screens/results.js';
import { renderDashboard } from './screens/dashboard.js';
import { selectQuestions, gradeQuiz } from './lib/quiz-engine.js';
import { saveAttempt, clearInProgress } from './lib/storage.js';
import { preloadKaTeX } from './lib/katex-render.js';

const app = document.getElementById('app');

// Pre-load KaTeX for faster rendering
preloadKaTeX();

// Question data cache
const questionCache = {};

async function loadQuestions(dataFile) {
    if (questionCache[dataFile]) return questionCache[dataFile];

    try {
        const module = await import(`./data/${dataFile}.json`);
        questionCache[dataFile] = module.default;
        return module.default;
    } catch (err) {
        console.error(`Failed to load questions for ${dataFile}:`, err);
        return [];
    }
}

// --- Navigation / Router ---

function showHome() {
    renderHome(app, {
        onSelectSubject: startQuiz,
        onOpenDashboard: showDashboard,
        onResumeQuiz: resumeQuiz
    });
    window.scrollTo(0, 0);
}

async function startQuiz(subjectId) {
    // Show loading
    app.innerHTML = `
    <div class="screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
      <div class="spinner"></div>
      <p style="color: var(--text-muted); margin-top: var(--space-md); font-size: var(--font-sm);">Loading questions...</p>
    </div>
  `;

    // Find subject config
    const { SUBJECTS } = await import('./lib/subjects.js');
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) { showHome(); return; }

    // Load questions
    const allQuestions = await loadQuestions(subject.dataFile);
    if (allQuestions.length === 0) {
        app.innerHTML = `
      <div class="screen">
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No questions available for this subject yet.</p>
          <button class="nav-btn primary" style="margin-top: var(--space-lg); max-width: 200px;" onclick="location.reload()">Go Back</button>
        </div>
      </div>
    `;
        return;
    }

    // Select question set
    const questions = selectQuestions(allQuestions, subjectId, 10);

    renderQuiz(app, {
        subject: subjectId,
        questions,
        currentIndex: 0,
        answers: {},
        onBack: showHome,
        onFinish: (answers) => finishQuiz(subjectId, questions, answers)
    });
    window.scrollTo(0, 0);
}

function resumeQuiz(inProgress) {
    renderQuiz(app, {
        subject: inProgress.subject,
        questions: inProgress.questions,
        currentIndex: inProgress.currentIndex,
        answers: inProgress.answers,
        onBack: showHome,
        onFinish: (answers) => finishQuiz(inProgress.subject, inProgress.questions, answers)
    });
    window.scrollTo(0, 0);
}

function finishQuiz(subjectId, questions, answers) {
    const gradeResult = gradeQuiz(questions, answers);

    // Save to history
    const questionIds = questions.map(q => q.id);
    saveAttempt(subjectId, gradeResult.correct, gradeResult.total, questionIds, answers);
    clearInProgress();

    renderResults(app, {
        subject: subjectId,
        gradeResult,
        onRetry: () => startQuiz(subjectId),
        onHome: showHome
    });
    window.scrollTo(0, 0);
}

function showDashboard() {
    renderDashboard(app, { onBack: showHome });
    window.scrollTo(0, 0);
}

// --- Init ---
showHome();
