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

// Init Theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Question data cache
const questionCache = {};

// --- Version Polling ---
let AppVersion = null;
let versionCheckTimer = null;

async function checkAppVersion() {
    try {
        const res = await fetch('/version.txt?t=' + Date.now());
        if (!res.ok) return;
        const remoteVersion = (await res.text()).trim();

        if (!remoteVersion) return;

        if (AppVersion === null) {
            // Initial load
            AppVersion = remoteVersion;
        } else if (AppVersion !== remoteVersion) {
            // Version mismatch detected!
            AppVersion = remoteVersion; // Prevent multiple popups
            showUpdateBanner();
        }
    } catch (err) {
        // Ignore network errors silently
    }
}

function showUpdateBanner() {
    if (document.getElementById('update-banner')) return;

    clearInterval(versionCheckTimer); // Stop polling

    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner';
    banner.innerHTML = `
      <p>A new version of the Reviewer is available!</p>
      <button onclick="location.reload(true)">Reload Now</button>
    `;
    document.body.appendChild(banner);
}

// Start version polling
checkAppVersion();
versionCheckTimer = setInterval(checkAppVersion, 60000); // Check every 60s

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
        onSelectSubject: (subjectId, subtopicId = 'all') => startQuiz(subjectId, subtopicId),
        onOpenDashboard: showDashboard,
        onResumeQuiz: resumeQuiz
    });
    window.scrollTo(0, 0);
}

async function startQuiz(subjectId, subtopicId = 'all') {
    // Show loading
    app.innerHTML = `
    <div class="screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
      <div class="spinner"></div>
      <p style="color: var(--text-muted); margin-top: var(--space-md); font-size: var(--font-sm);">Loading questions...</p>
    </div>
  `;

    // Find subject config
    const { SUBJECTS, filterQuestionsBySubtopic, getSubtopicName } = await import('./lib/subjects.js');
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

    // Filter by selected subtopic
    const filteredQuestions = filterQuestionsBySubtopic(allQuestions, subjectId, subtopicId);
    const subtopicName = getSubtopicName(subjectId, subtopicId);

    if (filteredQuestions.length === 0) {
        app.innerHTML = `
      <div class="screen">
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No questions available for ${subtopicName} yet.</p>
          <button class="nav-btn primary" style="margin-top: var(--space-lg); max-width: 200px;" onclick="location.reload()">Go Back</button>
        </div>
      </div>
    `;
        return;
    }

    // Select question set (up to 10)
    const questions = selectQuestions(filteredQuestions, subjectId, Math.min(10, filteredQuestions.length));

    renderQuiz(app, {
        subject: subjectId,
        subtopicId,
        subtopicName,
        questions,
        currentIndex: 0,
        answers: {},
        onBack: showHome,
        onFinish: (answers) => finishQuiz(subjectId, subtopicId, subtopicName, questions, answers)
    });
    window.scrollTo(0, 0);
}

async function resumeQuiz(inProgress) {
    const subtopicId = inProgress.subtopicId || 'all';
    const { getSubtopicName } = await import('./lib/subjects.js');
    const subtopicName = getSubtopicName(inProgress.subject, subtopicId);

    renderQuiz(app, {
        subject: inProgress.subject,
        subtopicId,
        subtopicName,
        questions: inProgress.questions,
        currentIndex: inProgress.currentIndex,
        answers: inProgress.answers,
        onBack: showHome,
        onFinish: (answers) => finishQuiz(inProgress.subject, subtopicId, subtopicName, inProgress.questions, answers)
    });
    window.scrollTo(0, 0);
}

function finishQuiz(subjectId, subtopicId, subtopicName, questions, answers) {
    const gradeResult = gradeQuiz(questions, answers);

    // Save to history
    const questionIds = questions.map(q => q.id);
    saveAttempt(subjectId, gradeResult.correct, gradeResult.total, questionIds, answers);
    clearInProgress();

    renderResults(app, {
        subject: subjectId,
        subtopicId,
        subtopicName,
        gradeResult,
        onRetry: () => startQuiz(subjectId, subtopicId),
        onHome: showHome
    });
    window.scrollTo(0, 0);

    // Check for updates when returning to the main menu/results seamlessly
    checkAppVersion();
}

function showDashboard() {
    renderDashboard(app, { onBack: showHome });
    window.scrollTo(0, 0);
}

// --- Init ---
showHome();
