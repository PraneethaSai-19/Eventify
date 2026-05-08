const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 EVENT PARSER
function parseEvent(text) {
  const today = new Date();

  const todayStr = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const lower = text.toLowerCase();

  // DATE
  let date = todayStr;

  if (lower.includes("tomorrow")) {
    date = tomorrowStr;
  }

  // DAY NAMES
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  for (let i = 0; i < dayNames.length; i++) {
    if (lower.includes(dayNames[i])) {
      const todayDay = today.getDay();

      let diff = i - todayDay;

      if (diff <= 0) diff += 7;

      const targetDate = new Date(today);

      targetDate.setDate(today.getDate() + diff);

      date = targetDate.toISOString().split("T")[0];

      break;
    }
  }

  // TIME
  let time = "";

  const timeMatch = text.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i
  );

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

  // TITLE
  let title = text
    .replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi, "")
    .replace(/\b(today|tomorrow|at|on|this|next)\b/gi, "")
    .replace(
      /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  title =
    title.charAt(0).toUpperCase() + title.slice(1);

  if (!title) title = "Untitled";

  return {
    title,
    date,
    time,
  };
}

// API
app.post("/parse", (req, res) => {
  try {
    const text = req.body.text;

    const result = parseEvent(text);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.json({
      error: "Parse failed",
      details: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});