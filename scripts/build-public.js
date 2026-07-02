const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const output = path.join(root, 'public');

function copyPath(source, destination) {
    const stats = fs.statSync(source);

    if (stats.isDirectory()) {
        fs.mkdirSync(destination, { recursive: true });
        for (const entry of fs.readdirSync(source)) {
            copyPath(path.join(source, entry), path.join(destination, entry));
        }
        return;
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

function removeDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.rmSync(dir, { recursive: true, force: true });
}

removeDir(output);
fs.mkdirSync(output, { recursive: true });

for (const item of ['index.html', 'favicon.ico', 'src', 'sounds', 'icons']) {
    const source = path.join(root, item);
    if (!fs.existsSync(source)) {
        throw new Error(`Missing build asset: ${item}`);
    }
    copyPath(source, path.join(output, item));
}

console.log('Static assets copied to public/');
