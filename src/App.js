// App.js

import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");

    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [aiPreview, setAiPreview] = useState(null);

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  // ==========================
  // IMAGE CHANGE
  // ==========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);

      setPreview(URL.createObjectURL(file));
    }
  };

  // ==========================
  // IMAGE UPLOAD
  // ==========================

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();

    formData.append("image", selectedImage);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",

        body: formData,
      });

      const data = await res.json();

      console.log(data);

      if (!data.error) {
        setAiPreview(data);

        setShowPreview(true);
      } else {
        alert("AI extraction failed ❌");
      }
    } catch (error) {
      console.error(error);

      alert("Upload failed ❌");
    }
  };

  // ==========================
  // TOP ADD / EDIT
  // ==========================

  const handleTopAdd = async () => {
    if (!text.trim()) return;

    const res = await fetch("http://localhost:5000/parse", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (!data.error) {
      if (editIndex !== null) {
        const updated = [...events];

        updated[editIndex] = data;

        setEvents(updated);

        setEditIndex(null);
      } else {
        setEvents((prev) => [...prev, data]);
      }

      setText("");
    }
  };

  // ==========================
  // MONTH CHANGE
  // ==========================

  const changeMonth = (dir) => {
    const newDate = new Date(currentDate);

    newDate.setMonth(currentDate.getMonth() + dir);

    setCurrentDate(newDate);
  };

  const today = new Date();

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Eventify</h1>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Lunch on 9th at 12pm"
          style={styles.input}
        />

        <button onClick={handleTopAdd} style={styles.button}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* IMAGE UPLOAD */}
      <div style={styles.uploadSection}>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <>
            <img src={preview} alt="preview" style={styles.previewImage} />

            <button onClick={handleImageUpload} style={styles.button}>
              Upload Poster
            </button>
          </>
        )}
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        <button style={styles.arrowBtn} onClick={() => changeMonth(-1)}>
          ←
        </button>

        <h2>
          {monthNames[month]} {year}
        </h2>

        <button style={styles.arrowBtn} onClick={() => changeMonth(1)}>
          →
        </button>
      </div>

      {/* CALENDAR */}
      <div style={styles.calendar}>
        {dayNames.map((d) => (
          <div key={d} style={styles.dayLabel}>
            {d}
          </div>
        ))}

        {Array.from({
          length: firstDayOfMonth,
        }).map((_, i) => (
          <div key={i}></div>
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0",
          )}-${String(day).padStart(2, "0")}`;

          const dayEvents = events.filter((e) => e.date === dateStr);

          return (
            <div
              key={day}
              style={{
                ...styles.day,

                background: isToday(day) ? "#e8f5e9" : "white",

                border: isToday(day) ? "2px solid #4CAF50" : "1px solid #ccc",
              }}
              onClick={() => setSelectedDate(dateStr)}
            >
              <strong>{day}</strong>

              {dayEvents.map((event, i) => {
                const globalIndex = events.findIndex(
                  (e) =>
                    e.date === event.date &&
                    e.title === event.title &&
                    e.time === event.time,
                );

                return (
                  <div
                    key={i}
                    style={styles.event}
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedEvent(event);

                      setSelectedIndex(globalIndex);
                    }}
                  >
                    {event.time && `${event.time} `}
                    {event.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {selectedDate && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Add Event</h2>

            <p>
              <strong>Date:</strong> {selectedDate}
            </p>

            <input
              placeholder="e.g. Dinner at 8pm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.input}
            />

            <div style={styles.modalActions}>
              <button
                style={styles.editBtn}
                onClick={async () => {
                  if (!text.trim()) return;

                  const res = await fetch("http://localhost:5000/parse", {
                    method: "POST",

                    headers: {
                      "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                      text,
                    }),
                  });

                  const data = await res.json();

                  if (!data.error) {
                    const newEvent = {
                      ...data,

                      date: selectedDate,
                    };

                    setEvents((prev) => [...prev, newEvent]);

                    setText("");

                    setSelectedDate(null);
                  }
                }}
              >
                Add
              </button>

              <button
                style={styles.closeBtn}
                onClick={() => setSelectedDate(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAILS */}
      {selectedEvent && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Event Details</h2>

            <p>
              <strong>Event:</strong> {selectedEvent.title}
            </p>

            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>

            <p>
              <strong>Time:</strong> {selectedEvent.time || "Not specified"}
            </p>

            <div style={styles.modalActions}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  setText(
                    `${selectedEvent.title} ${
                      selectedEvent.time ? "at " + selectedEvent.time : ""
                    }`,
                  );

                  setEditIndex(selectedIndex);

                  setSelectedEvent(null);
                }}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => {
                  const updated = events.filter((_, i) => i !== selectedIndex);

                  setEvents(updated);

                  setSelectedEvent(null);
                }}
              >
                Delete
              </button>

              <button
                style={styles.closeBtn}
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI PREVIEW MODAL */}
      {showPreview && aiPreview && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>AI Extracted Event</h2>

            <input
              value={aiPreview.title}
              onChange={(e) =>
                setAiPreview({
                  ...aiPreview,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              style={styles.input}
            />

            <input
              type="date"
              value={aiPreview.date}
              onChange={(e) =>
                setAiPreview({
                  ...aiPreview,
                  date: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="time"
              value={aiPreview.time}
              onChange={(e) =>
                setAiPreview({
                  ...aiPreview,
                  time: e.target.value,
                })
              }
              style={styles.input}
            />

            <div style={styles.modalActions}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  setEvents((prev) => [...prev, aiPreview]);

                  setShowPreview(false);

                  setAiPreview(null);

                  alert("Event saved successfully ✅");
                }}
              >
                Save Event
              </button>

              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowPreview(false);

                  setAiPreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "20px auto",
    fontFamily: "Segoe UI",
    padding: "0 18px",
  },

  title: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "44px",
    fontWeight: "700",
  },

  // ==========================
  // INPUT ROW
  // ==========================

  inputBox: {
    display: "flex",
    gap: "14px",
    marginBottom: "24px",
    alignItems: "center",
  },

  // ==========================
  // INPUT
  // ==========================

  input: {
    flex: 1,
    height: "56px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "1px solid #d6d6d6",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    background: "white",
  },

  // ==========================
  // MAIN BUTTON
  // ==========================

  button: {
    height: "56px",
    padding: "0 30px",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.2s",
  },

  // ==========================
  // UPLOAD
  // ==========================

  uploadSection: {
    marginBottom: "24px",
  },

  previewImage: {
    width: "240px",
    display: "block",
    marginTop: "12px",
    borderRadius: "14px",
    border: "1px solid #ddd",
  },

  // ==========================
  // NAVIGATION
  // ==========================

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  arrowBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: "18px",
  },

  // ==========================
  // CALENDAR
  // ==========================

  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  },

  dayLabel: {
    textAlign: "center",
    fontWeight: "700",
    padding: "10px 0",
    fontSize: "15px",
  },

  day: {
    minHeight: "120px",
    padding: "8px",
    borderRadius: "12px",
    cursor: "pointer",
    background: "white",
    border: "1px solid #ddd",
    transition: "0.2s",
  },

  // ==========================
  // EVENTS
  // ==========================

  event: {
    background: "#43a047",
    color: "white",
    padding: "7px 8px",
    marginTop: "6px",
    borderRadius: "8px",
    fontSize: "12px",
    overflow: "hidden",
    lineHeight: "1.4",
  },

  // ==========================
  // OVERLAY
  // ==========================

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  // ==========================
  // MODAL
  // ==========================

  modal: {
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    width: "340px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "22px",
    gap: "10px",
  },

  // ==========================
  // MODAL BUTTONS
  // ==========================

  editBtn: {
    background: "#2196f3",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  closeBtn: {
    background: "#757575",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default App;
