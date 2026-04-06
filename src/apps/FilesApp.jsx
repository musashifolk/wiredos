const fakeFiles = [
  { type: "folder", name: "/home" },
  { type: "folder", name: "/memory" },
  { type: "folder", name: "/cyberia" },
  { type: "file", name: "presence.log" },
  { type: "file", name: "signal_report.md" },
  { type: "file", name: "observer.txt" },
];

export default function FilesApp() {
  return (
    <div className="app-shell files-app">
      <div className="app-glitch-overlay" />
      <div className="files-heading">indexed nodes</div>
      <div className="files-list">
        {fakeFiles.map((item) => (
          <div key={item.name} className="file-row">
            <span className={`file-type ${item.type}`}>{item.type}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}