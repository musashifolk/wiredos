import { useEffect, useMemo, useState } from "react";

function randomMatrixLine(length = 40) {
  const chars = "01<>[]{}#$%&@+-*/=~wired";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function randomCavaLine() {
  const bars = Array.from({ length: 24 }, () => Math.floor(Math.random() * 8) + 1);
  return bars.map((n) => "▁▂▃▄▅▆▇█"[Math.min(n - 1, 7)]).join(" ");
}

export default function TerminalApp({ openApp }) {
  const [lines, setLines] = useState([
    "wired terminal r1",
    "type 'help' for commands",
  ]);
  const [input, setInput] = useState("");
  const [visualMode, setVisualMode] = useState("shell");
  const [visualLines, setVisualLines] = useState([]);

  const fastfetchOutput = useMemo(
    () => [
      "wiredOS",
      "──────────────",
      "host: the wired",
      "kernel: perception-r1",
      "shell: terminal",
      "wm: wired compositor",
      "theme: lain-core",
      "uptime: unstable",
      "memory: fragmented",
      "signal: present",
    ],
    []
  );

  useEffect(() => {
    if (visualMode === "shell") return;

    const interval = setInterval(() => {
      if (visualMode === "cmatrix") {
        setVisualLines(Array.from({ length: 16 }, () => randomMatrixLine(56)));
      }

      if (visualMode === "cava") {
        setVisualLines(Array.from({ length: 12 }, () => randomCavaLine()));
      }
    }, 120);

    return () => clearInterval(interval);
  }, [visualMode]);

  function runCommand(value) {
    const command = value.trim();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
      setVisualMode("shell");
      return;
    }

    if (command === "help") {
      setLines((current) => [
        ...current,
        `> ${command}`,
        "help",
        "clear",
        "date",
        "echo [text]",
        "open notes",
        "open files",
        "open wired",
        "open media",
        "open presence",
        "open settings",
        "fastfetch",
        "cmatrix",
        "cava",
        "exitviz",
      ]);
      return;
    }

    if (command === "date") {
      setLines((current) => [...current, `> ${command}`, new Date().toString()]);
      return;
    }

    if (command === "fastfetch") {
      setVisualMode("shell");
      setLines((current) => [...current, `> ${command}`, ...fastfetchOutput]);
      return;
    }

    if (command === "cmatrix") {
      setVisualMode("cmatrix");
      setLines((current) => [...current, `> ${command}`, "matrix signal opened"]);
      return;
    }

    if (command === "cava") {
      setVisualMode("cava");
      setLines((current) => [...current, `> ${command}`, "audio spectrum opened"]);
      return;
    }

    if (command === "exitviz") {
      setVisualMode("shell");
      setVisualLines([]);
      setLines((current) => [...current, `> ${command}`, "visual mode closed"]);
      return;
    }

    if (command.startsWith("echo ")) {
      setLines((current) => [...current, `> ${command}`, command.slice(5)]);
      return;
    }

    if (command.startsWith("open ")) {
      const target = command.slice(5).trim().toLowerCase();

      const map = {
        notes: "Notes",
        files: "Files",
        wired: "Wired",
        media: "Media",
        presence: "Presence",
        settings: "Settings",
      };

      if (map[target]) {
        openApp(map[target]);
        setLines((current) => [...current, `> ${command}`, `opening ${map[target]}...`]);
      } else {
        setLines((current) => [...current, `> ${command}`, "unknown target"]);
      }

      return;
    }

    setLines((current) => [...current, `> ${command}`, "command not found"]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runCommand(input);
    setInput("");
  }

  return (
    <div className="app-shell terminal-app">
      <div className="terminal-glitch-line" />

      {visualMode !== "shell" && (
        <div className="terminal-visual-panel">
          {visualLines.map((line, index) => (
            <div key={`${line}-${index}`} className="terminal-visual-line">
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="terminal-output">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} className="terminal-line">
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="terminal-form">
        <span className="terminal-prompt">&gt;</span>
        <input
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
}