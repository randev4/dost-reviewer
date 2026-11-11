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

async function checkImageMatch(q) {
    const imagePath = path.join(__dirname, 'public', 'images', 'questions', q.image);
    if (!fs.existsSync(imagePath)) {
        return "Image not found on disk.";
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    let mimeType = 'image/png';
    if (q.image.endsWith('jpeg') || q.image.endsWith('jpg')) mimeType = 'image/jpeg';

    const choicesText = q.choices ? q.choices.map(c => `${c.key}. ${c.text}`).join('\n') : "N/A";
    const prompt = `Here is a science test question:\n${q.question}\n\nChoices:\n${choicesText}\n\nI have provided an image that is currently assigned to this question. Does this image logically belong to and match the context of the question? Check if the text in the question references elements in the image. Respond with exactly 'YES' or 'NO' on the first line, followed by a short explanation on why you think so.`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: mimeType, data: base64Image } }
                ]
            }
        ],
        generationConfig: { temperature: 0.1 }
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Unexpected response: " + JSON.stringify(data);
        }
    } catch (e) {
        return "Fetch error: " + e.message;
    }
}

async function verifyMissingImages(q) {
    const choicesText = q.choices ? q.choices.map(c => `${c.key}. ${c.text}`).join('\n') : "N/A";
    const prompt = `Here is a science test question:\n${q.question}\n\nChoices:\n${choicesText}\n\nDoes this question strongly imply or explicitly state that it requires an accompanying image, graph, diagram, table, or figure to be answered (e.g., "The following graph shows..." or "In the diagram below...")? Respond with exactly 'YES' or 'NO' on the first line, followed by a short explanation.`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt }
                ]
            }
        ],
        generationConfig: { temperature: 0.1 }
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Unexpected response: " + JSON.stringify(data);
        }
    } catch (e) {
        return "Fetch error: " + e.message;
    }
}

async function main() {
    const dataPath = path.join(__dirname, 'src', 'data', 'science.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Test 2020 questions
    const q2020 = data.filter(q => q.id.includes('sci-2020'));

    console.log(`Starting verification for ${q2020.length} questions...`);

    let issues = 0;

    for (const q of q2020) {
        if (q.image) {
            console.log(`\nVerifying Image Match for: ${q.id} (Image: ${q.image})`);
            const result = await checkImageMatch(q);
            const isNo = result.startsWith('NO') || result.startsWith('No') || result.startsWith('no');
            console.log(`Result: ${isNo ? '\\x1b[31mFAIL\\x1b[0m' : '\\x1b[32mPASS\\x1b[0m'}`);
            console.log(`Explanation: ${result.split('\n').join(' ')}`);
            if (isNo) issues++;
        } else {
            // Check if it might need an image
            const result = await verifyMissingImages(q);
            const isYes = result.startsWith('YES') || result.startsWith('Yes') || result.startsWith('yes');
            if (isYes) {
                console.log(`\n\\x1b[33mWarning: Question might be missing an image: ${q.id}\\x1b[0m`);
                console.log(`Question: ${q.question.substring(0, 80)}...`);
                console.log(`Explanation: ${result.split('\n').join(' ')}`);
                issues++;
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    console.log(`\nVerification complete. Found ${issues} potential issues.`);
}

main().catch(console.error);
