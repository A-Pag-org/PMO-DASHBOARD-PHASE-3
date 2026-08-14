import React, { useState } from "react";
import { REGIONS, flag, l1Of, l2Of, rangeFactor } from "./data.js";
import { C, Bar, InfoButton, DateRange } from "./ui.jsx";

/* Comparative level: one card per state for a single initiative, each opening
   that state's process view. Reached from the process page's state selector. */
export default function Comparative({ initiative, onNavigate }) {
  const [range, setRange] = useState({ from: "2026-02-01", to: "2026-08-11" });
  const [menu, setMenu] = useState(null);
  const rf = rangeFactor(range.from, range.to).factor;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: "'Source Sans 3', system-ui, sans-serif", color: C.body }}>
      <header style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 24px", background: "#fff",
        borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, zIndex: 40 }}>
        <img src="/emblem.png" alt="Government of India" style={{ width: 38, height: 38, objectFit: "contain" }} />
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.01em", color: C.blue }}>Delhi NCR Clean Air Dashboard</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "1px solid #D8D8D2",
          borderRadius: 6, color: C.blue, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Sign out</div>
      </header>

      <div style={{ display: "flex", alignItems: "center", gap: 14, rowGap: 10, flexWrap: "wrap", padding: "18px 24px 12px",
        background: "#fff", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 63, zIndex: 30,
        boxShadow: "0 8px 16px -12px rgba(35,37,39,.45)" }}>
        <button type="button" onClick={() => onNavigate("summary")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "#fff",
            border: `1px solid ${C.blueLine}`, borderRadius: 5, fontFamily: "inherit", fontSize: 13,
            fontWeight: 600, color: C.blue, cursor: "pointer", whiteSpace: "nowrap" }}>‹ All initiatives</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: C.blue, color: "#fff",
          borderRadius: 5, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>{initiative.name}</div>
        <span style={{ fontSize: 14, color: C.mute, whiteSpace: "nowrap" }}>{initiative.owner}</span>
        <div style={{ flex: 1 }} />
        <DateRange range={range} setRange={(r) => setRange({ ...range, ...r })} open={menu === "range"}
          onToggle={() => setMenu(menu === "range" ? null : "range")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18, padding: "22px 24px 44px" }}>
        {REGIONS.map((r) => {
          const ks = l1Of(initiative, r, rf, null, true);
          const bands = l2Of(initiative, r, rf, null, true).filter((x) => !x.rate && x.den > 0).map((x) => x.raw);
          const delays = bands.filter((p) => p < 50).length;
          const watch = bands.filter((p) => p >= 50 && p < 75).length;
          return (
            <article key={r} data-card style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 6, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.line2}` }}>
                <span style={{ padding: "6px 14px", background: C.blue, color: "#fff", borderRadius: 5, fontSize: 14, fontWeight: 700 }}>{r}</span>
              </div>
              {ks.map((k) => (
                <div key={k.id} style={{ padding: "15px 16px", borderBottom: `1px solid ${C.line2}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontSize: 13, color: "#5A5C5E", lineHeight: 1.35, flex: 1, textWrap: "pretty" }}>{k.name}</div>
                    <InfoButton onClick={() => onNavigate(initiative.key, r)} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 5 }}>{k.frac}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <Bar view={k} />
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Source Code Pro', monospace", color: "#5A5C5E" }}>{k.pct}</span>
                  </div>
                </div>
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ padding: "14px 16px" }}>
                <button type="button" onClick={() => onNavigate(initiative.key, r)}
                  style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "10px 12px", background: "#fff",
                    border: `1px solid ${C.blueLine}`, borderRadius: 5, fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    color: C.blue, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", flex: "none",
                    background: bands.length ? flag(Math.min(...bands)) : "#C4C4BE" }} />
                  <span>Process</span>
                  <span style={{ fontSize: 12, color: C.mute, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    · {!bands.length ? "no L2 metric yet" : delays ? `${delays} delayed` : watch ? `${watch} to watch` : "all on track"}
                  </span>
                  <div style={{ flex: 1 }} />
                  <span>›</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
