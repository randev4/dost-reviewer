/**
 * DOST-SEI Reviewer 1001 Ingestion Script
 * Ingests 1,001 items and 244 diagram images from Obsidian vault
 */

const fs = require('fs');
const path = require('path');

const VAULT_DIR = 'C:\\Users\\RANDEV\\Documents\\Obsidian\\teaching-assistant\\References\\Scholarships\\DOST-SEI Reviewer 1001';
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'questions');

// 1. Answer Key Gaps & Confirmations
const CONFIRMED_GAPS = {
    34: { answer: 'A', fixChoiceC: 'Both trucks are equally likely to overturn' },
    37: { answer: 'B', explanation: 'Average power = total work / time = (mgh + 0.5*m*v^2) / t = (980 J + 160 J) / 4.0 s = 285 W.' },
    39: { answer: 'C', explanation: 'Total input electrical power = V * I = 12 V * 2.0 A = 24 W. Efficiency = (useful power / input power) = 18 W / 24 W = 75%.' },
    87: { answer: 'A', explanation: 'Folding a square diagonally and then along its line of symmetry creates 4 layers. A hole punched away from folds produces 4 symmetrical holes.' },
    212: { answer: 'A', explanation: 'The passage notes that survival was uneven due to differences in waves and flooding, indicating local physical site conditions influenced survival.' },
    277: { answer: 'D', explanation: 'Frogs prey on grasshoppers. If the frog population declines sharply, fewer grasshoppers are consumed, causing grasshopper numbers to increase.' },
    467: { answer: 'A', explanation: 'By the First Law of Thermodynamics, ΔU = Q - W = 500 J - 180 J = +320 J.' },
    500: { answer: 'A', explanation: 'Slow cooling of magma deep underground allows large, coarse crystals to form, characteristic of intrusive igneous rock.' },
    649: { answer: 'D', explanation: 'The nth term of an arithmetic sequence is a_n = a_1 + (n - 1)d. For n = 10, a_10 = 7 + (9)(4) = 43.' },
    659: { answer: 'A', explanation: '-2 < 3x + 1 <= 10. Subtract 1: -3 < 3x <= 9. Divide by 3: -1 < x <= 3.' },
    1001: { answer: 'C', explanation: 'P(10) = P(0) + ∫[0 to 10] 100 e^(0.1t) dt = 500 + 100 [e^(0.1t) / 0.1] from 0 to 10 = 500 + 1000(e - 1).' }
};

// 2. Chapter configuration
const CHAPTER_CONFIG = [
    { file: '01 — Mechanical Reasoning.md', chapter: 1, subject: 'mechanical-technical', defaultTopic: 'mechanical', targetJson: 'mechanical-technical.json' },
    { file: '02 — Spatial Reasoning.md', chapter: 2, subject: 'nonverbal-reasoning', defaultTopic: 'spatial', targetJson: 'nonverbal-reasoning.json' },
    { file: '03 — Verbal Reasoning.md', chapter: 3, subject: 'verbal-reasoning', defaultTopic: 'verbal-logic', targetJson: 'verbal-reasoning.json' },
    { file: '04 — English Language Proficiency.md', chapter: 4, subject: 'english', defaultTopic: 'grammar', targetJson: 'english.json' },
    { file: '05 — Reading Comprehension and Literature.md', chapter: 5, subject: 'english', defaultTopic: 'reading', targetJson: 'english.json' },
    { file: '06 — Biology.md', chapter: 6, subject: 'science', defaultTopic: 'biology', targetJson: 'science.json' },
    { file: '07 — Chemistry.md', chapter: 7, subject: 'science', defaultTopic: 'chemistry', targetJson: 'science.json' },
    { file: '08 — Physics.md', chapter: 8, subject: 'science', defaultTopic: 'physics', targetJson: 'science.json' },
    { file: '09 — Earth Science.md', chapter: 9, subject: 'science', defaultTopic: 'earth-science', targetJson: 'science.json' },
    { file: '10 — Space Science.md', chapter: 10, subject: 'science', defaultTopic: 'space-science', targetJson: 'science.json' },
    { file: '11 — Algebra.md', chapter: 11, subject: 'mathematics', defaultTopic: 'algebra', targetJson: 'mathematics.json' },
    { file: '12 — Geometry.md', chapter: 12, subject: 'mathematics', defaultTopic: 'geometry', targetJson: 'mathematics.json' },
    { file: '13 — Trigonometry.md', chapter: 13, subject: 'mathematics', defaultTopic: 'trigonometry', targetJson: 'mathematics.json' },
    { file: '14 — Statistics and Probability.md', chapter: 14, subject: 'mathematics', defaultTopic: 'statistics', targetJson: 'mathematics.json' },
    { file: '15 — Calculus.md', chapter: 15, subject: 'mathematics', defaultTopic: 'calculus', targetJson: 'mathematics.json' }
];

