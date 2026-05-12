# AI Calendar 📅🤖

AI Calendar is a smart event management web application that allows users to create and manage events using natural language and AI-powered poster extraction.

Users can:
- Add events by typing natural language
- Upload event posters/images
- Automatically extract event details using OCR + AI
- View events in a clean calendar UI
- Edit or delete events easily

---

# ✨ Features

## 📝 Natural Language Event Input

Users can type:
- `Lunch on 9th at 1pm`
- `Hackathon tomorrow at 6pm`
- `Meeting July 25 at 4pm`

The app intelligently extracts:
- Event title
- Date
- Time

---

## 🖼 AI Poster Event Extraction

Upload event posters and the system will:
1. Extract text using OCR
2. Process extracted text using AI
3. Detect:
   - Event title
   - Event date
   - Event time
4. Show confirmation popup before saving

---

## 📆 Interactive Calendar

- Monthly calendar view
- Events displayed on correct dates
- Highlight current day
- Navigate between months

---

## ✏ Event Management

Users can:
- Add events
- Edit events
- Delete events
- Confirm AI extracted events

---

# 🏗 Architecture Diagram

![AI Calendar Architecture](./README-assets/architecture.png)

---

# 🛠 Tech Stack

## Frontend
- React.js
- JavaScript
- CSS (Inline Styling)

## Backend
- Node.js
- Express.js

## AI / OCR
- Tesseract.js (OCR)
- Mistral AI API

## File Upload
- Multer

## Storage
- LocalStorage

---

# 📂 Project Structure

```bash
react-ai-calendar/
│
├── README-assets/
│   └── architecture.png
│
├── backend/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── public/
├── src/
│   ├── App.js
│   └── ...
│
├── package.json
└── README.md
```

---

# ⚙ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-calendar.git
```

---

## 2️⃣ Frontend Setup

Open terminal:

```bash
cd react-ai-calendar
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 3️⃣ Backend Setup

Open another terminal:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Install required packages:

```bash
npm install express cors multer dotenv tesseract.js @mistralai/mistralai
```

---

# 🔑 Environment Variables

Inside `backend/`, create a `.env` file:

```env
MISTRAL_API_KEY=your_api_key_here
```

---

# 🚀 Start Backend

Inside backend folder:

```bash
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🧠 How AI Poster Extraction Works

```text
Poster Image
     ↓
OCR using Tesseract.js
     ↓
Extracted Text
     ↓
Mistral AI Processing
     ↓
Structured Event Data
     ↓
Confirmation Popup
     ↓
Saved to Calendar
```

---

# 📸 Example Inputs

## Manual Input

```text
Lunch on 10th at 1pm
```

## Poster Upload

Upload:
- Event posters
- Party flyers
- College fest posters
- Hackathon banners

The system extracts event details automatically.

---

# 🔮 Future Improvements

- Google Calendar Sync
- Event Notifications
- Dark Mode
- User Authentication
- Database Integration
- Better AI Extraction
- Mobile Responsive UI

---

# 👩‍💻 Author

Developed by Praneetha Sai ✨

---

# ⭐ If you like this project

Give it a star on GitHub ⭐
