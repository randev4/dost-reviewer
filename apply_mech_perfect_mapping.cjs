const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'mechanical-technical.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// First, delete all image assignments for the 2020 questions to remove the scramble
data.forEach(q => {
    if (q.id.includes('mec-2020-')) {
        delete q.image;
        delete q.images;
    }
});

// We only map the 100% definitively matched single images. 
// Other questions with missing extractions or fragmented choice images 
// are left blank safely instead of being assigned a completely wrong image.
const perfectMap = {
    'mec-2020-005': 'mechanical-p51-1.jpeg',
    'mec-2020-006': 'mechanical-p52-5.png',
    'mec-2020-018': 'mechanical-p55-5.jpeg'
};

let applied = 0;
data.forEach(q => {
    if (perfectMap[q.id]) {
        q.image = perfectMap[q.id];
        applied++;
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8');
console.log(`Successfully cleared scrambled images and applied ${applied} perfect mappings.`);