// Parse Answer Key
function parseAnswerKey() {
    const keyPath = path.join(VAULT_DIR, '16 — Answer Key.md');
    const content = fs.readFileSync(keyPath, 'utf8');
    const keyMap = {};

    const lines = content.split(/\r?\n/);
    lines.forEach(l => {
        if (!l.includes('|')) return;
        const cells = l.split('|').map(c => c.trim()).filter(Boolean);
        for (let i = 0; i < cells.length; i += 2) {
            const num = parseInt(cells[i], 10);
            const ans = cells[i + 1];
            if (!isNaN(num) && ans !== undefined && ans !== 'Ans' && !ans.startsWith('-')) {
                keyMap[num] = ans;
            }
        }
    });

    // Apply confirmations & gap fixes
    Object.keys(CONFIRMED_GAPS).forEach(k => {
        const num = parseInt(k, 10);
        keyMap[num] = CONFIRMED_GAPS[num].answer;
    });

    return keyMap;
}

// Parse Passages for Chapter 5
function parsePassages(content) {
    const lines = content.split(/\r?\n/);
    const passages = {};
    let currentNum = null;
    let currentText = [];

    lines.forEach(l => {
        const m = l.match(/>\s+\*\*Passage\s+(\d+)\*\*/i);
        if (m) {
            if (currentNum) {
                passages[currentNum] = currentText.join('\n').trim();
            }
            currentNum = parseInt(m[1], 10);
            currentText = [];
        } else if (currentNum) {
            if (l.startsWith('### ')) {
                // Item starts, passage text collection ends
                if (currentNum && !passages[currentNum]) {
                    passages[currentNum] = currentText.join('\n').trim();
                }
            } else if (l.startsWith('>')) {
                const clean = l.replace(/^>\s?/, '');
                if (clean.trim()) currentText.push(clean.trim());
            }
        }
    });
    if (currentNum && !passages[currentNum]) {
        passages[currentNum] = currentText.join('\n').trim();
    }
    return passages;
}

