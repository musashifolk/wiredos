import { useEffect, useState } from "react";

export default function PresenceApp() {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicks((prev) => prev + 1);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const lines = [
    "signal detected...",
    "node resolved: wired-user",
    "observing input drift...",
    "memory surface unstable",
    "presence remains active",
    "you stayed.",
  ];

  return (
    <div className="app-shell presence-app">
      <div className="app-glitch-overlay" />
      <div className="presence-lines">
        {lines.slice(0, Math.min(lines.length, ticks + 2)).map((line) => (
          <div key={line} className="presence-line">
            &gt; {line}
          </div>
        ))}
      </div>
    </div>
  );
}