/**
 * localStorage abstraction for DOST Reviewer
 * Manages quiz history, seen questions, and user settings.
 */

const STORAGE_KEY = 'dost-reviewer';
const CURRENT_VERSION = 1;

function getStore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createDefaultStore();
        const store = JSON.parse(raw);
        if (store.version !== CURRENT_VERSION) return createDefaultStore();
        return store;
    } catch {
        return createDefaultStore();
    }
}

function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function createDefaultStore() {
    const store = {
        version: CURRENT_VERSION,
        history: [],
        seenQuestions: {},
        inProgress: null,
        settings: { darkMode: true }
    };
    saveStore(store);
    return store;
}

/** Save a completed quiz attempt */
export function saveAttempt(subject, score, total, questionIds, answers) {
    const store = getStore();
    store.history.push({
        date: new Date().toISOString(),
        subject,
        score,
        total,
        questionIds,
        answers
    });

    // Track seen questions
    if (!store.seenQuestions[subject]) store.seenQuestions[subject] = [];
    questionIds.forEach(id => {
        if (!store.seenQuestions[subject].includes(id)) {
            store.seenQuestions[subject].push(id);
        }
    });

    // Clear in-progress quiz
    store.inProgress = null;

    saveStore(store);
}

/** Get all attempts for a subject, or all if no subject given */
export function getHistory(subject = null) {
    const store = getStore();
    if (subject) return store.history.filter(h => h.subject === subject);
    return store.history;
}

/** Get seen question IDs for a subject */
export function getSeenQuestions(subject) {
    const store = getStore();
    return store.seenQuestions[subject] || [];
}

/** Get average score for last N attempts of a subject */
export function getRecentAverage(subject, n = 5) {
    const attempts = getHistory(subject);
    if (attempts.length === 0) return null;
    const recent = attempts.slice(-n);
    const totalScore = recent.reduce((sum, a) => sum + (a.score / a.total), 0);
    return totalScore / recent.length;
}

/** Get overall stats across all subjects */
export function getOverallStats() {
    const store = getStore();
    const totalAttempts = store.history.length;
    const totalQuestions = store.history.reduce((sum, a) => sum + a.total, 0);
    const totalCorrect = store.history.reduce((sum, a) => sum + a.score, 0);
    const avgScore = totalQuestions > 0 ? (totalCorrect / totalQuestions * 100) : 0;
    return { totalAttempts, totalQuestions, totalCorrect, avgScore };
}

/** Get stats per subject */
export function getSubjectStats(subject) {
    const attempts = getHistory(subject);
    if (attempts.length === 0) {
        return { attempts: 0, avgScore: 0, bestScore: 0, totalQuestionsSeen: 0 };
    }
    const scores = attempts.map(a => (a.score / a.total) * 100);
    return {
        attempts: attempts.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        bestScore: Math.round(Math.max(...scores)),
        totalQuestionsSeen: getSeenQuestions(subject).length
    };
}

/** Save in-progress quiz state */
export function saveProgress(quizState) {
    const store = getStore();
    store.inProgress = quizState;
    saveStore(store);
}

/** Get in-progress quiz */
export function getInProgress() {
    const store = getStore();
    return store.inProgress;
}

/** Clear in-progress quiz */
export function clearInProgress() {
    const store = getStore();
    store.inProgress = null;
    saveStore(store);
}

/** Reset all data */
export function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    createDefaultStore();
}
