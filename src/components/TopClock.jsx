import { useEffect, useState } from "react";

export default function TopClock() {
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const day = now.toLocaleDateString([], {
        weekday: "short",
      });

      setTimeText(`${time} ${day}`);
    }

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="top-clock-wrap">
      <div className="top-clock">{timeText}</div>
    </div>
  );
}