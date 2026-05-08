import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");

    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  // TOP INPUT
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

  // MONTH CHANGE
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
      <h1 style={styles.title}>AI Calendar</h1>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Lunch tomorrow at 5pm"
          style={styles.input}
        />

        <button onClick={handleTopAdd} style={styles.button}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
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
              {/* EDIT */}
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

              {/* DELETE */}
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

              {/* CLOSE */}
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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "950px",

    margin: "20px auto",

    fontFamily: "Segoe UI",

    padding: "0 16px",
  },

  title: {
    textAlign: "center",

    marginBottom: "20px",
  },

  inputBox: {
    display: "flex",

    gap: "10px",

    marginBottom: "20px",
  },

  input: {
    flex: 1,

    padding: "12px",

    borderRadius: "8px",

    border: "1px solid #ccc",

    fontSize: "15px",
  },

  button: {
    padding: "12px 20px",

    background: "#2196f3",

    color: "white",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",
  },

  nav: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "12px",
  },

  arrowBtn: {
    width: "36px",

    height: "36px",

    borderRadius: "50%",

    border: "1px solid #ccc",

    background: "white",

    cursor: "pointer",
  },

  calendar: {
    display: "grid",

    gridTemplateColumns: "repeat(7, 1fr)",

    gap: "6px",
  },

  dayLabel: {
    textAlign: "center",

    fontWeight: "bold",

    padding: "6px 0",
  },

  day: {
    minHeight: "110px",

    padding: "6px",

    borderRadius: "8px",

    cursor: "pointer",

    transition: "0.2s",
  },

  event: {
    background: "#4CAF50",

    color: "white",

    padding: "6px 8px",

    marginTop: "5px",

    borderRadius: "6px",

    fontSize: "12px",
  },

  overlay: {
    position: "fixed",

    top: 0,

    left: 0,

    width: "100%",

    height: "100%",

    background: "rgba(0,0,0,0.4)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",
  },

  modal: {
    background: "white",

    padding: "24px",

    borderRadius: "12px",

    width: "320px",
  },

  modalActions: {
    display: "flex",

    justifyContent: "space-between",

    marginTop: "20px",
  },

  editBtn: {
    background: "#2196f3",

    color: "white",

    border: "none",

    padding: "8px 14px",

    borderRadius: "6px",

    cursor: "pointer",
  },

  deleteBtn: {
    background: "#f44336",

    color: "white",

    border: "none",

    padding: "8px 14px",

    borderRadius: "6px",

    cursor: "pointer",
  },

  closeBtn: {
    background: "#777",

    color: "white",

    border: "none",

    padding: "8px 14px",

    borderRadius: "6px",

    cursor: "pointer",
  },
};

export default App;
