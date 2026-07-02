function copyContractAddress() {
    alert('Contract address will be available 5 minutes after launch on NOXA.');
}

const LAUNCH_URL = 'https://fun.noxa.fi/robinhood';

function updateLaunchStatus() {
    const statusEl = document.getElementById('launch-status');
    const contractEl = document.getElementById('contractAddress');

    if (!statusEl || !contractEl) return;

    statusEl.textContent = 'Pre-launch — contract reveals 5 min after go-live';
    contractEl.textContent = 'Available 5 min after launch';
}

function updateFartCountDisplay(count) {
    const el = document.getElementById('fart-count');
    if (!el || !Number.isFinite(count)) return;

    el.textContent = count.toLocaleString('en-US');
    el.classList.add('fart-counter-bump');
    setTimeout(() => el.classList.remove('fart-counter-bump'), 300);
}

async function fetchFartCount() {
    try {
        const response = await fetch('/api/farts');
        if (!response.ok) throw new Error('Failed to fetch fart count');
        const data = await response.json();
        updateFartCountDisplay(data.count);
    } catch (error) {
        console.error('Error fetching fart count:', error);
    }
}

async function incrementFartCount() {
    try {
        const response = await fetch('/api/farts', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to increment fart count');
        const data = await response.json();
        updateFartCountDisplay(data.count);
    } catch (error) {
        console.error('Error incrementing fart count:', error);
    }
}

window.onload = () => {
    updateLaunchStatus();
    fetchFartCount();
};

const fartSounds = [
    document.getElementById('fart1'),
    document.getElementById('fart2'),
    document.getElementById('fart3'),
    document.getElementById('fart4'),
    document.getElementById('fart5'),
    document.getElementById('fart6')
].filter(Boolean);

const overlay = document.getElementById('fart-overlay');

const fartPhrases = [
    "💨 Silent but deadly 💨",
    "💨 Toxic cloud deployed 💨",
    "💨 Gas leak detected 💨",
    "💨 Tactical release 💨",
    "💨 Hood strike executed 💨",
    "💨 FARHOOD DEPLOYED 💨"
];

function triggerFart() {
    if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
    }

    if (fartSounds.length) {
        const randomSound = fartSounds[Math.floor(Math.random() * fartSounds.length)];
        randomSound.currentTime = 0;
        randomSound.play();
    }

    const phrase = fartPhrases[Math.floor(Math.random() * fartPhrases.length)];
    overlay.textContent = phrase;
    overlay.style.opacity = '1';
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 1500);

    document.documentElement.classList.add('shake-screen');
    setTimeout(() => {
        document.documentElement.classList.remove('shake-screen');
    }, 200);

    const container = document.getElementById('fart-gas-container');
    const cloudCount = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'gas-cloud';
        cloud.style.top = Math.random() * 90 + '%';
        cloud.style.left = Math.random() * 90 + '%';

        const size = Math.random() * 150 + 100;
        cloud.style.width = size + 'px';
        cloud.style.height = size + 'px';

        const green = Math.floor(150 + Math.random() * 105);
        const red = Math.floor(100 + Math.random() * 155);
        cloud.style.background = `radial-gradient(circle, rgba(${red},${green},50,0.5) 0%, transparent 80%)`;

        const r = () => (30 + Math.random() * 40) + '%';
        cloud.style.borderRadius = `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;

        container.appendChild(cloud);
    }

    incrementFartCount();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF') {
        triggerFart();
    }
});

const fartButton = document.getElementById('fart-button');
if (fartButton) {
    fartButton.addEventListener('click', triggerFart);
}
