export default function SettingsApp({
  settings,
  setSettings,
  themeId,
  setThemeId,
}) {
  return (
    <div className="app-shell settings-app">
      <div className="app-glitch-overlay" />

      <div className="settings-heading">Desktop Theme</div>

      <div className="settings-theme-grid">
        <button
          type="button"
          className={`settings-theme-card ${themeId === "wiredDark" ? "active" : ""}`}
          onClick={() => setThemeId("wiredDark")}
        >
          <span>Wired Dark</span>
        </button>

        <button
          type="button"
          className={`settings-theme-card ${themeId === "paleGrid" ? "active" : ""}`}
          onClick={() => setThemeId("paleGrid")}
        >
          <span>Pale Grid</span>
        </button>

        <button
          type="button"
          className={`settings-theme-card ${themeId === "roseSignal" ? "active" : ""}`}
          onClick={() => setThemeId("roseSignal")}
        >
          <span>Rose Signal</span>
        </button>
      </div>

      <label className="settings-row">
        <span>window glow</span>
        <input
          type="range"
          min="0"
          max="0.45"
          step="0.01"
          value={settings.glow}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              glow: Number(e.target.value),
            }))
          }
        />
      </label>

      <label className="settings-row">
        <span>window blur</span>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={settings.blur}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              blur: Number(e.target.value),
            }))
          }
        />
      </label>

      <label className="settings-row settings-toggle">
        <span>crt overlay</span>
        <button
          type="button"
          className="settings-toggle-btn"
          onClick={() =>
            setSettings((prev) => ({
              ...prev,
              crt: !prev.crt,
            }))
          }
        >
          {settings.crt ? "enabled" : "disabled"}
        </button>
      </label>
    </div>
  );
}