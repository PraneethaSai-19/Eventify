import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    const res = await fetch("http://localhost:5000/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });

    const data = await res.json();
    setResponse(data.yourText);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Calendar</h1>

      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleClick}>Send to Backend</button>

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;
