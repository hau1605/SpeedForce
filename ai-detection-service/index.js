const http = require('http');
const url = require('url');
const PORT = 3000;

let isRequestActive = true; 

const callModel = async (modelName, delay, successRate) => {
    await new Promise(r => setTimeout(r, delay));
    if (Math.random() > successRate) throw new Error(`${modelName} failed`);
    return {
        model: modelName,
        confidence: 0.5 + Math.random() * 0.5,
        result: Math.random() > 0.5 ? 'Human' : 'AI'
    };
};

const modelA = () => callModel('ModelA', 1000, 0.9);
const modelB = () => callModel('ModelB', 2000, 0.7);
const modelC = () => callModel('ModelC', 3000, 0.95);

const questions = [
    "Tell me about yourself",
    "Why this company?",
    "Greatest weakness?",
    "Describe a challenge you solved",
    "Where do you see yourself in 5 years?"
];

const getDetectionResults = async (singleQuestion = null) => {
    const results = [];
    const questionsToAsk = singleQuestion ? [singleQuestion] : questions;

    for (const question of questionsToAsk) {
        const startTime = Date.now();
        let success = false;

        for (const model of [modelA, modelB, modelC]) {
            try {
                const result = await model();
                if (!isRequestActive) return results;
                results.push({
                    question,
                    ...result,
                    timeTaken: Date.now() - startTime
                });
                success = true;
                break;
            } catch (error) {
                if (isRequestActive) {
                    console.error(`Question "${question}" - ${error.message}`);
                }
            }
        }

        if (!success) {
            results.push({ question, error: 'All models failed' });
        }
    }

    return results;
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/results') {
        isRequestActive = true; 
        const question = parsedUrl.query.question;
        const results = await getDetectionResults(question);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
        isRequestActive = false;
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});