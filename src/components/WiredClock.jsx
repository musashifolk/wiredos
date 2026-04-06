import { useEffect, useState } from "react";
import "../styles/clock.css";

export default function WiredClock() {
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const day = now.toLocaleDateString([], {
        weekday: "short",
      });

      setTimeText(`${time} ${day}`);
    }

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="wired-clock">{timeText}</div>;
}