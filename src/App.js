// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [event, setEvent] = useState("");

  const handleClick = () => {
    setEvent(text);
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

      <button onClick={handleClick}>Add Event</button>

      <p>You typed: {text}</p>

      <h3>Event:</h3>
      <p>{event}</p>
    </div>
  );
}

export default App;
