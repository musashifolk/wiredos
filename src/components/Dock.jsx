import { useState } from "react";
import {
  Terminal,
  FileText,
  Globe,
  Folder,
  AudioLines,
  Eye,
  Settings,
} from "lucide-react";

const dockApps = [
  { name: "Terminal", icon: Terminal },
  { name: "Notes", icon: FileText },
  { name: "Wired", icon: Globe },
  { name: "Files", icon: Folder },
  { name: "Media", icon: AudioLines },
  { name: "Presence", icon: Eye },
  { name: "Settings", icon: Settings },
];

export default function Dock({ onAppClick, visible }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  function getItemClass(index) {
    if (hoveredIndex === null) return "dock-item";
    if (index === hoveredIndex) return "dock-item hover";
    if (Math.abs(index - hoveredIndex) === 1) return "dock-item sibling-close";
    if (Math.abs(index - hoveredIndex) === 2) return "dock-item sibling-far";
    return "dock-item";
  }

  return (
    <div className={`dock-wrap ${visible ? "is-visible" : "is-hidden"}`}>
      <nav className="dock-bar" aria-label="Application dock">
        <ul className="dock-list">
          {dockApps.map((app, index) => {
            const Icon = app.icon;

            return (
              <li
                key={app.name}
                className={getItemClass(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <button
                  type="button"
                  className="dock-link"
                  onClick={() => onAppClick(app.name)}
                  aria-label={app.name}
                >
                  <div className="dock-icon-shell">
                    <Icon className="dock-svg-icon" strokeWidth={1.8} />
                  </div>
                </button>

                <div className="dock-tooltip">{app.name}</div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}