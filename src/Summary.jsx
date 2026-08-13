import React, { useState } from "react";
import { INITIATIVES, MINISTRIES, NAV, flag, l1Of, l2Of, rangeFactor } from "./data.js";
import { C, Bar, InfoButton, Dropdown, DateRange, ProcessModal } from "./ui.jsx";

/* Consolidated Delhi NCR summary: one card per initiative, grouped by ministry.
   Process opens the L1 + all-stages L2 popup with a state selector. */
export default function Summary({ initiativeKey, onNavigate }) {
  const [range, setRange] = useState({ from: "2026-02-01", to: "2026-08-11" });
  const [menu, setMenu] = useState(null);
  const [openKey, setOpenKey] = useState(initiativeKey || null);
  const [region, setRegion] = useState("All-Delhi NCR");

  const rf = rangeFactor(range.from, range.to).factor;
  const open = INITIATIVES.find((i) => i.key === openKey);

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: "'Source Sans 3', system-ui, sans-serif", color: C.body }}>
      <header style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 24px", background: "#fff", borderBottom: `1px solid ${C.line}` }}>
        <img src="/emblem.png" alt="Government of India" style={{ width: 38, height: 38, objectFit: "contain" }} />
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.01em", color: C.blue }}>Delhi NCR Clean Air Dashboard</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "1px solid #D8D8D2",
          borderRadius: 6, color: C.blue, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Sign out</div>
      </header>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", background: C.bar,
        borderBottom: `1px solid ${C.line}`, position: "relative", zIndex: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: C.mute }}>INITIATIVE</span>
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => setMenu(menu === "ini" ? null : "ini")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: C.blue, color: "#fff",
              border: 0, borderRadius: 6, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            All initiatives — Summary <span style={{ opacity: 0.7, fontSize: 10 }}>▾</span>
          </button>
          {menu === "ini" && (
            <div style={{ position: "absolute", top: 44, left: 0, minWidth: 290, background: "#fff", border: "1px solid #E0E0DA",
              borderRadius: 6, boxShadow: "0 12px 32px rgba(0,0,0,.14)", overflow: "hidden", zIndex: 30 }}>
              {NAV.map((n) => (
                <button key={n.key} type="button"
                  onClick={() => { setMenu(null); if (n.key !== "summary") onNavigate(n.key); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 15px", border: 0,
                    fontFamily: "inherit", fontSize: 13.5, cursor: "pointer", color: C.ink,
                    background: n.key === "summary" ? C.blueWash : "#fff", fontWeight: n.key === "summary" ? 700 : 400 }}>
                  {n.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: C.mute }}>REGION</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: C.blue, color: "#fff",
          borderRadius: 6, fontWeight: 700, fontSize: 13 }}>All-Delhi NCR</div>
        <span style={{ fontSize: 14, color: C.mute }}>Consolidated L1 status across all {INITIATIVES.length} initiatives</span>
        <div style={{ flex: 1 }} />
        <DateRange range={range} setRange={(r) => setRange({ ...range, ...r })} open={menu === "range"}
          onToggle={() => setMenu(menu === "range" ? null : "range")} />
      </div>

      <div style={{ padding: "22px 24px 44px", display: "flex", flexDirection: "column", gap: 26 }}>
        {MINISTRIES.map((m) => (
          <section key={m.key}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 11 }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: C.ink }}>{m.key}</span>
              <span style={{ fontSize: 12.5, color: C.faint }}>{m.full}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 18 }}>
              {INITIATIVES.filter((i) => i.ministry === m.key).map((i) => {
                const ks = l1Of(i, "All-Delhi NCR", rf);
                const bands = l2Of(i, "All-Delhi NCR", rf).filter((x) => !x.rate && x.den > 0).map((x) => x.raw);
                const delays = bands.filter((p) => p < 50).length;
                const watch = bands.filter((p) => p >= 50 && p < 75).length;
                return (
                  <article key={i.key} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 6, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.line2}` }}>
                      <span style={{ padding: "6px 14px", background: C.blue, color: "#fff", borderRadius: 5, fontSize: 14, fontWeight: 700 }}>{i.name}</span>
                      {i.note && (
                        <span style={{ padding: "4px 10px", border: "1px solid #E0E0DA", background: C.paper, borderRadius: 4,
                          fontSize: 11.5, fontWeight: 700, color: C.mute }}>{i.note}</span>
                      )}
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: C.faint }}>{i.owner}</span>
                    </div>
                    {ks.map((k) => (
                      <div key={k.id} style={{ padding: "15px 16px", borderBottom: `1px solid ${C.line2}` }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ fontSize: 13, color: "#5A5C5E", lineHeight: 1.35, flex: 1, textWrap: "pretty" }}>{k.name}</div>
                          <InfoButton onClick={() => { setRegion("All-Delhi NCR"); setOpenKey(i.key); }} />
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
                      <button type="button" onClick={() => { setRegion("All-Delhi NCR"); setOpenKey(i.key); }}
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
          </section>
        ))}
      </div>

      {open && (
        <ProcessModal
          initiative={open} region={region} regions onRegion={setRegion}
          range={range} setRange={setRange} onClose={() => setOpenKey(null)}
          title={`${region === "All-Delhi NCR" ? "Delhi NCR" : region} — ${open.name} Process Monitoring`}
          subtitle={region === "All-Delhi NCR" ? "Consolidated across Delhi, UP, Rajasthan and Haryana" : `${region} share of the Delhi NCR programme`}
        />
      )}
    </div>
  );
}
