import { useState } from "react";
import { Minus, X } from "lucide-react";

export default function Window({
  id,
  title,
  x,
  y,
  width,
  height,
  z,
  children,
  onFocus,
  onClose,
  onMove,
  onResize,
  glow,
  blur,
  crt,
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  function beginDrag(e) {
    if (e.button !== 0) return;

    onFocus(id);
    setDragging(true);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = x;
    const startY = y;

    function handleMove(moveEvent) {
      const nextX = startX + (moveEvent.clientX - startMouseX);
      const nextY = startY + (moveEvent.clientY - startMouseY);
      onMove(id, nextX, nextY);
    }

    function handleUp() {
      setDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  function beginResize(e) {
    e.stopPropagation();
    if (e.button !== 0) return;

    onFocus(id);
    setResizing(true);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    function handleMove(moveEvent) {
      const nextWidth = startWidth + (moveEvent.clientX - startMouseX);
      const nextHeight = startHeight + (moveEvent.clientY - startMouseY);
      onResize(id, nextWidth, nextHeight);
    }

    function handleUp() {
      setResizing(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  function stopButtonPropagation(e) {
    e.stopPropagation();
  }

  return (
    <section
      className={`window-frame ${dragging ? "is-dragging" : ""} ${resizing ? "is-resizing" : ""} ${crt ? "crt-window" : ""}`}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex: z,
        boxShadow: `0 0 48px rgba(255, 96, 144, ${glow})`,
        backdropFilter: `blur(${blur}px)`,
      }}
      onMouseDown={() => onFocus(id)}
    >
      <header className="window-titlebar" onMouseDown={beginDrag}>
        <div className="window-title">{title}</div>

        <div className="window-controls">
          <button
            type="button"
            className="window-btn"
            aria-label="Minimize"
            onMouseDown={stopButtonPropagation}
          >
            <Minus size={14} />
          </button>

          <button
            type="button"
            className="window-btn close"
            aria-label="Close"
            onMouseDown={stopButtonPropagation}
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="window-body">{children}</div>

      <button
        type="button"
        className="window-resize-handle"
        aria-label="Resize window"
        onMouseDown={beginResize}
      />
    </section>
  );
}