const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const { keycloak, memoryStore } = require("./keycloak-config");
const app = express();

const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.use(
  session({
    secret: "sso-client-secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());
app.use(express.static(path.join(__dirname, "public")));
const filePath = path.join(__dirname, "sample.txt");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api/", apiLimiter);

function appendReportToFile(userId, report) {
  const reportLine = `${userId}:${JSON.stringify(report)}\n`;
  fs.appendFileSync("report.txt", reportLine);
}

function getUserReports(userId) {
  const reports = [];
  const lines = fs.readFileSync("report.txt", "utf8").split("\n");
  lines.forEach((line) => {
    const [id, report] = line.split(":");
    if (id === userId) {
      reports.push(JSON.parse(report));
    }
  });
  return reports;
}

// API endpoints with authentication and caching
app.use("/favicon.ico", (req, res, next) => res.status(204).end());
app.get("/api/words", keycloak.protect(), (req, res) => {
  const cachedCount = cache.get("wordCount");
  if (cachedCount) {
    return res.json({ count: cachedCount });
  }

  const text = fs.readFileSync("sample.txt", "utf8");
  const wordCount = text.split(/\s+/).length;
  cache.set("wordCount", wordCount);

  const userId = req.kauth.grant.access_token.content.sub;
  const report = { count: wordCount };
  appendReportToFile(userId, report);

  res.json({ count: wordCount });
});
app.get("/api/characters", keycloak.protect(), (req, res) => {
  const cachedCount = cache.get("characterCount");
  if (cachedCount) {
    return res.json({ count: cachedCount });
  }

  const text = fs.readFileSync("sample.txt", "utf8");
  const characterCount = text.replace(/\s/g, "").length;
  cache.set("characterCount", characterCount);

  const userId = req.kauth.grant.access_token.content.sub;
  const report = { count: characterCount };
  appendReportToFile(userId, report);

  res.json({ count: characterCount });
});
app.get("/api/sentences", keycloak.protect(), (req, res) => {
  const cachedCount = cache.get("sentenceCount");
  if (cachedCount) {
    return res.json({ count: cachedCount });
  }

  const text = fs.readFileSync("sample.txt", "utf8");
  const sentenceCount = text.split(/[.!?]+/).length - 1;
  cache.set("sentenceCount", sentenceCount);

  const userId = req.kauth.grant.access_token.content.sub;
  const report = { count: sentenceCount };
  appendReportToFile(userId, report);

  res.json({ count: sentenceCount });
});
app.get("/api/paragraphs", keycloak.protect(), (req, res) => {
  const cachedCount = cache.get("paragraphCount");
  if (cachedCount) {
    return res.json({ count: cachedCount });
  }

  const text = fs.readFileSync("sample.txt", "utf8");
  const paragraphCount = text.split(/\n\s*\n/).length;
  cache.set("paragraphCount", paragraphCount);

  const userId = req.kauth.grant.access_token.content.sub;
  const report = { count: paragraphCount };
  appendReportToFile(userId, report);

  res.json({ count: paragraphCount });
});
app.get("/api/longestwords", keycloak.protect(), (req, res) => {
  const cachedCount = cache.get("longestWords");
  if (cachedCount) {
    return res.json({ longestWords: cachedCount });
  }

  const text = fs.readFileSync("sample.txt", "utf8");
  const paragraphs = text.split(/\n\s*\n/);
  const longestWords = paragraphs.map((paragraph) => {
    const words = paragraph.split(/\s+/);
    const cleanedWords = words.map((word) =>
      word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "")
    );
    const longestWordLength = cleanedWords.reduce((longestLength, current) => {
      return current.length > longestLength ? current.length : longestLength;
    }, 0);
    const longestWordsInParagraph = cleanedWords.filter(
      (word) => word.length === longestWordLength
    );
    return longestWordsInParagraph;
  });
  cache.set("longestWords", longestWords);

  const userId = req.kauth.grant.access_token.content.sub;
  const report = { longestWords };
  appendReportToFile(userId, report);

  res.json({ longestWords });
});

app.get("/api/reports", keycloak.protect(), (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const reports = getUserReports(userId);
  res.json(reports);
});

function getParameters() {
  const text = fs.readFileSync(filePath, "utf8");
  const wordCount = text.split(/\s+/).length;
  const characterCount = text.replace(/\s/g, "").length;
  const sentenceCount = text.split(/[.!?]+/).length - 1;
  const paragraphCount = text.split(/\n\s*\n/).length;
  const paragraphs = text.split(/\n\s*\n/);
  const longestWords = paragraphs.map((paragraph) => {
    const words = paragraph.split(/\s+/);
    const longestWordLength = words.reduce((longestLength, current) => {
      return current.length > longestLength ? current.length : longestLength;
    }, 0);

    const longestWordsInParagraph = words.filter(
      (word) => word.length === longestWordLength
    );
    return longestWordsInParagraph;
  });

  return {
    wordCount: wordCount,
    characterCount: characterCount,
    sentenceCount: sentenceCount,
    paragraphCount: paragraphCount,
    longestWords: longestWords,
  };
}
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  function sendParameters() {
    const parameters = getParameters();
    res.write(`data: ${JSON.stringify(parameters)}\n\n`);
  }
  fs.watch(filePath, (eventType, filename) => {
    if (eventType === "change") {
      sendParameters();
    }
  });
  sendParameters();
  req.on("close", () => {
    console.log("Page Reloaded!!!!");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
