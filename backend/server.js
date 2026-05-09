// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Tesseract = require("tesseract.js");

const { Mistral } = require("@mistralai/mistralai");

const app = express();

app.use(cors());

app.use(express.json());

// ==========================
// MISTRAL CLIENT
// ==========================

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// ==========================
// MULTER
// ==========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ==========================
// DATE FORMATTER
// ==========================

function formatLocalDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ==========================
// SIMPLE TEXT PARSER
// ==========================

function parseEvent(text) {
  const today = new Date();

  const lower = text.toLowerCase();

  let date = formatLocalDate(today);

  let time = "";

  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const monthDateMatch = lower.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{1,2})(st|nd|rd|th)?/,
  );

  if (monthDateMatch) {
    const monthName = monthDateMatch[1];

    const dayNumber = parseInt(monthDateMatch[2]);

    const targetDate = new Date(
      today.getFullYear(),
      months[monthName],
      dayNumber,
    );

    date = formatLocalDate(targetDate);
  }

  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);

  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);

    const minutes = timeMatch[2] || "00";

    const period = timeMatch[3].toUpperCase();

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    time = `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  let lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 3);

  let title = lines[0] || "Unknown Event";

  title = title.replace(/[^a-zA-Z0-9\s]/g, "");

  return {
    title,
    date,
    time,
  };
}

// ==========================
// TEXT INPUT ROUTE
// ==========================

app.post("/parse", (req, res) => {
  try {
    const text = req.body.text;

    const result = parseEvent(text);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Parse failed",
    });
  }
});

// ==========================
// OCR + MISTRAL ROUTE
// ==========================

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // ==========================
    // OCR
    // ==========================

    const result = await Tesseract.recognize(imagePath, "eng");

    const extractedText = result.data.text;

    console.log("OCR TEXT:");

    console.log(extractedText);

    // ==========================
    // MISTRAL AI
    // ==========================

    const response = await client.chat.complete({
      model: "mistral-small-latest",

      messages: [
        {
          role: "user",

          content: `
Extract the event details from this OCR text.

Return ONLY valid JSON.

Format:
{
  "title": "",
  "date": "",
  "time": ""
}

Rules:
- Convert date into YYYY-MM-DD format
- Convert time into 24 hour format
- If missing use empty string

OCR TEXT:
${extractedText}
`,
        },
      ],
    });

    const aiText = response.choices[0].message.content;

    console.log("MISTRAL OUTPUT:");

    console.log(aiText);

    // ==========================
    // JSON PARSE
    // ==========================

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = parseEvent(extractedText);
    }

    res.json(parsed);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI poster extraction failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
