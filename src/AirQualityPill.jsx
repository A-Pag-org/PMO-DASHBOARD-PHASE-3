import React, { useState } from "react";
import { createPortal } from "react-dom";
import { getAirData, AQI_CATEGORIES, CPCB_STANDARDS } from "./airData.js";
import { REGIONS, PRESETS } from "./data.js";
import { C } from "./ui.jsx";

export default function AirQualityPill({ onNavigate, currentRegion = "All-Delhi NCR" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[3]); // Since launch default
  const [trendLayer, setTrendLayer] = useState({
    showDaily: true,
    show7d: true,
    show30d: true,
    showPrevYear: true,
    showStandard: true
  });
  const [hoveredPill, setHoveredPill] = useState(false);

  // Live and trend data for the pill (last 30 days)
  const pillData = getAirData(selectedRegion, selectedPreset.from, selectedPreset.to);
  const sparkPoints = pillData.history.slice(-30);
  const sparkMax = Math.max(...sparkPoints.map((p) => Math.max(p.pm25, p.rolling30, 70)), 110);
  const sparkMin = Math.min(...sparkPoints.map((p) => Math.min(p.pm25, p.rolling30, 30)), 20);

  const sparkW = 90;
  const sparkH = 26;
  const getSparkY = (v) => sparkH - ((v - sparkMin) / (sparkMax - sparkMin || 1)) * (sparkH - 6) - 3;
  const getSparkX = (idx) => (idx / Math.max(1, sparkPoints.length - 1)) * sparkW;

  const sparkPath = sparkPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getSparkX(i).toFixed(1)} ${getSparkY(p.rolling30).toFixed(1)}`)
    .join(" ");

  // Modal Chart Math
  const modalHistory = pillData.history;
  const chartW = 860;
  const chartH = 260;
  const pad = { top: 20, right: 25, bottom: 35, left: 45 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = chartH - pad.top - pad.bottom;

  const maxVal = Math.max(...modalHistory.map((h) => Math.max(h.pm25, h.pm25PrevYear || 0, 90)), 130);
  const minVal = 0;

  const scaleX = (i) => pad.left + (i / Math.max(1, modalHistory.length - 1)) * innerW;
  const scaleY = (v) => pad.top + innerH - ((v - minVal) / (maxVal - minVal || 1)) * innerH;

  const standard24Y = scaleY(60);
  const standardAnnY = scaleY(40);

  const path30 = modalHistory.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.rolling30).toFixed(1)}`).join(" ");
  const path7 = modalHistory.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.rolling7).toFixed(1)}`).join(" ");
  const pathPrev = modalHistory.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(d.pm25PrevYear).toFixed(1)}`).join(" ");

  const totalDays = modalHistory.length || 1;

  return (
    <>
      {/* Live Capsule Pill in Header */}
      {(() => {
        const cat = pillData.liveCategory;
        const catBorder = cat.borderColor || cat.color || "#16A34A";

        return (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setModalOpen(true)}
            onMouseEnter={() => setHoveredPill(true)}
            onMouseLeave={() => setHoveredPill(false)}
            style={{
              display: "flex",
              alignItems: "center",
              background: hoveredPill ? `${cat.bg}` : "#FFFFFF",
              border: `1.5px solid ${catBorder}`,
              borderRadius: 30,
              padding: "4px 14px 4px 12px",
              gap: 12,
              cursor: "pointer",
              boxShadow: hoveredPill
                ? `0 6px 18px ${catBorder}40, 0 0 0 1px ${catBorder}`
                : `0 2px 6px ${catBorder}25`,
              transition: "all 0.2s ease",
              userSelect: "none"
            }}
            title={`Current AQI: ${pillData.liveAqi} (${cat.label}) · Click for interactive trendline & filters`}
          >
            {/* Left Side: Live PM 2.5 & AQI */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Live Pulsing Dot */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: catBorder,
                    boxShadow: `0 0 0 2px ${cat.bg}`,
                    display: "inline-block"
                  }}
                />
                <span style={{ fontSize: 9.5, fontWeight: 800, color: catBorder, letterSpacing: ".06em" }}>LIVE</span>
              </div>

              {/* PM2.5 Metric */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.mute }}>PM2.5:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace" }}>
                  {pillData.livePm25}
                </span>
                <span style={{ fontSize: 10, color: C.faint }}>µg</span>
              </div>

              {/* AQI Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: cat.bg,
                  border: `1px solid ${catBorder}40`
                }}
              >
                <span style={{ fontSize: 10.5, fontWeight: 800, color: cat.dark }}>
                  AQI {pillData.liveAqi}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: cat.dark, opacity: 0.9 }}>
                  · {cat.label}
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div style={{ width: 1, height: 22, background: `${catBorder}35` }} />

            {/* Right Side: Mini Past Trendline Sparkline */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.mute }}>30d Trend</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "#16A34A" }}>
                    ↓ {Math.abs(pillData.pm25YoYChange)}%
                  </span>
                </div>
                <svg width={sparkW} height={sparkH} style={{ overflow: "visible" }}>
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke={catBorder}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Expand Icon */}
              <span style={{ fontSize: 12, fontWeight: 800, color: catBorder, marginLeft: 2 }}>↗</span>
            </div>
          </div>
        );
      })()}

      {/* Expanded Modal Dialog with Bigger Trendline & Filters (Portaled to document.body) */}
      {modalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 960,
              maxHeight: "90vh",
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: `1px solid ${C.line2}`
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: `1px solid ${C.line2}`,
                background: "#FAFAFA"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    padding: "4px 10px",
                    background: C.blue,
                    color: "#fff",
                    borderRadius: 5,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: ".04em"
                  }}
                >
                  PM2.5 & AQI TRENDLINE
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>
                  Ambient Air Quality Historical Trajectory
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "none",
                    border: 0,
                    fontSize: 20,
                    color: C.mute,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body & Interactive Filters */}
            <div style={{ padding: "18px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* Filter Controls Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#F8FAFC",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0"
                }}
              >
                {/* Region Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".06em" }}>REGION:</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["All-Delhi NCR", ...REGIONS].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRegion(r)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: selectedRegion === r ? 800 : 600,
                          background: selectedRegion === r ? C.blue : "#fff",
                          color: selectedRegion === r ? "#fff" : C.body,
                          border: `1px solid ${selectedRegion === r ? C.blue : "#CBD5E1"}`,
                          cursor: "pointer"
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Presets */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: ".06em" }}>RANGE:</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setSelectedPreset(p)}
                        style={{
                          padding: "5px 9px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: selectedPreset.label === p.label ? 800 : 600,
                          background: selectedPreset.label === p.label ? "#0F172A" : "#fff",
                          color: selectedPreset.label === p.label ? "#fff" : C.body,
                          border: `1px solid ${selectedPreset.label === p.label ? "#0F172A" : "#CBD5E1"}`,
                          cursor: "pointer"
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics Overview Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.faint }}>PERIOD AVERAGE PM2.5</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace", marginTop: 4 }}>
                    {pillData.avgPm25} <span style={{ fontSize: 12, color: C.mute }}>µg/m³</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, marginTop: 2 }}>
                    ↓ {Math.abs(pillData.pm25YoYChange)}% YoY Reduction
                  </div>
                </div>

                <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.faint }}>30-DAY SMOOTHED TREND</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.blue, fontFamily: "'Source Code Pro', monospace", marginTop: 4 }}>
                    {pillData.rolling30Latest} <span style={{ fontSize: 12, color: C.mute }}>µg/m³</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>Structural trajectory</div>
                </div>

                <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.faint }}>GOOD TO MODERATE DAYS</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#166534", fontFamily: "'Source Code Pro', monospace", marginTop: 4 }}>
                    {pillData.goodOrModeratePct}%
                  </div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                    {pillData.daysCount.good + pillData.daysCount.satisfactory + pillData.daysCount.moderate} of {totalDays} days
                  </div>
                </div>

                <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.faint }}>PEAK AQI RECORDED</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#DC2626", fontFamily: "'Source Code Pro', monospace", marginTop: 4 }}>
                    {pillData.peakAqi}
                  </div>
                  <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 700, marginTop: 2 }}>
                    on {pillData.peakAqiDate}
                  </div>
                </div>
              </div>

              {/* Multi-Layer SVG Trend Chart */}
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>
                    PM2.5 Trajectory Evolution ({selectedRegion})
                  </span>
                  
                  {/* Layer Checkboxes */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={trendLayer.showDaily}
                        onChange={(e) => setTrendLayer({ ...trendLayer, showDaily: e.target.checked })}
                      />
                      <span style={{ color: "#64748B" }}>Daily Points</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={trendLayer.show7d}
                        onChange={(e) => setTrendLayer({ ...trendLayer, show7d: e.target.checked })}
                      />
                      <span style={{ color: "#0284C7", fontWeight: 700 }}>7-Day MA</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={trendLayer.show30d}
                        onChange={(e) => setTrendLayer({ ...trendLayer, show30d: e.target.checked })}
                      />
                      <span style={{ color: C.blue, fontWeight: 700 }}>30-Day Trend (Focus)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={trendLayer.showPrevYear}
                        onChange={(e) => setTrendLayer({ ...trendLayer, showPrevYear: e.target.checked })}
                      />
                      <span style={{ color: "#94A3B8" }}>2025 Baseline</span>
                    </label>
                  </div>
                </div>

                <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} style={{ overflow: "visible" }}>
                  {/* Y Axis Grid Lines */}
                  {[0, 30, 60, 90, 120].map((val) => {
                    const y = scaleY(val);
                    return (
                      <g key={val}>
                        <line x1={pad.left} y1={y} x2={chartW - pad.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                        <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="10.5" fill="#94A3B8" fontFamily="'Source Code Pro', monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Standard Benchmark Lines */}
                  <line x1={pad.left} y1={standard24Y} x2={chartW - pad.right} y2={standard24Y} stroke="#E11D48" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x={chartW - pad.right} y={standard24Y - 5} textAnchor="end" fontSize="10" fill="#E11D48" fontWeight="700">
                    24h Limit (60)
                  </text>

                  <line x1={pad.left} y1={standardAnnY} x2={chartW - pad.right} y2={standardAnnY} stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={chartW - pad.right} y={standardAnnY - 4} textAnchor="end" fontSize="10" fill="#059669" fontWeight="700">
                    Annual Target (40)
                  </text>

                  {/* Previous Year Baseline */}
                  {trendLayer.showPrevYear && (
                    <path d={pathPrev} fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
                  )}

                  {/* Daily Points */}
                  {trendLayer.showDaily &&
                    modalHistory.map((d, i) => (
                      <circle key={i} cx={scaleX(i)} cy={scaleY(d.pm25)} r="2.5" fill="#94A3B8" opacity="0.45" />
                    ))}

                  {/* 7-Day Moving Avg */}
                  {trendLayer.show7d && (
                    <path d={path7} fill="none" stroke="#0284C7" strokeWidth="1.8" opacity="0.75" />
                  )}

                  {/* 30-Day Moving Avg */}
                  {trendLayer.show30d && (
                    <path d={path30} fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {/* X Axis Labels */}
                  {modalHistory
                    .filter((_, i) => i % Math.ceil(modalHistory.length / 8) === 0)
                    .map((d, i) => {
                      const idx = modalHistory.findIndex((h) => h.date === d.date);
                      return (
                        <text key={d.date} x={scaleX(idx)} y={chartH - 10} textAnchor="middle" fontSize="10.5" fill="#64748B">
                          {d.label}
                        </text>
                      );
                    })}
                </svg>
              </div>

              {/* AQI Category Breakdown Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.mute, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: C.ink }}>AQI Category Day Breakdown ({totalDays} days in range)</span>
                  <span style={{ fontWeight: 700, color: "#166534" }}>{pillData.goodOrModeratePct}% Good / Moderate</span>
                </div>
                <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "#E2E8F0" }}>
                  {AQI_CATEGORIES.map((cat) => {
                    const count = pillData.daysCount[cat.key] || 0;
                    const pct = ((count / totalDays) * 100).toFixed(1);
                    if (count === 0) return null;
                    return (
                      <div
                        key={cat.key}
                        style={{ width: `${pct}%`, background: cat.color }}
                        title={`${cat.label} (AQI ${cat.range}): ${count} days (${pct}%)`}
                      />
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginTop: 8, fontSize: 11 }}>
                  {AQI_CATEGORIES.map((cat) => {
                    const count = pillData.daysCount[cat.key] || 0;
                    return (
                      <div key={cat.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                        <span style={{ color: C.body, fontWeight: 600 }}>{cat.label}:</span>
                        <strong style={{ color: C.ink }}>{count}d</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color Scale Guide (Indian Standards) */}
              <div style={{ marginTop: 4, padding: "12px 14px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".06em", color: C.ink }}>
                    AQI & PM2.5 CATEGORY RANGES (CPCB / NAAQS)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                  {AQI_CATEGORIES.map((cat) => (
                    <div
                      key={cat.key}
                      style={{
                        background: "#FFFFFF",
                        border: `1.5px solid ${cat.borderColor}`,
                        borderRadius: 6,
                        padding: "8px 8px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 3,
                        boxShadow: `0 1px 3px ${cat.borderColor}15`
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: cat.dark }}>{cat.label}</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: cat.dark, background: cat.bg, padding: "1px 6px", borderRadius: 4 }}>
                        AQI {cat.range}
                      </div>
                      <div style={{ fontSize: 10.5, color: C.mute, fontWeight: 600 }}>
                        PM2.5: <strong style={{ color: C.ink }}>{cat.pm25Range}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