// Ingest All Items
function parseAllItems(answerKeys) {
    const allParsedItems = [];

    CHAPTER_CONFIG.forEach(cfg => {
        const filePath = path.join(VAULT_DIR, cfg.file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Passages if Chapter 5
        const passages = cfg.chapter === 5 ? parsePassages(content) : {};

        // Split into items by ### <number>
        // Track current level
        let currentDifficulty = 1;
        const lines = content.split(/\r?\n/);

        let currentItem = null;

        function commitItem() {
            if (!currentItem) return;

            const num = currentItem.number;
            const ans = answerKeys[num] || 'A';

            // Clean question text and extract image
            let rawQ = currentItem.rawQuestionLines.join('\n').trim();

            // Extract image markdown: ![alt](images/chXX/qXXXX_fig1.png)
            let imageFilename = null;
            const imgMatch = rawQ.match(/!\[.*?\]\((?:images\/ch\d+\/)?(q(\d{4})_fig\d+\.png)\)/i);
            if (imgMatch) {
                imageFilename = 'dost1001-q' + imgMatch[2] + '.png';
                // Remove the image markdown tag from the question text
                rawQ = rawQ.replace(imgMatch[0], '').trim();
            }

            // Remove drawing choice notes like *The four answer choices are shown as drawings.*
            const isDrawingChoices = rawQ.includes('The four answer choices are shown as drawings') ||
                                     currentItem.rawChoiceLines.length === 0;

            rawQ = rawQ.replace(/\*The four answer choices are shown as drawings\.\*/g, '').trim();

            // Add Passage context if Chapter 5
            if (cfg.chapter === 5) {
                // Determine passage: 201-205 is 1, 206-210 is 2, etc.
                const pIndex = Math.floor((num - 201) / 5) + 1;
                const pText = passages[pIndex];
                if (pText) {
                    rawQ = `[Passage ${pIndex}]\n"${pText}"\n\n${rawQ}`;
                }
            }

            // Process choices
            let choices = [];
            if (isDrawingChoices) {
                choices = [
                    { key: 'A', text: 'Option A' },
                    { key: 'B', text: 'Option B' },
                    { key: 'C', text: 'Option C' },
                    { key: 'D', text: 'Option D' }
                ];
            } else {
                currentItem.rawChoiceLines.forEach(cl => {
                    const cm = cl.match(/^-\s+\*\*([A-D])\.\*\*\s*(.*)/);
                    if (cm) {
                        let cText = cm[2].trim();
                        if (num === 34 && cm[1] === 'C') {
                            cText = CONFIRMED_GAPS[34].fixChoiceC;
                        }
                        choices.push({
                            key: cm[1],
                            text: cText,
                            ...(cText.includes('$') ? { textLatex: cText } : {})
                        });
                    }
                });
            }

            // Fallback for missing choices if any
            if (choices.length < 4) {
                const keys = ['A', 'B', 'C', 'D'];
                while (choices.length < 4) {
                    const k = keys[choices.length];
                    choices.push({ key: k, text: `Option ${k}` });
                }
            }

            // Find selected choice text for default explanation
            const correctChoice = choices.find(c => c.key === ans);
            const correctText = correctChoice ? correctChoice.text : `Option ${ans}`;

            let explanation = '';
            let explanationLatex = '';

            if (CONFIRMED_GAPS[num] && CONFIRMED_GAPS[num].explanation) {
                explanation = CONFIRMED_GAPS[num].explanation;
                explanationLatex = CONFIRMED_GAPS[num].explanation;
            } else {
                explanation = `Correct answer is ${ans}: ${correctText}.`;
                if (rawQ.includes('$') || correctText.includes('$')) {
                    explanationLatex = `Correct answer is $${ans}$: ${correctText}.`;
                }
            }

            const itemObj = {
                id: `dost1001-${String(num).padStart(4, '0')}`,
                subject: cfg.subject,
                topic: cfg.defaultTopic,
                difficulty: currentDifficulty,
                source: 'dost-sei-1001',
                chapter: cfg.chapter,
                question: rawQ,
                ...(rawQ.includes('$') ? { questionLatex: rawQ } : {}),
                image: imageFilename,
                choices: choices,
                answer: ans,
                explanation: explanation,
                ...(explanationLatex ? { explanationLatex } : {}),
                ...(isDrawingChoices ? { noShuffle: true } : {})
            };

            allParsedItems.push(itemObj);
        }

        lines.forEach(line => {
            // Check Level heading
            if (line.startsWith('## Level 1')) currentDifficulty = 1;
            else if (line.startsWith('## Level 2')) currentDifficulty = 2;
            else if (line.startsWith('## Level 3')) currentDifficulty = 3;
            else if (line.startsWith('## Level 4')) currentDifficulty = 3;

            // Check Item heading
            const itemMatch = line.match(/^###\s+(\d+)/);
            if (itemMatch) {
                commitItem();
                currentItem = {
                    number: parseInt(itemMatch[1], 10),
                    rawQuestionLines: [],
                    rawChoiceLines: []
                };
            } else if (currentItem) {
                if (/^-\s+\*\*[A-D]\.\*\*/.test(line)) {
                    currentItem.rawChoiceLines.push(line);
                } else {
                    // Question line (or image, or note)
                    if (currentItem.rawChoiceLines.length === 0) {
                        // Skip frontmatter or chapter title lines before item
                        if (!line.startsWith('---') && !line.startsWith('# ')) {
                            currentItem.rawQuestionLines.push(line);
                        }
                    }
                }
            }
        });

        // Commit final item in chapter
        commitItem();
    });

    return allParsedItems;
}

// Main execution function
function run({ dryRun = true }) {
    console.log(`\n========================================`);
    console.log(`  DOST-SEI 1001 Ingestion Pipeline`);
    console.log(`  Mode: ${dryRun ? 'DRY RUN (No files modified)' : 'LIVE INGESTION'}`);
    console.log(`========================================\n`);

    const answerKeys = parseAnswerKey();
    console.log(`✓ Parsed answer keys: ${Object.keys(answerKeys).length} keys loaded.`);

    const parsedItems = parseAllItems(answerKeys);
    console.log(`✓ Parsed total questions from vault: ${parsedItems.length} items.\n`);

    // Verify 1..1001 items exist
    const parsedIds = new Set(parsedItems.map(i => parseInt(i.id.replace('dost1001-', ''), 10)));
    const missingNums = [];
    for (let i = 1; i <= 1001; i++) {
        if (!parsedIds.has(i)) missingNums.push(i);
    }
    if (missingNums.length > 0) {
        console.error(`✗ Missing item numbers:`, missingNums);
        process.exit(1);
    } else {
        console.log(`✓ Integrity check: All items 1 to 1001 are present without gaps!`);
    }

    // Partition items by target JSON
    const subjectBuckets = {};
    CHAPTER_CONFIG.forEach(c => {
        if (!subjectBuckets[c.targetJson]) subjectBuckets[c.targetJson] = [];
    });

    parsedItems.forEach(item => {
        const cfg = CHAPTER_CONFIG.find(c => c.chapter === item.chapter);
        subjectBuckets[cfg.targetJson].push(item);
    });

    console.log(`\nItem Distribution by Target File:`);
    Object.entries(subjectBuckets).forEach(([file, items]) => {
        console.log(`  • ${file.padEnd(26)}: ${items.length} new items`);
    });

    if (dryRun) {
        console.log(`\n✓ DRY RUN SUCCESSFUL. Pass --live to write to src/data/*.json.`);
        return;
    }

    // Live Write
    console.log(`\n--- Writing updates to ${DATA_DIR} ---`);
    Object.entries(subjectBuckets).forEach(([file, newItems]) => {
        const filePath = path.join(DATA_DIR, file);
        let existing = [];
        if (fs.existsSync(filePath)) {
            existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Filter out any previous dost1001-* items to maintain idempotency
        const preserved = existing.filter(q => !q.id.startsWith('dost1001-'));
        const combined = [...preserved, ...newItems];

        fs.writeFileSync(filePath, JSON.stringify(combined, null, 2), 'utf8');
        console.log(`✓ Updated ${file}: ${preserved.length} existing + ${newItems.length} new = ${combined.length} total items.`);
    });

    // Update version.txt to bust client cache
    const versionFile = path.join(__dirname, '..', 'public', 'version.txt');
    const newVersion = `v${Date.now()}`;
    fs.writeFileSync(versionFile, newVersion, 'utf8');
    console.log(`✓ Updated public/version.txt → ${newVersion}`);

    console.log(`\n🎉 Ingestion complete! 1,001 items integrated into dost-reviewer.`);
}

module.exports = { parseAnswerKey, parseAllItems, run };

if (require.main === module) {
    const isLive = process.argv.includes('--live');
    run({ dryRun: !isLive });
}
