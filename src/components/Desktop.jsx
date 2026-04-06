import { useMemo, useRef, useState } from "react";
import Dock from "./Dock";
import TopBar from "./TopBar";
import Window from "./Window";

import wallpaperMain from "../assets/images/desk-wallpaper.jpg";
import wallpaperAlt1 from "../assets/images/customwalpep-1.png";
import wallpaperAlt2 from "../assets/images/customwalpep-2.png";

import TerminalApp from "../apps/TerminalApp";
import NotesApp from "../apps/NotesApp";
import WiredApp from "../apps/WiredApp";
import FilesApp from "../apps/FilesApp";
import MediaApp from "../apps/MediaApp";
import PresenceApp from "../apps/PresenceApp";
import SettingsApp from "../apps/SettingsApp";

import "../styles/desktop.css";

const THEMES = {
  wiredDark: {
    id: "wiredDark",
    wallpaper: wallpaperMain,
    colors: {
      accent: "255, 96, 144",
      border: "255, 174, 203",
      bg: "16, 8, 13",
      panel: "18, 10, 14",
      text: "248, 231, 236",
      muted: "233, 216, 222",
    },
  },
  paleGrid: {
    id: "paleGrid",
    wallpaper: wallpaperAlt1,
    colors: {
      accent: "125, 160, 255",
      border: "170, 190, 255",
      bg: "10, 12, 22",
      panel: "14, 18, 30",
      text: "232, 238, 255",
      muted: "190, 202, 236",
    },
  },
  roseSignal: {
    id: "roseSignal",
    wallpaper: wallpaperAlt2,
    colors: {
      accent: "255, 140, 188",
      border: "255, 190, 220",
      bg: "20, 8, 15",
      panel: "26, 10, 18",
      text: "248, 232, 238",
      muted: "224, 200, 212",
    },
  },
};

const APP_DEFS = {
  Terminal: {
    title: "Terminal",
    width: 760,
    height: 460,
    x: 90,
    y: 90,
    minWidth: 520,
    minHeight: 320,
    component: TerminalApp,
  },
  Notes: {
    title: "Notes",
    width: 560,
    height: 440,
    x: 130,
    y: 110,
    minWidth: 420,
    minHeight: 280,
    component: NotesApp,
  },
  Wired: {
    title: "Wired",
    width: 780,
    height: 540,
    x: 170,
    y: 80,
    minWidth: 580,
    minHeight: 360,
    component: WiredApp,
  },
  Files: {
    title: "Files",
    width: 580,
    height: 430,
    x: 220,
    y: 120,
    minWidth: 420,
    minHeight: 280,
    component: FilesApp,
  },
  Media: {
    title: "Media",
    width: 520,
    height: 620,
    x: 260,
    y: 60,
    minWidth: 420,
    minHeight: 420,
    component: MediaApp,
  },
  Presence: {
    title: "Presence",
    width: 520,
    height: 360,
    x: 300,
    y: 120,
    minWidth: 380,
    minHeight: 240,
    component: PresenceApp,
  },
  Settings: {
    title: "Settings",
    width: 500,
    height: 420,
    x: 340,
    y: 140,
    minWidth: 380,
    minHeight: 280,
    component: SettingsApp,
  },
};

