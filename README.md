# WiredOS

WiredOS is a browser-based desktop environment inspired by Serial Experiments Lain and tiling Linux desktops. It is built with React and Vite and focuses on a calm, dark interface with draggable windows, workspace separation, and a small set of system-style apps.

## What it does

WiredOS includes:

- a themed login screen
- a desktop shell with wallpaper-aware styling
- workspace switching
- draggable and resizable windows
- a dock with app launching
- a top bar with clock, workspace controls, and status widgets
- a terminal with lightweight visual modes
- notes with local persistence
- a Wikipedia-based browser view in the Wired app
- a media player with playlist support
- a settings panel for theme and visual controls

### Terminal
A simple shell-like app with commands such as:

- `help`
- `date`
- `clear`
- `open notes`
- `open files`
- `open wired`
- `open media`
- `open presence`
- `open settings`
- `fastfetch`
- `cmatrix`
- `cava`

### Notes
A local notes panel backed by `localStorage`.
The password is 'wired' incase you dont get the hint.

### Wired
A minimal Wikipedia browser that searches and loads article summaries.

### Files
A lightweight mock file browser for the OS theme.

### Media
A local audio player with rotating cover art, transport controls, and a playlist.

### Presence
A small reactive log window intended to feel like part of the system rather than a normal app.

### Settings
Controls for wallpaper theme, window glow, blur, and CRT-style overlays.

## Stack

- React
- Vite
- lucide-react

## Project structure

```text
src/
  apps/
  assets/
  components/
  styles/
  App.jsx

Let's all love lain!