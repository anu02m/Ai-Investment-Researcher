import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const[message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/test")
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
    .catch(() => setMessage("failed to connect to backend"));
  },[]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App
