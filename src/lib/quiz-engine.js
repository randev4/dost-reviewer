/**
 * Quiz Engine — Handles question selection, shuffling, and adaptive difficulty
 */

import { getSeenQuestions, getRecentAverage } from './storage.js';

/**
 * Select a set of questions for a quiz session.
 * - Prefers unseen questions
 * - Adapts difficulty based on past performance
 * - Shuffles choices within each question
 */
export function selectQuestions(allQuestions, subject, count = 10) {
    const seen = new Set(getSeenQuestions(subject));
    const avg = getRecentAverage(subject, 5);

    // Determine difficulty bias
    let difficultyBias = null;
    if (avg !== null) {
        if (avg >= 0.8) difficultyBias = 'hard';    // mostly 2-3
        else if (avg <= 0.4) difficultyBias = 'easy'; // mostly 1-2
        // else: mixed (no bias)
    }

    // Separate into unseen and seen
    const unseen = allQuestions.filter(q => !seen.has(q.id));
    const seenList = allQuestions.filter(q => seen.has(q.id));

    // Apply difficulty weighting
    const weighted = applyDifficultyWeight(unseen, difficultyBias);
    const weightedSeen = applyDifficultyWeight(seenList, difficultyBias);

    // Select from unseen first, then fill from seen
    let selected = [];
    const shuffledUnseen = shuffleArray([...weighted]);
    const shuffledSeen = shuffleArray([...weightedSeen]);

    selected = shuffledUnseen.slice(0, count);
    if (selected.length < count) {
        selected = selected.concat(shuffledSeen.slice(0, count - selected.length));
    }

    // If still not enough (tiny question bank), allow repeats
    if (selected.length < count) {
        const remaining = shuffleArray([...allQuestions]);
        for (const q of remaining) {
            if (selected.length >= count) break;
            if (!selected.find(s => s.id === q.id)) {
                selected.push(q);
            }
        }
    }

    // Ensure we have at most 'count' questions
    selected = selected.slice(0, count);

    // Shuffle the order of questions
    selected = shuffleArray(selected);

    // Shuffle choices within each question (but preserve key labels)
    selected = selected.map(q => ({
        ...q,
        choices: shuffleChoices(q.choices, q.answer)
    }));

    return selected;
}

/**
 * Apply difficulty weighting — duplicates questions of preferred difficulty
 * to increase their selection probability.
 */
function applyDifficultyWeight(questions, bias) {
    if (!bias) return questions;

    return questions.flatMap(q => {
        if (bias === 'hard' && q.difficulty >= 2) return [q, q]; // double chance
        if (bias === 'easy' && q.difficulty <= 2) return [q, q];
        return [q];
    });
}

/**
 * Shuffle choices while tracking which key maps to the correct answer.
 * Returns { shuffledChoices, correctKey }
 */
function shuffleChoices(choices, correctKey) {
    // Shuffle
    const shuffled = shuffleArray([...choices]);

    // Re-assign keys A, B, C, D... while preserving all other fields (textLatex, image, etc.)
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const remapped = shuffled.map((c, i) => ({
        ...c,
        key: keys[i],
        originalKey: c.key
    }));

    // Find new correct key using originalKey (more reliable than matching by text)
    const newCorrect = remapped.find(c => c.originalKey === correctKey);

    return {
        items: remapped,
        correctKey: newCorrect.key
    };
}

/** Fisher-Yates shuffle */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Grade a quiz and return results.
 */
export function gradeQuiz(questions, userAnswers) {
    let correct = 0;
    const results = questions.map((q, i) => {
        const userAnswer = userAnswers[i] || null;
        const isCorrect = userAnswer === q.choices.correctKey;
        if (isCorrect) correct++;

        // Get wrong explanation if applicable
        let wrongReason = null;
        if (userAnswer && !isCorrect) {
            // Find the original key for the user's selected choice
            const selectedChoice = q.choices.items.find(c => c.key === userAnswer);
            if (selectedChoice && q.wrongExplanations) {
                wrongReason = q.wrongExplanations[selectedChoice.originalKey];
            }
        }

        return {
            question: q,
            userAnswer,
            correctKey: q.choices.correctKey,
            isCorrect,
            explanation: q.explanationLatex || q.explanation,
            wrongReason
        };
    });

    return { correct, total: questions.length, results };
}
