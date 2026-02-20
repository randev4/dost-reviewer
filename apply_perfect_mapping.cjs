const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'science.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Strip old wrong mappings from sci-2020
data.forEach(q => {
    if (q.id.includes('sci-2020')) {
        delete q.image;
    }
});

const perfectMap = {
    'sci-2020-015': 'science-p30-1.png',
    'sci-2020-022': 'science-p31-1.png', // Or one of the 4 partial eclipse images
    'sci-2020-025': 'science-p32-3.jpeg',
    'sci-2020-041': 'science-p35-1.png',
    'sci-2020-042': 'science-p36-1.png',
    'sci-2020-044': 'science-p36-2.png',
    'sci-2020-047': 'science-p37-1.png',
    'sci-2020-051': 'science-p38-1.jpeg',
    'sci-2020-055': 'science-p39-1.jpeg',
    'sci-2020-056': 'science-p39-2.jpeg',
    'sci-2020-057': 'science-p40-3.png',
    'sci-2020-058': 'science-p40-2.jpeg',
    'sci-2020-059': 'science-p40-1.jpeg',
    'sci-2020-060': 'science-p41-1.jpeg'
};

let applied = 0;
data.forEach(q => {
    if (perfectMap[q.id]) {
        q.image = perfectMap[q.id];
        applied++;
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8');
console.log(`Successfully applied ${applied} perfect image mappings.`);
