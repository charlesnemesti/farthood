const NS = 'farthood';
const KEY = 'global-farts';
const COUNT_API = `https://api.countapi.xyz`;

let memoryCount = 0;

async function fetchRemoteCount(hit = false) {
    const action = hit ? 'hit' : 'get';
    const response = await fetch(`${COUNT_API}/${action}/${NS}/${KEY}`);

    if (!response.ok) {
        throw new Error(`Count API failed with status ${response.status}`);
    }

    const data = await response.json();
    return Number.isFinite(data.value) ? data.value : 0;
}

async function getCount() {
    try {
        return await fetchRemoteCount(false);
    } catch (error) {
        console.error('Fart count read failed, using memory fallback:', error);
        return memoryCount;
    }
}

async function incrementCount() {
    try {
        return await fetchRemoteCount(true);
    } catch (error) {
        console.error('Fart count increment failed, using memory fallback:', error);
        memoryCount += 1;
        return memoryCount;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'GET') {
        const count = await getCount();
        return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
        const count = await incrementCount();
        return res.status(200).json({ count });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
};
