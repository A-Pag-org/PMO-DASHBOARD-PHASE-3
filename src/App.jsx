import React, { useState } from "react";
import Summary from "./Summary.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [screen, setScreen] = useState("summary");
  return screen === "summary"
    ? <Summary onNavigate={setScreen} />
    : <Dashboard initiativeKey={screen} onNavigate={setScreen} />;
}
