import React, { useState } from "react";
import { REGIONS, l1Of, l2Of, rangeFactor, PRESETS, fmtDate } from "./data.js";

const C = {
  blue: "#1D3F86", blueDark: "#16306a", blueLine: "#C9D3E8", blueWash: "#F1F5FF",
  ink: "#232527", body: "#383A3C", mute: "#6B6D6F", faint: "#8A8C8E",
  line: "#E4E4E0", line2: "#EEEEEA", paper: "#F6F6F4", bar: "#F3F2EE"
};

export function Bar({ view, height = 9 }) {
  return (
    <div style={{ flex: 1, height, borderRadius: 3, overflow: "hidden", background: view.track }}>
      <div style={{ height: "100%", width: view.bar, background: view.flag }} />
    </div>
  );
}

export function InfoButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} title="Definition, formula, agency and data source"
      style={{ flex: "none", padding: "2px 7px", border: "1px solid #E0E0DA", background: "#fff", borderRadius: 4,
        fontFamily: "inherit", fontSize: 11, fontWeight: 700, color: C.blue, cursor: "pointer" }}>i</button>
  );
}

export function Dropdown({ label, icon, options, open, onToggle, width = 200, align = "right" }) {
  return (
    <div style={{ position: "relative", flex: "none" }}>
      <button type="button" onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", background: "#fff",
          border: `1px solid ${C.blueLine}`, borderRadius: 5, fontFamily: "inherit", fontSize: 13,
          fontWeight: 600, color: C.blue, cursor: "pointer", whiteSpace: "nowrap" }}>
        {icon}{label}<span style={{ opacity: 0.6, fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: 44, [align]: 0, minWidth: width, background: "#fff",
          border: "1px solid #E0E0DA", borderRadius: 6, boxShadow: "0 14px 36px rgba(0,0,0,.16)", overflow: "hidden", zIndex: 40 }}>
          {options.map((o) => (
            <button key={o.label} type="button" onClick={o.select}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", border: 0,
                fontFamily: "inherit", fontSize: 13, cursor: "pointer", color: C.ink,
                background: o.selected ? C.blueWash : "#fff", fontWeight: o.selected ? 700 : 400 }}>{o.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export const CalendarIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);

export const PinIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export function DateRange({ range, setRange, open, onToggle }) {
  const { days } = rangeFactor(range.from, range.to);
  return (
    <div style={{ position: "relative", flex: "none" }}>
      <button type="button" onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", background: "#fff",
          border: `1px solid ${C.blueLine}`, borderRadius: 5, fontFamily: "inherit", fontSize: 13,
          fontWeight: 600, color: C.blue, cursor: "pointer", whiteSpace: "nowrap" }}>
        {CalendarIcon}{fmtDate(range.from)} – {fmtDate(range.to)}<span style={{ opacity: 0.6, fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: 44, right: 0, width: 300, background: "#fff", border: "1px solid #E0E0DA",
          borderRadius: 6, boxShadow: "0 14px 36px rgba(0,0,0,.16)", padding: 14, zIndex: 40 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>CUSTOM RANGE</div>
          {[["From", "from", range.to], ["To", "to", null]].map(([lbl, field]) => (
            <div key={field} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
              <label style={{ fontSize: 12, color: C.mute, width: 34 }} htmlFor={`dr-${field}`}>{lbl}</label>
              <input id={`dr-${field}`} type="date" value={range[field]} min="2026-02-01" max="2026-08-11"
                onChange={(e) => {
                  const v = e.target.value; if (!v) return;
                  setRange(field === "from"
                    ? { from: v, to: v > range.to ? v : range.to }
                    : { to: v, from: v < range.from ? v : range.from });
                }}
                style={{ flex: 1, fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.ink,
                  border: "1px solid #E0E0DA", borderRadius: 4, padding: "6px 8px", outline: "none", cursor: "pointer" }} />
            </div>
          ))}
          <div style={{ height: 1, background: C.line2, margin: "13px 0 11px" }} />
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>QUICK RANGES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
            {PRESETS.map((p) => {
              const sel = p.from === range.from && p.to === range.to;
              return (
                <button key={p.label} type="button" onClick={() => setRange({ from: p.from, to: p.to })}
                  style={{ display: "flex", padding: "8px 11px", borderRadius: 5, fontFamily: "inherit", fontSize: 13,
                    fontWeight: 600, cursor: "pointer", textAlign: "left",
                    background: sel ? C.blue : "#fff", color: sel ? "#fff" : "#5A5C5E",
                    border: `1px solid ${sel ? C.blue : "#E0E0DA"}` }}>{p.label}</button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: C.faint, marginTop: 11 }}>{days} days of data</div>
        </div>
      )}
    </div>
  );
}

function DetailDrawer({ detail, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(35,37,39,.28)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(480px, 92%)", background: "#fff", height: "100%",
        display: "flex", flexDirection: "column", boxShadow: "-14px 0 40px rgba(0,0,0,.18)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 22px 16px", borderBottom: `1px solid ${C.line2}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>
              {detail.id.startsWith("L1") ? "LEVEL 1 METRIC" : `${detail.stageLabel.toUpperCase()} · L2 METRIC`}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.blue, marginTop: 5, lineHeight: 1.3, textWrap: "pretty" }}>{detail.name}</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 32, height: 32, border: "1px solid #E0E0DA", background: "#fff",
            color: "#5A5C5E", borderRadius: 5, fontSize: 14, cursor: "pointer", fontFamily: "inherit", flex: "none" }}>✕</button>
        </div>
        <div style={{ overflow: "auto", padding: "18px 22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", background: C.paper, borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Source Code Pro', monospace", lineHeight: 1, color: detail.flag }}>{detail.pct}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#5A5C5E", marginTop: 6 }}>{detail.status}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.body }}>{detail.fracLong}</div>
              <div style={{ marginTop: 8, display: "flex" }}><Bar view={detail} height={8} /></div>
            </div>
          </div>
          <Field label="DEFINITION" value={detail.formula} />
          <Field label="WHY IT IS TRACKED" value={detail.rationale} />
          <div style={{ height: 1, background: C.line2, margin: "16px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="AGENCY RESPONSIBLE" value={detail.agency} bare />
            <Field label="DATA SOURCE" value={detail.source} bare />
          </div>
          <div style={{ height: 1, background: C.line2, margin: "16px 0" }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: C.ink }}>WHERE IT SITS IN THE PROCESS</div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
              {(detail.context || []).map((label, i, a) => (
                <div key={label} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ padding: "8px 12px", borderRadius: 5, fontSize: 12.5, lineHeight: 1.3,
                    background: i === detail.active ? C.blue : "#F1F1EC", color: i === detail.active ? "#fff" : "#5A5C5E",
                    fontWeight: i === detail.active ? 700 : 400 }}>{label}</span>
                  {i < a.length - 1 && <span style={{ padding: "0 7px", color: "#B4B4AE" }}>→</span>}
                </div>
              ))}
            </div>
          </div>
          {detail.glossary && (
            <div style={{ marginTop: 18, padding: "12px 14px", background: C.paper, borderLeft: `4px solid ${C.blueLine}`, borderRadius: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: C.ink }}>TERMS</div>
              <div style={{ fontSize: 13, color: C.body, marginTop: 5, lineHeight: 1.5 }}>{detail.glossary}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, bare }) {
  return (
    <div style={{ marginTop: bare ? 0 : 20 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: C.ink }}>{label}</div>
      <div style={{ fontSize: 14, color: C.body, marginTop: 6, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

const GRID = "minmax(260px,3fr) 76px 138px minmax(70px,1fr) 34px";

/* Process popup: L1 cards, all-stages L2 list, metric detail drawer. */
export function ProcessModal({ initiative, region, regions, onRegion, range, setRange, onClose, title, subtitle }) {
  const [detailId, setDetailId] = useState(null);
  const [menu, setMenu] = useState(null);
  const rf = rangeFactor(range.from, range.to).factor;
  const l1 = l1Of(initiative, region, rf);
  const l2 = l2Of(initiative, region, rf);
  const detail = [...l1, ...l2].find((m) => m.id === detailId);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(35,37,39,.55)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 14, zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(1200px, 100%)", height: "97vh", background: "#fff",
        borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative",
        boxShadow: "0 24px 70px rgba(0,0,0,.35)" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 26px 10px", flex: "none" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: C.blue, letterSpacing: "-.01em", lineHeight: 1.25 }}>{title}</div>
            <div style={{ fontSize: 13, color: C.mute, marginTop: 2 }}>{subtitle}</div>
          </div>
          {regions && (
            <Dropdown label={region} icon={PinIcon} open={menu === "region"}
              onToggle={() => setMenu(menu === "region" ? null : "region")}
              options={["All-Delhi NCR", ...REGIONS].map((r) => ({
                label: r, selected: r === region, select: () => { onRegion(r); setMenu(null); setDetailId(null); }
              }))} />
          )}
          <DateRange range={range} setRange={(r) => setRange({ ...range, ...r })} open={menu === "range"}
            onToggle={() => setMenu(menu === "range" ? null : "range")} />
          <button type="button" onClick={onClose} style={{ width: 34, height: 34, border: "1px solid #E0E0DA", background: "#fff",
            color: "#5A5C5E", borderRadius: 5, fontSize: 15, cursor: "pointer", fontFamily: "inherit", flex: "none" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "0 26px 12px", flex: "none", overflowX: "auto" }}>
          {l1.map((k) => (
            <div key={k.id} style={{ flex: 1, minWidth: 270, border: `1px solid ${C.line}`, borderRadius: 6, padding: "11px 14px", background: "#FAFAF8" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".09em", color: C.faint, paddingTop: 2 }}>L1</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.3, flex: 1, textWrap: "pretty" }}>{k.name}</span>
                <InfoButton onClick={() => setDetailId(k.id)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 9 }}>
                <span style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Source Code Pro', monospace", color: k.flag }}>{k.pct}</span>
                <Bar view={k} height={8} />
                <span style={{ fontSize: 12, fontFamily: "'Source Code Pro', monospace", color: C.mute, whiteSpace: "nowrap" }}>{k.frac}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "end", gap: 14, padding: "12px 42px 7px", flex: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>L2 monitoring by process stage</span>
            <span style={{ fontSize: 12.5, color: C.faint }}>{region === "All-Delhi NCR" ? "All four states combined" : `${region} only`}</span>
          </div>
          {["VALUE", "COUNT", "PROGRESS"].map((h, i) => (
            <span key={h} style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".09em", color: C.faint, textAlign: i === 0 ? "right" : "left" }}>{h}</span>
          ))}
          <span />
        </div>

        <div style={{ overflow: "auto", padding: "0 26px 12px", flex: 1, minHeight: 0 }}>
          {l2.length ? (
            <div style={{ border: `1px solid ${C.line}`, borderRadius: 6, overflow: "hidden" }}>
              {l2.map((m) => (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center", gap: 14,
                  padding: "9px 15px", borderBottom: `1px solid ${C.line2}`, background: "#fff" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: C.faint, lineHeight: 1.15 }}>{m.stageLabel}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginTop: 2, textWrap: "pretty" }}>{m.name}</div>
                  </div>
                  <span style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Source Code Pro', monospace", textAlign: "right", color: m.flag }}>{m.pct}</span>
                  <span style={{ fontSize: 12.5, fontFamily: "'Source Code Pro', monospace", color: C.mute }}>{m.frac}</span>
                  <Bar view={m} height={8} />
                  <div style={{ justifySelf: "end" }}><InfoButton onClick={() => setDetailId(m.id)} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border: "1px dashed #DEDED8", borderRadius: 6, padding: 26, textAlign: "center", background: "#FAFAF8" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#5A5C5E" }}>No L2 metric is defined for this initiative</div>
              <div style={{ fontSize: 13, color: C.faint, marginTop: 5 }}>L2 process metrics are still being defined.</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 26px 10px", flexWrap: "wrap",
          rowGap: 4, borderTop: `1px solid ${C.line2}` }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: C.ink }}>STATUS</span>
          {[["#2E7D32", "On track, 75% and above"], ["#E0A800", "Watch, 50–74%"], ["#C0392B", "Delay, below 50%"]].map(([c, t]) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#5A5C5E" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />{t}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.faint }}>{initiative.footNote}</span>
        </div>

        {detail && <DetailDrawer detail={detail} onClose={() => setDetailId(null)} />}
      </div>
    </div>
  );
}

export { C };
