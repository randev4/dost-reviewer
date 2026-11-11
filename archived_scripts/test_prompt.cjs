require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY;
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

const q = {
    id: "mat-2020-035",
    subject: "mathematics",
    question: "What is the domain of the function defined by\n?",
    choices: [
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "( )\n2\n1\nf x\nx\n=\n−\n(\n\n\n)\n, 1\n1,\n−−\n\n+\n\n\n1,1\n−\n(\n)\n1,1\n−\n(\n)\n(\n)\n, 1\n1,\n−−\n\n+" }
    ],
    answer: "A",
    explanation: ""
};

async function test() {
    const choicesText = q.choices.map(c => `${c.key}) ${c.textLatex || c.text}`).join('\n');
    let prompt = `SUBJECT: ${q.subject}\nQUESTION: ${q.questionLatex || q.question}\nCHOICES:\n${choicesText}\nANSWER KEY: ${q.answer}\nEXPLANATION: ${q.explanationLatex || q.explanation || 'None'}`;

    const body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
    };

    console.log("Testing Prompt:\n" + prompt);
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    console.log("\nResponse:");
    if (data.error) console.log(data.error);
    else console.log(data.candidates[0].content.parts[0].text);
}
test();
