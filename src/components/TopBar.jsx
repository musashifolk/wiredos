import { useEffect, useMemo, useState } from "react";
import {
  BatteryMedium,
  Bell,
  Power,
  Volume2,
  VolumeX,
  Terminal,
  FileText,
  Globe,
  Folder,
  AudioLines,
  Eye,
  Settings,
} from "lucide-react";

const WORKSPACES = [1, 2, 3, 4, 5];

const APP_ICONS = {
  Terminal: Terminal,
  Notes: FileText,
  Wired: Globe,
  Files: Folder,
  Media: AudioLines,
  Presence: Eye,
  Settings: Settings,
};

export default function TopBar({
  windows,
  allWindows,
  activeWorkspace,
  onSwitchWorkspace,
  onFocusWindow,
  onLogout,
}) {
  const [timeText, setTimeText] = useState("");
  const [battery, setBattery] = useState({
    level: 73,
    supported: false,
  });
  const [muted, setMuted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);

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

      setTimeText(`${time}${day}`);
    }

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cleanup = null;

    if ("getBattery" in navigator && typeof navigator.getBattery === "function") {
      navigator.getBattery().then((manager) => {
        function syncBattery() {
          setBattery({
            level: Math.round(manager.level * 100),
            supported: true,
          });
        }

        syncBattery();
        manager.addEventListener("levelchange", syncBattery);

        cleanup = () => {
          manager.removeEventListener("levelchange", syncBattery);
        };
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const activeApps = useMemo(() => {
    return windows.map((win) => ({
      id: win.id,
      title: win.title,
      appName: win.appName,
    }));
  }, [windows]);

  return (
    <>
      <div className="topbar left">
        <div className="topbar-label">Apps</div>

        <div className="topbar-workspaces">
          {WORKSPACES.map((workspace) => (
            <button
              key={workspace}
              type="button"
              className={`topbar-workspace-btn ${
                activeWorkspace === workspace ? "active" : ""
              }`}
              onClick={() => onSwitchWorkspace(workspace)}
            >
              {workspace}
            </button>
          ))}
        </div>

        <div className="topbar-open-apps">
          {activeApps.map((item) => {
            const Icon = APP_ICONS[item.appName] || FileText;

            return (
              <button
                key={item.id}
                type="button"
                className="topbar-app-badge"
                title={item.title}
                onClick={() => onFocusWindow(item.id)}
              >
                <Icon size={13} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="topbar center">
        <div className="topbar-clock">{timeText}</div>
      </div>

      <div className="topbar right">
        <div className="topbar-status-item">
          <BatteryMedium size={15} />
          <span>{battery.level}%</span>
        </div>

        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => setMuted((prev) => !prev)}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => {
            setNotifOpen((prev) => !prev);
            setPowerOpen(false);
          }}
          title="Notifications"
        >
          <Bell size={15} />
        </button>

        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => {
            setPowerOpen((prev) => !prev);
            setNotifOpen(false);
          }}
          title="Power"
        >
          <Power size={15} />
        </button>

        {notifOpen && (
          <div className="topbar-popover notifications-popover">
            <div className="topbar-popover-title">Notifications</div>
            <div className="topbar-popover-line">
              Active apps here: {windows.length}
            </div>
            <div className="topbar-popover-line">
              Total apps open: {allWindows.length}
            </div>
            <div className="topbar-popover-line">
              Audio: {muted ? "muted" : "enabled"}
            </div>
          </div>
        )}

        {powerOpen && (
          <div className="topbar-popover power-popover">
            <button
              type="button"
              className="topbar-menu-btn"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <button
              type="button"
              className="topbar-menu-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}