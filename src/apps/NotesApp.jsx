import { useEffect, useState } from "react";

export default function NotesApp() {
  const [value, setValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("wiredos-notes");
    if (saved) setValue(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("wiredos-notes", value);
  }, [value]);

  return (
    <div className="app-shell notes-app">
      <div className="app-glitch-overlay" />
      <div className="notes-heading">memory fragment</div>
      <textarea
        className="notes-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="write something the wired should remember..."
      />
    </div>
  );
}