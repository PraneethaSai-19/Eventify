import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [events, setEvents] = useState([]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const handleClick = async () => {
    try {
      const res = await fetch("http://localhost:5000/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!data.error) {
        setEvents((prev) => [...prev, data]);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick();
  };

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
      <h1 style={styles.heading}>AI Calendar</h1>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "Meeting tomorrow at 5pm"'
          style={styles.input}
        />
        <button onClick={handleClick} style={styles.button}>
          Add
        </button>
      </div>

      {/* Month */}
      <h2 style={styles.monthHeading}>
        {monthNames[month]} {year}
      </h2>

      {/* Calendar */}
      <div style={styles.calendar}>
        {dayNames.map((d) => (
          <div key={d} style={styles.dayLabel}>
            {d}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={i} style={styles.emptyDay} />
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = events.filter((e) => e.date === dateStr);

          return (
            <div key={day} style={styles.day}>
              <strong>{day}</strong>

              {dayEvents.map((event, i) => (
                <div key={i} style={styles.event}>
                  {event.time && <span>{event.time} </span>}
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "20px auto", fontFamily: "Arial" },
  heading: { textAlign: "center" },
  monthHeading: { textAlign: "center" },
  inputBox: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px" },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
  },
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "5px",
  },
  dayLabel: { textAlign: "center", fontWeight: "bold" },
  emptyDay: { minHeight: "80px" },
  day: { border: "1px solid #ccc", minHeight: "80px", padding: "5px" },
  event: {
    backgroundColor: "#4CAF50",
    color: "white",
    marginTop: "3px",
    padding: "3px",
    borderRadius: "4px",
    fontSize: "12px",
  },
};

export default App;
