import React, { useEffect, useState } from "react";
import Summary from "./Summary.jsx";
import Comparative from "./Comparative.jsx";
import Process from "./Process.jsx";
import AirQualityDetail from "./AirQualityDetail.jsx";
import { INITIATIVES, REGIONS } from "./data.js";

/* Routes live in the hash so browser Back and refresh both work:
   #summary                        initiative tiles
   #air-quality                    air pollution & speciation view (Delhi NCR)
   #air-quality/<state>            air pollution & speciation view for state
   #<initiative>                   process view at Delhi NCR level
   #<initiative>/<state>           process view for one state
   #<initiative>/comparative       one card per state */
function parseHash() {
  const raw = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
  const [screen, level] = raw.split("/");
  if (screen === "air-quality") {
    const valid = level === "All-Delhi NCR" || REGIONS.includes(level);
    return { screen: "air-quality", level: valid ? level : "All-Delhi NCR" };
  }
  const known = INITIATIVES.some((i) => i.key === screen);
  if (!known) return { screen: "summary", level: null };
  const valid = level === "comparative" || level === "All-Delhi NCR" || REGIONS.includes(level);
  return { screen, level: valid ? level : "All-Delhi NCR" };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (screen, level) => {
    window.location.hash = level ? `${screen}/${encodeURIComponent(level)}` : screen;
  };

  if (route.screen === "air-quality") {
    return <AirQualityDetail region={route.level || "All-Delhi NCR"} onNavigate={go} />;
  }

  const initiative = INITIATIVES.find((i) => i.key === route.screen);
  if (!initiative) return <Summary onNavigate={go} />;
  if (route.level === "comparative") return <Comparative initiative={initiative} onNavigate={go} />;
  return <Process initiative={initiative} region={route.level} onNavigate={go} />;
}