export default function Desktop({ onLogout }) {
  const [windows, setWindows] = useState([]);
  const [topZ, setTopZ] = useState(10);
  const [showDock, setShowDock] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [themeId, setThemeId] = useState("wiredDark");

  const [desktopSettings, setDesktopSettings] = useState({
    glow: 0.18,
    blur: 10,
    crt: true,
  });

  const openingRef = useRef(new Set());

  const theme = THEMES[themeId];

  function focusWindow(id) {
    setTopZ((prevTopZ) => {
      const nextZ = prevTopZ + 1;

      setWindows((current) =>
        current.map((win) =>
          win.id === id ? { ...win, z: nextZ } : win
        )
      );

      return nextZ;
    });
  }

  function switchWorkspace(workspaceNumber) {
    setActiveWorkspace(workspaceNumber);
    setShowDock(true);
  }

  function openApp(appName) {
    const key = `${appName}-${activeWorkspace}`;

    if (openingRef.current.has(key)) return;
    openingRef.current.add(key);

    setWindows((current) => {
      const existing = current.find(
        (win) => win.appName === appName && win.workspace === activeWorkspace
      );

      if (existing) {
        setTopZ((prevTopZ) => {
          const nextZ = prevTopZ + 1;

          setWindows((inner) =>
            inner.map((win) =>
              win.id === existing.id ? { ...win, z: nextZ } : win
            )
          );

          return nextZ;
        });

        return current;
      }

      const def = APP_DEFS[appName];
      if (!def) return current;

      const nextZ = topZ + 1;
      setTopZ(nextZ);

      return [
        ...current,
        {
          id: `${appName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          appName,
          title: def.title,
          workspace: activeWorkspace,
          x: def.x,
          y: def.y,
          width: def.width,
          height: def.height,
          minWidth: def.minWidth,
          minHeight: def.minHeight,
          z: nextZ,
        },
      ];
    });

    requestAnimationFrame(() => {
      openingRef.current.delete(key);
    });
  }

  function closeWindow(id) {
    setWindows((current) => current.filter((win) => win.id !== id));
  }

  function moveWindow(id, x, y) {
    const maxX = Math.max(20, window.innerWidth - 280);
    const maxY = Math.max(20, window.innerHeight - 120);

    const nextX = Math.max(20, Math.min(x, maxX));
    const nextY = Math.max(56, Math.min(y, maxY));

    setWindows((current) =>
      current.map((win) =>
        win.id === id ? { ...win, x: nextX, y: nextY } : win
      )
    );
  }

  function resizeWindow(id, width, height) {
    setWindows((current) =>
      current.map((win) => {
        if (win.id !== id) return win;

        const nextWidth = Math.max(
          win.minWidth || 360,
          Math.min(width, window.innerWidth - win.x - 20)
        );

        const nextHeight = Math.max(
          win.minHeight || 240,
          Math.min(height, window.innerHeight - win.y - 20)
        );

        return {
          ...win,
          width: nextWidth,
          height: nextHeight,
        };
      })
    );
  }

  const visibleWindows = useMemo(() => {
    return windows.filter((win) => win.workspace === activeWorkspace);
  }, [windows, activeWorkspace]);

  const renderedWindows = useMemo(() => {
    return visibleWindows.map((win) => {
      const AppComponent = APP_DEFS[win.appName].component;

      return (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          minWidth={win.minWidth}
          minHeight={win.minHeight}
          z={win.z}
          glow={desktopSettings.glow}
          blur={desktopSettings.blur}
          crt={desktopSettings.crt}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
        >
          <AppComponent
            openApp={openApp}
            settings={desktopSettings}
            setSettings={setDesktopSettings}
            themeId={themeId}
            setThemeId={setThemeId}
          />
        </Window>
      );
    });
  }, [visibleWindows, desktopSettings, themeId]);

  const workspaceWindows = windows.filter((win) => win.workspace === activeWorkspace);

  return (
    <main
      className="desktop"
      style={{
        backgroundImage: `url(${theme.wallpaper})`,
        "--theme-accent": theme.colors.accent,
        "--theme-border": theme.colors.border,
        "--theme-bg": theme.colors.bg,
        "--theme-panel": theme.colors.panel,
        "--theme-text": theme.colors.text,
        "--theme-muted": theme.colors.muted,
      }}
      onMouseMove={(e) => {
        const hasWindowsOpen = workspaceWindows.length > 0;
        const nearBottom = window.innerHeight - e.clientY <= 96;

        if (!hasWindowsOpen) {
          setShowDock(true);
          return;
        }

        setShowDock(nearBottom);
      }}
    >
      <div className="desktop-vignette" />
      <div className="desktop-noise" />
      <div className="desktop-wire-glow" />

      <TopBar
        windows={workspaceWindows}
        allWindows={windows}
        activeWorkspace={activeWorkspace}
        onSwitchWorkspace={switchWorkspace}
        onFocusWindow={focusWindow}
        onLogout={onLogout}
      />

      {renderedWindows}

      <Dock onAppClick={openApp} visible={showDock} />
    </main>
  );
}