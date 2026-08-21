import React, { useState } from "react";
import { getAirData, AQI_CATEGORIES } from "./airData.js";
import { C, InfoButton } from "./ui.jsx";

export default function AirQualityTile({ onNavigate, region = "All-Delhi NCR", dateRange = { from: "2026-02-01", to: "2026-08-11" } }) {
  const [isHovered, setIsHovered] = useState(false);
  const data = getAirData(region, dateRange.from, dateRange.to);

  const points = data.history.slice(-45);
  const maxVal = Math.max(...points.map((p) => Math.max(p.pm25, p.rolling30, 80)), 120);
  const minVal = Math.min(...points.map((p) => Math.min(p.pm25, p.rolling30, 40)), 20);
  const width = 360;
  const height = 74;

  const getY = (v) => height - ((v - minVal) / (maxVal - minVal)) * (height - 14) - 7;
  const getX = (idx) => (idx / (points.length - 1 || 1)) * width;

  const pathRolling = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(p.rolling30).toFixed(1)}`)
    .join(" ");

  const standardY = getY(60);
  const totalCatDays = Object.values(data.daysCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <section style={{ marginTop: 0, marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", color: C.ink }}>
            AMBIENT AIR QUALITY OUTCOMES
          </span>
          <span style={{ fontSize: 12.5, color: C.faint }}>
            Primary impact indicators & source speciation ({region})
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("air-quality", region)}
          style={{
            background: "none",
            border: 0,
            color: C.blue,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0
          }}
        >
          Open Comprehensive Air Quality Page <span style={{ fontSize: 16 }}>›</span>
        </button>
      </div>

      <div
        onClick={() => onNavigate("air-quality", region)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: "#fff",
          border: `1.5px solid ${isHovered ? C.blue : "#CBD5E1"}`,
          borderRadius: 8,
          boxShadow: isHovered ? "0 10px 28px rgba(29,63,134,.16)" : "0 3px 10px rgba(0,0,0,.06)",
          transform: isHovered ? "translateY(-2px)" : "none",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "pointer",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 18px",
            background: isHovered ? C.blueWash : "#FAFAFA",
            borderBottom: `1px solid ${C.line2}`,
            transition: "background 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                padding: "4px 12px",
                background: C.blue,
                color: "#fff",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".02em"
              }}
            >
              AIR POLLUTION & IMPACT
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "3px 8px", borderRadius: 4 }}>
              YoY Improvement: {Math.abs(data.pm25YoYChange)}%
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: C.mute, fontWeight: 600 }}>
              Based on CPCB & CAQM Continuous Monitoring
            </span>
            <span style={{ fontSize: 14, color: C.blue, fontWeight: 700 }}>›</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 0 }}>
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${C.line2}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>
                LEVEL 1 · PRIMARY INDICATOR
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: data.avgPm25 <= 60 ? "#15803D" : "#B45309",
                  background: data.avgPm25 <= 60 ? "#DCFCE7" : "#FEF3C7",
                  padding: "2px 7px",
                  borderRadius: 4
                }}
              >
                {data.avgPm25 <= 60 ? "Within 24h limit" : "Exceeds 24h limit (60 µg/m³)"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace" }}>
                {data.avgPm25}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.mute }}>µg/m³</span>
              <span style={{ fontSize: 12, color: C.faint, marginLeft: "auto" }}>
                30d Moving Avg: <strong>{data.rolling30Latest} µg/m³</strong>
              </span>
            </div>

            <div style={{ fontSize: 12, color: "#5A5C5E", marginTop: 2, fontWeight: 600 }}>
              PM2.5 Ambient Level (Focus on Multi-Day Trend)
            </div>

            <div style={{ marginTop: 12, background: "#F8FAFC", borderRadius: 6, padding: "8px 12px", border: "1px solid #EEF2F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginBottom: 4, fontWeight: 600 }}>
                <span>45-day structural trend</span>
                <span style={{ color: "#E11D48" }}>-- CPCB Safe Limit (60)</span>
              </div>
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
                <line x1="0" y1={standardY} x2={width} y2={standardY} stroke="#E11D48" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                {points.map((p, i) => (
                  <circle key={i} cx={getX(i)} cy={getY(p.pm25)} r="2" fill="#94A3B8" opacity="0.5" />
                ))}
                <path d={pathRolling} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.faint, marginTop: 4 }}>
                <span>Smoothed trajectory filters out 1-day weather spikes</span>
                <span style={{ color: C.blue, fontWeight: 700 }}>● 30-day trend</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "18px 20px", borderRight: `1px solid ${C.line2}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>
                LEVEL 2 · SOURCE APPORTIONMENT
              </div>
              <span style={{ fontSize: 11, color: C.mute, fontWeight: 600 }}>Chemical Speciation</span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginTop: 6 }}>
              Top Emission Contributors
            </div>

            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", margin: "12px 0 14px", background: "#E2E8F0" }}>
              {data.sources.map((s) => (
                <div key={s.name} style={{ width: `${s.share}%`, background: s.color }} title={`${s.name}: ${s.share}%`} />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {data.sources.slice(0, 4).map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flex: "none" }} />
                    <span style={{ color: C.body, fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: C.ink, fontFamily: "'Source Code Pro', monospace" }}>
                    {s.share}%
                  </span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                + {data.sources.length - 4} other sources (Industrial, Domestic)
              </div>
            </div>
          </div>

          <div style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: C.faint }}>
                LEVEL 2 · AQI & OTHER POLLUTANTS
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>
                Peak AQI: <strong style={{ color: "#DC2626" }}>{data.peakAqi}</strong>
              </span>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: C.ink }}>Good to Moderate Days</span>
                <span style={{ fontWeight: 800, color: "#166534", fontFamily: "'Source Code Pro', monospace" }}>
                  {data.goodOrModeratePct}% ({data.daysCount.good + data.daysCount.satisfactory + data.daysCount.moderate}/{totalCatDays} days)
                </span>
              </div>
              <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", margin: "6px 0 10px", background: "#E2E8F0" }}>
                {AQI_CATEGORIES.map((cat) => {
                  const count = data.daysCount[cat.key] || 0;
                  const pct = (count / totalCatDays) * 100;
                  if (pct <= 0) return null;
                  return <div key={cat.key} style={{ width: `${pct}%`, background: cat.color }} title={`${cat.label}: ${count} days`} />;
                })}
              </div>
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, marginTop: 10, letterSpacing: ".04em" }}>
              CRITERIA POLLUTANTS (NAAQS STATUS)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 6 }}>
              {data.pollutants.slice(1, 7).map((p) => {
                const isCompliant = p.val <= p.limit;
                return (
                  <div
                    key={p.key}
                    style={{
                      padding: "5px 6px",
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: 4,
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>{p.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: isCompliant ? "#166534" : "#DC2626", fontFamily: "'Source Code Pro', monospace" }}>
                      {p.val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
