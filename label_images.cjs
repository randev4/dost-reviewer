const fs = require('fs');
const path = require('path');

const API_KEY = "AIzaSyAiE4XR2r-zeddc_dmLW4lShkIHPJfMRQM";
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function describeImage(fileName) {
    const imagePath = path.join(__dirname, 'public', 'images', 'questions', fileName);
    if (!fs.existsSync(imagePath)) return 'Not found';

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    let mimeType = fileName.endsWith('jpeg') || fileName.endsWith('jpg') ? 'image/jpeg' : 'image/png';

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: "Describe this image in precisely one short sentence that identifies its main topic or diagram type (e.g. 'A displacement vs time graph', 'A cross section of the Earth', 'A soil profile diagram')." },
                    { inlineData: { mimeType, data: base64Image } }
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
        return data.candidates && data.candidates.length > 0 ? data.candidates[0].content.parts[0].text.trim() : "Error";
    } catch (e) {
        return "Fetch error: " + e.message;
    }
}

async function main() {
    const imgDir = path.join(__dirname, 'public', 'images', 'questions');
    const files = fs.readdirSync(imgDir).filter(f => f.startsWith('science-') && (f.endsWith('png') || f.endsWith('jpeg')));

    let report = [];
    for (const file of files) {
        console.log(`Describing ${file}...`);
        const desc = await describeImage(file);
        console.log(`-> ${desc}`);
        report.push(`${file} : ${desc}`);
        await new Promise(r => setTimeout(r, 500));
    }

    fs.writeFileSync('image_descriptions.txt', report.join('\n'));
    console.log('Saved descriptions to image_descriptions.txt');
}

main();
