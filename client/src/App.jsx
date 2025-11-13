import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState("Idle...");
  const [targetLocales, setTargetLocales] = useState("hi,es,fr");

  useEffect(() => {
    socket.on("status", (msg) => setStatus(msg));
    return () => socket.off("status");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Starting...");
    try {
      await axios.post("http://localhost:5000/api/translate", {
        repoUrl,
        targetLocales: targetLocales.split(",").map((l) => l.trim()),
      });
      setStatus("🎉 Translation complete!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error during translation.");
    }
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1>🌍 Polyglot Push</h1>
      <p>Auto-translate GitHub repos using Lingo CLI magic.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="GitHub repo URL"
          style={{ width: 400, padding: 10, borderRadius: 8 }}
          required
        />
        <br />
        <br />
        <input
          type="text"
          value={targetLocales}
          onChange={(e) => setTargetLocales(e.target.value)}
          placeholder="Languages (comma separated)"
          style={{ width: 400, padding: 10, borderRadius: 8 }}
        />
        <br />
        <br />
        <button
          style={{
            padding: 10,
            width: 420,
            borderRadius: 8,
            background: "#007bff",
            color: "white",
          }}
        >
          Translate Now
        </button>
      </form>

      <div
        style={{
          marginTop: 20,
          background: "#222",
          color: "#61dafb",
          padding: 15,
          borderRadius: 10,
          width: 420,
          margin: "auto",
          textAlign: "left",
          fontFamily: "monospace",
        }}
      >
        {status}
      </div>
    </div>
  );
}

export default App;
