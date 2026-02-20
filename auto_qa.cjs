const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is not set in the .env file.");
    process.exit(1);
}

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are a meticulous QA reviewer for a test prep application.
Evaluate the given question (text, choices, answer, explanation) and optionally an image for the following issues:
- 'incorrect-image': Built-in diagram/image does not match the question text or choices at all.
- 'cropped-image': The provided image is visibly cut off, missing axes, or incomplete.
- 'missing-image': The question literally says "in the figure below", "this graph", etc., but no image is provided.
- 'no-latex': Question or choices contain mathematical expressions/equations/scientific formulas but lack strict LaTeX '$...$' notation.
- 'broken-latex': Math is present but garbled (e.g., unclosed braces, OCR artifacts like Ã—).
- 'typo-question': Visible typo, bad grammar, or OCR garbage in the question text.
- 'typo-choices': Visible typo or OCR garbage in the choices.
- 'wrong-answer': The designated answer key is mathematically or factually incorrect.
- 'bad-explanation': The explanation is completely missing, or it's logically wrong.

Return ONLY a valid JSON object matching this schema:
{
  "issues": ["array", "of", "matched", "issue", "ids"],
  "notes": "A very short, 1-sentence explanation of what you found. Empty if no issues."
}
If no issues are found, return { "issues": [], "notes": "" }.`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function evaluateQuestion(q) {
    const choiceItems = Array.isArray(q.choices) ? q.choices : (q.choices?.items || []);
    const choicesText = choiceItems.map(c => `${c.key}) ${c.textLatex || c.text}`).join('\n');

    let prompt = `SUBJECT: ${q.subject}
QUESTION: ${q.questionLatex || q.question}
CHOICES:
${choicesText}
ANSWER KEY: ${q.answer}
EXPLANATION: ${q.explanationLatex || q.explanation || 'None'}`;

    const parts = [{ text: prompt }];

    if (q.image) {
        const imgPath = path.join(__dirname, 'public', 'images', 'questions', q.image);
        if (fs.existsSync(imgPath)) {
            const b64 = fs.readFileSync(imgPath).toString('base64');
            const mime = q.image.toLowerCase().endsWith('png') ? 'image/png' : 'image/jpeg';
            parts.push({ text: "An image is attached for this question." });
            parts.push({ inlineData: { mimeType: mime, data: b64 } });
        } else {
            parts.push({ text: `[SYSTEM] The image file '${q.image}' could not be loaded.` });
            return { issues: ['missing-image'], notes: 'Image file specified but not found on disk.' };
        }
    }

    const body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts }],
        generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
        }
    };

    let retries = 3;
    while (retries > 0) {
        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.error) {
                if (data.error.code === 429) {
                    await sleep(5000);
                    retries--;
                    continue;
                }
                console.error(`API Error on ${q.id}:`, data.error.message);
                return { issues: ['other'], notes: `API Error: ${data.error.message}` };
            }

            if (data.candidates && data.candidates.length > 0) {
                let text = data.candidates[0].content.parts[0].text;
                return JSON.parse(text);
            }
        } catch (err) {
            console.error(`Fetch/Parse Error on ${q.id}:`, err.message);
            await sleep(2000);
            retries--;
        }
    }
    return { issues: ['other'], notes: "Failed after retries" };
}

async function main() {
    const subjects = ['english', 'mathematics', 'mechanical-technical', 'nonverbal-reasoning', 'science', 'verbal-reasoning'];
    const allQ = [];

    for (const s of subjects) {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', `${s}.json`), 'utf8'));
        allQ.push(...data.map(q => ({ ...q, subject: s })));
    }

    const reportPath = path.join(__dirname, 'public', 'auto-qa-report.json');
    let marks = {};
    if (fs.existsSync(reportPath)) {
        marks = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }

    const remaining = allQ.filter(q => {
        if (!marks[q.id]) return true;
        const notes = marks[q.id].notes || '';
        return notes.includes('Failed after retries') || notes.includes('API Error');
    });
    console.log(`Evaluating ${remaining.length} of ${allQ.length} total questions...`);
    console.log(`To respect the free-tier API limit (15 requests/minute), the script will process 1 question every 4 seconds.`);
    console.log(`Estimated time to complete: ${Math.ceil(remaining.length * 4 / 60)} minutes.\n`);

    for (let i = 0; i < remaining.length; i++) {
        const q = remaining[i];
        process.stdout.write(`Reviewing question ${i + 1}/${remaining.length} (${q.id})... `);

        const res = await evaluateQuestion(q);
        const isApiError = res.notes && res.notes.includes('API Error');
        if (isApiError) {
            console.log(`[!] Skipped due to API Error. Will retry later.`);
        } else {
            marks[q.id] = {
                issues: Array.isArray(res.issues) ? res.issues : [],
                notes: res.notes || ''
            };
            console.log(`Matched ${res.issues.length} issues.`);
        }

        // Save progress after every single question so nothing is lost if interrupted
        fs.writeFileSync(reportPath, JSON.stringify(marks, null, 2));

        // Wait 4100ms to guarantee we stay exactly under 15 RPM (60000ms / 15 = 4000ms)
        if (i < remaining.length - 1) {
            await sleep(4100);
        }
    }

    console.log("\\nAuto QA complete! Results saved to public/auto-qa-report.json");
    console.log("You can now open the admin.html page and the results will automatically load.");
}

main().catch(console.error);
