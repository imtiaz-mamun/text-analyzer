const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = express();

const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
const filePath = path.join(__dirname, 'sample.txt');


// API endpoints
app.use('/favicon.ico', (req, res, next) => res.status(204).end());
app.get('/api/words', (req, res) => {
    const text = fs.readFileSync('sample.txt', 'utf8');
    const wordCount = text.split(/\s+/).length;
    res.json({ count: wordCount });
});
app.get('/api/characters', (req, res) => {
    const text = fs.readFileSync('sample.txt', 'utf8');
    const characterCount = text.replace(/\s/g, '').length;
    res.json({ count: characterCount });
});
app.get('/api/sentences', (req, res) => {
    const text = fs.readFileSync('sample.txt', 'utf8');
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    res.json({ count: sentenceCount });
});
app.get('/api/paragraphs', (req, res) => {
    const text = fs.readFileSync('sample.txt', 'utf8');
    const paragraphCount = text.split(/\n\s*\n/).length;
    res.json({ count: paragraphCount });
});
app.get('/api/longestwords', (req, res) => {
    const text = fs.readFileSync('sample.txt', 'utf8');
    const paragraphs = text.split(/\n\s*\n/);
    const longestWords = paragraphs.map(paragraph => {
        const words = paragraph.split(/\s+/);
        const longestWordLength = words.reduce((longestLength, current) => {
            return current.length > longestLength ? current.length : longestLength;
        }, 0);

        const longestWordsInParagraph = words.filter(word => word.length === longestWordLength);
        return longestWordsInParagraph;
    });
    res.json({ longestWords });
});


function getParameters() {
    const text = fs.readFileSync(filePath, 'utf8');
    const wordCount = text.split(/\s+/).length;
    const characterCount = text.replace(/\s/g, '').length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const paragraphCount = text.split(/\n\s*\n/).length;
    const paragraphs = text.split(/\n\s*\n/);
    const longestWords = paragraphs.map(paragraph => {
        const words = paragraph.split(/\s+/);
        const longestWordLength = words.reduce((longestLength, current) => {
            return current.length > longestLength ? current.length : longestLength;
        }, 0);

        const longestWordsInParagraph = words.filter(word => word.length === longestWordLength);
        return longestWordsInParagraph;
    });

    return {
        wordCount: wordCount,
        characterCount: characterCount,
        sentenceCount: sentenceCount,
        paragraphCount: paragraphCount,
        longestWords: longestWords
    };
}
app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    function sendParameters() {
        const parameters = getParameters();
        res.write(`data: ${JSON.stringify(parameters)}\n\n`);
    }
    fs.watch(filePath, (eventType, filename) => {
        if (eventType === 'change') {
            sendParameters();
        }
    });
    sendParameters();
    req.on('close', () => {
        console.log('Client disconnected');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
