const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/science.json'));

data.forEach(q => {
    if (q.id.includes('sci-2020')) {
        delete q.image;
        delete q.images;
    }
});

const imageMap = {
    'sci-2020-015': 'science-p30-1.png',
    'sci-2020-022': 'science-p31-1.png',
    'sci-2020-025': 'science-p32-1.png',
    'sci-2020-041': 'science-p35-1.png',
    'sci-2020-042': 'science-p36-1.png',
    'sci-2020-044': 'science-p36-2.png',
    'sci-2020-045': 'science-p37-1.png',
    'sci-2020-049': 'science-p38-1.jpeg',
    'sci-2020-050': 'science-p38-1.jpeg',
    'sci-2020-051': 'science-p38-1.jpeg',
    'sci-2020-052': 'science-p38-1.jpeg',
    'sci-2020-053': 'science-p38-1.jpeg',
    'sci-2020-054': 'science-p39-1.jpeg',
    'sci-2020-055': 'science-p39-2.jpeg',
    'sci-2020-056': 'science-p39-2.jpeg',
    'sci-2020-057': 'science-p40-1.jpeg',
    'sci-2020-058': 'science-p40-2.jpeg',
    'sci-2020-059': 'science-p40-3.png',
    'sci-2020-060': 'science-p41-1.jpeg'
};

data.forEach(q => {
    if (imageMap[q.id]) {
        q.image = imageMap[q.id];
    }
});

fs.writeFileSync('src/data/science.json', JSON.stringify(data, null, 4));
console.log('Successfully updated science.json with corrected image mapping.');
