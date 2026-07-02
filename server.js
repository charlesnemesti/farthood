const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'fart-count.json');

function readCount() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return Number.isFinite(data.count) ? data.count : 0;
    } catch {
        return 0;
    }
}

function writeCount(count) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify({ count }, null, 2));
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/farts', (_req, res) => {
    res.json({ count: readCount() });
});

app.post('/api/farts', (_req, res) => {
    const count = readCount() + 1;
    writeCount(count);
    res.json({ count });
});

app.listen(PORT, () => {
    console.log(`Farthood running at http://localhost:${PORT}`);
});
