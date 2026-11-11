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

const descriptions = fs.readFileSync('mechanical_image_descriptions.txt', 'utf8').split('\n').filter(Boolean);
const data = JSON.parse(fs.readFileSync('src/data/mechanical-technical.json', 'utf8'));
const q2020 = data.filter(q => q.id.includes('2020'));

const keywords = ['graph', 'image', 'illustration', 'diagram', 'figure', 'setup', 'table', 'structure', 'following shows', 'picture', 'Option A', 'tool', 'lever', 'wrench', 'screw', 'pulley', 'gear'];

async function getBestMatch(question, choices) {
    const descText = descriptions.map((d, i) => `[${i}] ${d}`).join('\n');

    const prompt = `Here is a list of image descriptions available:\n${descText}\n\nHere is a mechanical/technical test question:\n${question}\n\nChoices:\n${choices}\n\nDoes this question need an image? If so, which of the provided descriptions is the perfect match? Answer with JUST the exact filename (e.g. 'mechanical-p51-1.jpeg') on the first line. If no image is needed or none match, output 'NONE'.`;

    const body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const d = await response.json();
        return d.candidates && d.candidates.length > 0 ? d.candidates[0].content.parts[0].text.trim().split('\n')[0].trim() : "NONE";
    } catch (e) {
        return "NONE";
    }
}

async function main() {
    let mapping = {};
    for (const q of q2020) {
        const txt = (q.question + q.choices.map(c => c.text).join(' ')).toLowerCase();
        if (keywords.some(kw => txt.includes(kw)) || q.image) {
            console.log(`Matching ${q.id}...`);
            const choicesStr = q.choices ? q.choices.map(c => c.text).join(' | ') : '';
            const bestImage = await getBestMatch(q.question, choicesStr);
            if (bestImage !== 'NONE' && bestImage.includes('mechanical')) {
                mapping[q.id] = bestImage;
                console.log(`-> ${bestImage}`);
            } else {
                console.log(`-> No match found`);
            }
            await new Promise(r => setTimeout(r, 600));
        }
    }
    fs.writeFileSync('mechanical_mapping.json', JSON.stringify(mapping, null, 2));
    console.log('Saved to mechanical_mapping.json');
}

main();
