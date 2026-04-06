import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Desktop from "./components/Desktop";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <Desktop onLogout={() => setLoggedIn(false)} />
  ) : (
    <LoginScreen onLogin={() => setLoggedIn(true)} />
  );
}