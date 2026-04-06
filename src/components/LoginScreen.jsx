import { useState } from "react";
import bg from "../assets/images/lain-os-bg.jpg";
import avatar from "../assets/videos/lain-avatar.mp4";
import WiredClock from "./WiredClock";
import "../styles/login.css";

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password.trim().toLowerCase() === "wired") {
      setError("");
      onLogin();
      return;
    }

    setError("access denied");
  }

  return (
    <div
      className="login-root"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay-dark" />
      <div className="overlay-noise" />
      <div className="overlay-scanline" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />

      <WiredClock />

      <div className="login-shell">
        <div className="login-panel">
          <video
            className="avatar-video"
            src={avatar}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="username">wired-user</div>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              className="password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>

          <div className="hint">
            hint: “the network that connects everyone.”
          </div>

          {error ? <div className="error-text">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}