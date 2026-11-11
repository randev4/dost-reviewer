require('dotenv').config();

async function check() {
    const K = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${K}`);
    const data = await res.json();
    data.models.filter(m => m.name.includes("flash")).forEach(m => console.log(m.name));
}

check();
