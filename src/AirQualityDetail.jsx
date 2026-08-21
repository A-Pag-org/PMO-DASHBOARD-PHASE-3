import React, { useState } from "react";
import { getAirData, AQI_CATEGORIES, CPCB_STANDARDS } from "./airData.js";
import { NAV, REGIONS } from "./data.js";
import { C, Dropdown, DateRange, DetailDrawer, InfoButton } from "./ui.jsx";
import AirQualityPill from "./AirQualityPill.jsx";

export default function AirQualityDetail({ region = "All-Delhi NCR", onNavigate }) {
  const [range, setRange] = useState({ from: "2026-02-01", to: "2026-08-11" });
  const [activeTab, setActiveTab] = useState("pm25");
  const [menu, setMenu] = useState(null);
  const [detail, setDetail] = useState(null);
  const [trendLayer, setTrendLayer] = useState({ showDaily: true, show7d: true, show30d: true, showPrevYear: true });

  const data = getAirData(region, range.from, range.to);

  const history = data.history;
  const chartW = 920;
  const chartH = 280;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;

  const maxVal = Math.max(...history.map((h) => Math.max(h.pm25, h.pm25PrevYear || 0, 100)), 140);
  const minVal = 0;

  const scaleX = (i) => padding.left + (i / Math.max(1, history.length - 1)) * innerW;
  const scaleY = (v) => padding.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const standard24Y = scaleY(60);
  const standardAnnY = scaleY(40);

  const path30 = history.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.rolling30).toFixed(1)}`).join(" ");
  const path7 = history.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.rolling7).toFixed(1)}`).join(" ");
  const pathPrev = history.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.pm25PrevYear).toFixed(1)}`).join(" ");

  const totalDays = Object.values(data.daysCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: "'Source Sans 3', system-ui, sans-serif", color: C.body }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#fff",
          borderBottom: `1px solid ${C.line}`,
          position: "sticky",
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src="/emblem.png" alt="Government of India" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.01em", color: C.blue, whiteSpace: "nowrap" }}>
            Delhi NCR Clean Air Dashboard
          </div>
        </div>
        
        {/* Strictly Centered Header Pill */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
          zIndex: 2
        }}>
          <AirQualityPill onNavigate={onNavigate} currentRegion={region} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            border: "1px solid #D8D8D2",
            borderRadius: 6,
            color: C.blue,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer"
          }}
        >
          Sign out
        </div>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          rowGap: 10,
          flexWrap: "wrap",
          padding: "14px 24px",
          background: "#fff",
          borderBottom: `1px solid ${C.line}`,
          position: "sticky",
          top: 63,
          zIndex: 30,
          boxShadow: "0 8px 16px -12px rgba(35,37,39,.45)"
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate("summary")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            background: "#fff",
            border: `1px solid ${C.blueLine}`,
            borderRadius: 5,
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color: C.blue,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          ‹ All initiatives — Summary
        </button>

        <div style={{ position: "relative", flex: "none" }}>
          <button
            type="button"
            onClick={() => setMenu(menu === "nav" ? null : "nav")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 16px",
              background: C.blue,
              color: "#fff",
              border: 0,
              borderRadius: 6,
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Air Pollution & Outcomes <span style={{ opacity: 0.7, fontSize: 10 }}>▾</span>
          </button>
          {menu === "nav" && (
            <div
              style={{
                position: "absolute",
                top: 44,
                left: 0,
                minWidth: 290,
                background: "#fff",
                border: "1px solid #D2D2CA",
                borderRadius: 6,
                boxShadow: "0 12px 32px rgba(0,0,0,.14)",
                overflow: "hidden",
                zIndex: 30
              }}
            >
              {NAV.map((n) => (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => {
                    setMenu(null);
                    if (n.key === "summary") onNavigate("summary");
                    else if (n.key === "air-quality") onNavigate("air-quality", region);
                    else onNavigate(n.key, region);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 15px",
                    border: 0,
                    fontFamily: "inherit",
                    fontSize: 13.5,
                    cursor: "pointer",
                    color: C.ink,
                    background: n.key === "air-quality" ? C.blueWash : "#fff",
                    fontWeight: n.key === "air-quality" ? 700 : 400
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Dropdown
          label={region}
          options={["All-Delhi NCR", ...REGIONS].map((r) => ({
            label: r,
            selected: r === region,
            select: () => {
              setMenu(null);
              onNavigate("air-quality", r);
            }
          }))}
          open={menu === "region"}
          onToggle={() => setMenu(menu === "region" ? null : "region")}
        />

        <div style={{ flex: 1 }} />

        <DateRange
          range={range}
          setRange={(r) => setRange({ ...range, ...r })}
          open={menu === "range"}
          onToggle={() => setMenu(menu === "range" ? null : "range")}
        />
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px 24px 60px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0, letterSpacing: "-.02em" }}>
                Air Pollution Level & Speciation Analysis
              </h1>
              <span style={{ padding: "4px 10px", background: "#DCFCE7", color: "#15803D", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                {region}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: C.mute, margin: "4px 0 0" }}>
              Comprehensive L1 PM2.5 multi-day trends, L2 chemical speciation, and criteria pollutant concentrations.
            </p>
          </div>

          <div style={{ display: "flex", background: "#E2E8F0", padding: 3, borderRadius: 6 }}>
            {[
              { id: "pm25", label: "L1: PM2.5 & AQI Trends" },
              { id: "sources", label: "L2a: Source Speciation" },
              { id: "pollutants", label: "L2b: Other Criteria Pollutants" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  border: 0,
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  color: activeTab === tab.id ? C.blue : "#475569",
                  background: activeTab === tab.id ? "#fff" : "transparent",
                  cursor: "pointer",
                  boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.1)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "pm25" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 18, boxShadow: "0 2px 6px rgba(0,0,0,.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".08em" }}>L1 PRIMARY METRIC</span>
                  <InfoButton onClick={() => setDetail({
                    id: "L1-PM25",
                    name: "PM2.5 Ambient Level & Structural Trend",
                    formula: "Mean PM2.5 concentration across continuous ambient air quality stations (CAAQMS)",
                    rationale: "PM2.5 is the primary hazardous inhalable particulate. Trends over 7 and 30 days provide robust indicators of structural air quality progress.",
                    agency: "CPCB / State PCBs / CAQM",
                    source: "National CAAQMS Network",
                    status: data.avgPm25 <= 60 ? "Within standard" : "Exceedance",
                    pct: `${data.avgPm25} µg/m³`,
                    fracLong: `Period average: ${data.avgPm25} µg/m³ vs CPCB 24h standard 60 µg/m³`
                  })} />
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace", marginTop: 8 }}>
                  {data.avgPm25} <span style={{ fontSize: 14, fontWeight: 600, color: C.mute }}>µg/m³</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#15803D", fontWeight: 700, marginTop: 4 }}>
                  ↓ {Math.abs(data.pm25YoYChange)}% YoY Reduction
                </div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>
                  24-hr CPCB Standard: 60 µg/m³
                </div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 18, boxShadow: "0 2px 6px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".08em" }}>30-DAY SMOOTHED TREND</span>
                <div style={{ fontSize: 34, fontWeight: 800, color: C.blue, fontFamily: "'Source Code Pro', monospace", marginTop: 8 }}>
                  {data.rolling30Latest} <span style={{ fontSize: 14, fontWeight: 600, color: C.mute }}>µg/m³</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.body, fontWeight: 600, marginTop: 4 }}>
                  Structural Trajectory
                </div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>
                  Removes daily weather & wind noise
                </div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 18, boxShadow: "0 2px 6px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".08em" }}>CLEAN / MODERATE DAYS</span>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#166534", fontFamily: "'Source Code Pro', monospace", marginTop: 8 }}>
                  {data.goodOrModeratePct}%
                </div>
                <div style={{ fontSize: 12.5, color: C.body, fontWeight: 600, marginTop: 4 }}>
                  {data.daysCount.good + data.daysCount.satisfactory + data.daysCount.moderate} of {totalDays} recorded days
                </div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>
                  AQI ≤ 200 (Good, Satisfactory, Moderate)
                </div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 18, boxShadow: "0 2px 6px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".08em" }}>PEAK AQI IN PERIOD</span>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#DC2626", fontFamily: "'Source Code Pro', monospace", marginTop: 8 }}>
                  {data.peakAqi}
                </div>
                <div style={{ fontSize: 12.5, color: "#DC2626", fontWeight: 700, marginTop: 4 }}>
                  Recorded on {data.peakAqiDate}
                </div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>
                  Category: Very Poor / Severe spike
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
                    PM2.5 Trend Evolution & Baseline Trajectory
                  </h3>
                  <div style={{ fontSize: 12.5, color: C.mute, marginTop: 2 }}>
                    Structural improvement vs single-day meteorological events
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={trendLayer.showDaily}
                      onChange={(e) => setTrendLayer({ ...trendLayer, showDaily: e.target.checked })}
                    />
                    <span style={{ color: "#64748B" }}>Daily Points</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={trendLayer.show7d}
                      onChange={(e) => setTrendLayer({ ...trendLayer, show7d: e.target.checked })}
                    />
                    <span style={{ color: "#0284C7", fontWeight: 700 }}>7-Day MA</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={trendLayer.show30d}
                      onChange={(e) => setTrendLayer({ ...trendLayer, show30d: e.target.checked })}
                    />
                    <span style={{ color: C.blue, fontWeight: 700 }}>30-Day Trend (Focus)</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={trendLayer.showPrevYear}
                      onChange={(e) => setTrendLayer({ ...trendLayer, showPrevYear: e.target.checked })}
                    />
                    <span style={{ color: "#94A3B8" }}>Previous Year</span>
                  </label>
                </div>
              </div>

              <div style={{ width: "100%", overflowX: "auto" }}>
                <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} style={{ minWidth: 680 }}>
                  {[0, 30, 60, 90, 120].map((val) => {
                    const y = scaleY(val);
                    return (
                      <g key={val}>
                        <line x1={padding.left} y1={y} x2={chartW - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                        <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94A3B8" fontFamily="'Source Code Pro', monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  <line x1={padding.left} y1={standard24Y} x2={chartW - padding.right} y2={standard24Y} stroke="#E11D48" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x={chartW - padding.right} y={standard24Y - 6} textAnchor="end" fontSize="10.5" fill="#E11D48" fontWeight="700">
                    24h Standard: 60 µg/m³
                  </text>

                  <line x1={padding.left} y1={standardAnnY} x2={chartW - padding.right} y2={standardAnnY} stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={chartW - padding.right} y={standardAnnY - 5} textAnchor="end" fontSize="10.5" fill="#059669" fontWeight="700">
                    Annual Target: 40 µg/m³
                  </text>

                  {trendLayer.showPrevYear && (
                    <path d={pathPrev} fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                  )}

                  {trendLayer.showDaily &&
                    history.map((d, i) => (
                      <circle key={i} cx={scaleX(i)} cy={scaleY(d.pm25)} r="2.5" fill="#94A3B8" opacity="0.4" />
                    ))}

                  {trendLayer.show7d && (
                    <path d={path7} fill="none" stroke="#0284C7" strokeWidth="1.8" opacity="0.75" />
                  )}

                  {trendLayer.show30d && (
                    <path d={path30} fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {history
                    .filter((_, i) => i % Math.ceil(history.length / 7) === 0)
                    .map((d, i) => {
                      const idx = history.findIndex((h) => h.date === d.date);
                      return (
                        <text key={d.date} x={scaleX(idx)} y={chartH - 12} textAnchor="middle" fontSize="11" fill="#64748B">
                          {d.label}
                        </text>
                      );
                    })}
                </svg>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, fontSize: 12, marginTop: 12, borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 3, background: C.blue, borderRadius: 2 }} />
                  <strong>30-Day Smoothed Trajectory</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 2, background: "#0284C7", borderRadius: 2 }} />
                  7-Day Moving Average
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 2, borderTop: "2px dashed #CBD5E1" }} />
                  2025 Corresponding Baseline
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 2, borderTop: "2px dashed #E11D48" }} />
                  CPCB 24h Safe Limit
                </span>
              </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
                  AQI Category Distribution Analysis
                </h3>
                <span style={{ fontSize: 13, color: C.mute }}>
                  Breakdown across {totalDays} monitoring days in selected date range
                </span>
              </div>

              <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 18, background: "#E2E8F0" }}>
                {AQI_CATEGORIES.map((cat) => {
                  const count = data.daysCount[cat.key] || 0;
                  const pct = ((count / totalDays) * 100).toFixed(1);
                  if (count === 0) return null;
                  return (
                    <div
                      key={cat.key}
                      style={{ width: `${pct}%`, background: cat.color, transition: "width 0.3s ease" }}
                      title={`${cat.label}: ${count} days (${pct}%)`}
                    />
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                {AQI_CATEGORIES.map((cat) => {
                  const count = data.daysCount[cat.key] || 0;
                  const pct = Math.round((count / totalDays) * 100);
                  return (
                    <div
                      key={cat.key}
                      style={{
                        background: cat.bg,
                        border: `1.5px solid ${cat.borderColor}`,
                        borderRadius: 6,
                        padding: "12px 10px",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: cat.dark }}>{cat.label}</div>
                      <div style={{ fontSize: 10, color: cat.dark, opacity: 0.8, marginTop: 1 }}>AQI {cat.range}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: cat.dark, fontFamily: "'Source Code Pro', monospace", marginTop: 6 }}>
                        {count} <span style={{ fontSize: 11, fontWeight: 600 }}>days</span>
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: cat.dark, marginTop: 2 }}>{pct}% share</div>
                    </div>
                  );
                })}
              </div>

              {/* Color Scale Guide (Indian Standards) */}
              <div style={{ marginTop: 18, padding: "14px 18px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".06em", color: C.ink }}>
                    AQI & PM2.5 CATEGORY RANGES (CPCB / NAAQS)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
                  {AQI_CATEGORIES.map((cat) => (
                    <div
                      key={cat.key}
                      style={{
                        background: "#FFFFFF",
                        border: `1.5px solid ${cat.borderColor}`,
                        borderRadius: 6,
                        padding: "10px 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 4,
                        boxShadow: `0 1px 3px ${cat.borderColor}15`
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: cat.dark }}>{cat.label}</span>
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: cat.dark, background: cat.bg, padding: "2px 7px", borderRadius: 4 }}>
                        AQI {cat.range}
                      </div>
                      <div style={{ fontSize: 11, color: C.mute, fontWeight: 600 }}>
                        PM2.5: <strong style={{ color: C.ink }}>{cat.pm25Range}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
                    Relative Contribution by Emission Source
                  </h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, background: C.blueWash, padding: "3px 8px", borderRadius: 4 }}>
                    Chemical Speciation Model
                  </span>
                </div>

                <p style={{ fontSize: 13, color: C.mute, marginTop: 0, marginBottom: 16 }}>
                  Source apportionment derived from receptor modeling and continuous chemical analysis of PM2.5 filter samples.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {data.sources.map((s) => (
                    <div key={s.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{s.name}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace" }}>
                          {s.share}%
                        </span>
                      </div>
                      <div style={{ height: 9, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${s.share}%`, height: "100%", background: s.color, borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>{s.speciation}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 8, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
                    Chemical Speciation Markers
                  </h3>
                  <InfoButton onClick={() => setDetail({
                    id: "L2-SPECIATION",
                    name: "PM2.5 Chemical Speciation Profile",
                    formula: "Gravimetric and chemical ion chromatography, thermo-optical carbon analysis (TOR/TOT), and XRF spectrometry of particulate matter.",
                    rationale: "Speciation identifies specific molecular components (EC, OC, SO4, NO3, NH4, crustal minerals) to distinguish vehicle exhaust from crop burning, power plant emissions, and road dust.",
                    agency: "CPCB / CAQM / Academic Research Consortium",
                    source: "Continuous Speciation CAAQMS",
                    status: "Active Monitoring",
                    pct: "7 Key Markers",
                    fracLong: "Real-time ion chromatography & carbon analyzer feed"
                  })} />
                </div>

                <div style={{ overflow: "hidden", border: "1px solid #E2E8F0", borderRadius: 6 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                        <th style={{ padding: "10px 12px", color: C.ink, fontWeight: 700 }}>Marker Compound</th>
                        <th style={{ padding: "10px 12px", color: C.ink, fontWeight: 700, width: 70, textAlign: "right" }}>Share</th>
                        <th style={{ padding: "10px 12px", color: C.ink, fontWeight: 700 }}>Primary Source Association</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.speciationMarkers.map((m, idx) => (
                        <tr key={m.compound} style={{ borderBottom: idx < data.speciationMarkers.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: C.ink }}>{m.compound}</td>
                          <td style={{ padding: "9px 12px", fontWeight: 800, textAlign: "right", fontFamily: "'Source Code Pro', monospace", color: C.blue }}>
                            {m.share}%
                          </td>
                          <td style={{ padding: "9px 12px", color: C.body, fontSize: 12 }}>{m.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 16, padding: "12px 14px", background: C.paper, borderRadius: 6, borderLeft: `3px solid ${C.blue}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Policy & Intervention Link:</div>
                  <div style={{ fontSize: 12, color: C.mute, marginTop: 3, lineHeight: 1.4 }}>
                    Elevated <strong>Organic/Elemental Carbon</strong> guides vehicle scrappage (PARIVARTAN). Elevated <strong>Crustal Matter</strong> correlates with MRS deployment and road repair.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pollutants" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {data.pollutants.map((p) => {
                const std = CPCB_STANDARDS[p.key] || { limit24h: p.limit, unit: p.unit };
                const pctOfLimit = Math.round((p.val / p.limit) * 100);
                const isCompliant = p.val <= p.limit;
                const statusBg = isCompliant ? "#DCFCE7" : "#FEE2E2";
                const statusColor = isCompliant ? "#15803D" : "#DC2626";

                return (
                  <div
                    key={p.key}
                    style={{
                      background: "#fff",
                      border: `1px solid ${isCompliant ? C.line2 : "#FCA5A5"}`,
                      borderRadius: 8,
                      padding: 18,
                      boxShadow: "0 2px 6px rgba(0,0,0,.04)",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.faint }}>{std.name || p.name}</div>
                      </div>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          background: statusBg,
                          color: statusColor
                        }}
                      >
                        {isCompliant ? "Compliant" : "Exceeds"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 14 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace" }}>
                        {p.val}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.mute }}>{p.unit}</span>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.mute, marginBottom: 4 }}>
                        <span>Standard Limit: {p.limit} {p.unit}</span>
                        <span style={{ fontWeight: 700, color: statusColor }}>{pctOfLimit}% of Limit</span>
                      </div>
                      <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${Math.min(100, pctOfLimit)}%`,
                            height: "100%",
                            background: isCompliant ? "#107C41" : "#DC2626"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5 }}>
                      <span style={{ color: C.faint }}>{p.status}</span>
                      <InfoButton onClick={() => setDetail({
                        id: `L2-${p.key.toUpperCase()}`,
                        name: `${p.name} (${std.name || p.name})`,
                        formula: `Concentration measured in ambient air over 24-hr / 8-hr moving standard. NAAQS Standard: ${p.limit} ${p.unit}.`,
                        rationale: `Monitored under National Ambient Air Quality Standards (NAAQS) for public health protection and specific source tracking.`,
                        agency: "CPCB / CAQM / State SPCB",
                        source: "CAAQMS Automated Sensors",
                        status: p.status,
                        pct: `${p.val} ${p.unit}`,
                        fracLong: `Current: ${p.val} ${p.unit} | NAAQS limit: ${p.limit} ${p.unit}`
                      })} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {detail && <DetailDrawer detail={detail} onClose={() => setDetail(null)} fixed />}
    </div>
  );
}
