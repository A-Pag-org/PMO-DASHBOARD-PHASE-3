/* Ambient Air Quality & Pollution Level Data Layer
   Provides structured models for:
   - Live PM2.5 levels & AQI data
   - Historical daily trends (7-day / 30-day moving averages, baseline comparisons)
   - L2a: Relative contribution of each source (Chemical Speciation & Source Apportionment)
   - L2b: Levels of other pollutants (PM10, SO2, NO2, NOx, CO, O3, NH3) with CPCB limits
   - L2c: AQI data (peak analysis and Good / Moderate / Bad category day breakdown)
*/

export const CPCB_STANDARDS = {
  pm25: { limit24h: 60, limitAnnual: 40, unit: "µg/m³", name: "Fine Particulate Matter (PM2.5)" },
  pm10: { limit24h: 100, limitAnnual: 60, unit: "µg/m³", name: "Particulate Matter (PM10)" },
  no2: { limit24h: 80, limitAnnual: 40, unit: "µg/m³", name: "Nitrogen Dioxide (NO2)" },
  so2: { limit24h: 80, limitAnnual: 50, unit: "µg/m³", name: "Sulphur Dioxide (SO2)" },
  nox: { limit24h: 80, limitAnnual: 50, unit: "ppb", name: "Nitrogen Oxides (NOx)" },
  co: { limit24h: 2.0, limitAnnual: 2.0, unit: "mg/m³", name: "Carbon Monoxide (CO)" },
  o3: { limit24h: 100, limitAnnual: 100, unit: "µg/m³", name: "Ozone (O3 - 8hr)" },
  nh3: { limit24h: 400, limitAnnual: 100, unit: "µg/m³", name: "Ammonia (NH3)" }
};

export const AQI_CATEGORIES = [
  { key: "good", label: "Good", range: "0–50", pm25Range: "0–30 µg/m³", color: "#16A34A", bg: "#DCFCE7", dark: "#14532D", borderColor: "#16A34A", meaning: "Minimal impact. Clean and healthy air." },
  { key: "satisfactory", label: "Satisfactory", range: "51–100", pm25Range: "31–60 µg/m³", color: "#65A30D", bg: "#ECFCCB", dark: "#365314", borderColor: "#65A30D", meaning: "Minor breathing discomfort to sensitive people." },
  { key: "moderate", label: "Moderate", range: "101–200", pm25Range: "61–90 µg/m³", color: "#D97706", bg: "#FEF3C7", dark: "#78350F", borderColor: "#D97706", meaning: "Breathing discomfort to people with lung/asthma and heart diseases." },
  { key: "poor", label: "Poor", range: "201–300", pm25Range: "91–120 µg/m³", color: "#EA580C", bg: "#FFEDD5", dark: "#7C2D12", borderColor: "#EA580C", meaning: "Breathing discomfort to most people on prolonged exposure." },
  { key: "very_poor", label: "Bad (Very Poor)", range: "301–400", pm25Range: "121–250 µg/m³", color: "#DC2626", bg: "#FEE2E2", dark: "#7F1D1D", borderColor: "#DC2626", meaning: "Respiratory illness on prolonged exposure. Significant health impact." },
  { key: "severe", label: "Worst (Severe)", range: "401–500+", pm25Range: "≥ 251 µg/m³", color: "#881337", bg: "#FFE4E6", dark: "#4C0519", borderColor: "#881337", meaning: "Affects healthy people and seriously impacts those with existing diseases." }
];

export function getAqiCategory(val) {
  if (val <= 50) return AQI_CATEGORIES[0];
  if (val <= 100) return AQI_CATEGORIES[1];
  if (val <= 200) return AQI_CATEGORIES[2];
  if (val <= 300) return AQI_CATEGORIES[3];
  if (val <= 400) return AQI_CATEGORIES[4];
  return AQI_CATEGORIES[5];
}

// Regional base statistics & relative profiles
export const REGIONAL_AIR_PROFILES = {
  "All-Delhi NCR": {
    pm25Current: 82,
    aqiCurrent: 184,
    pm25YoYChange: -12.4, // 12.4% reduction
    pm25Avg30d: 88,
    pm25Avg7d: 79,
    peakAqi: 312,
    peakAqiDate: "18 Jun 2026",
    daysCount: { good: 14, satisfactory: 42, moderate: 78, poor: 44, very_poor: 12, severe: 2 },
    pollutants: [
      { key: "pm25", name: "PM 2.5", val: 82, unit: "µg/m³", limit: 60, status: "Moderate exceedance", trend: -12 },
      { key: "pm10", name: "PM 10", val: 168, unit: "µg/m³", limit: 100, status: "Moderate exceedance", trend: -9 },
      { key: "no2", name: "NO₂", val: 46, unit: "µg/m³", limit: 80, status: "Within standard", trend: -6 },
      { key: "nox", name: "NOₓ", val: 52, unit: "ppb", limit: 80, status: "Within standard", trend: -4 },
      { key: "so2", name: "SO₂", val: 18, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -2 },
      { key: "co", name: "CO", val: 1.2, unit: "mg/m³", limit: 2.0, status: "Within standard", trend: -8 },
      { key: "o3", name: "O₃ (8h)", val: 64, unit: "µg/m³", limit: 100, status: "Within standard", trend: +3 },
      { key: "nh3", name: "NH₃", val: 124, unit: "µg/m³", limit: 400, status: "Well within standard", trend: -1 }
    ],
    sources: [
      { name: "Vehicular Transport", share: 29, color: "#1D3F86", speciation: "Elemental Carbon (42%), Organic Carbon (34%), NOx trace" },
      { name: "Secondary Inorganic Aerosols", share: 22, color: "#4F46E5", speciation: "Sulfate SO₄²⁻ (48%), Nitrate NO₃⁻ (38%), Ammonium NH₄⁺ (14%)" },
      { name: "Road & Construction Dust", share: 19, color: "#D97706", speciation: "Crustal Silica SiO₂ (52%), Al (18%), Fe/Ca oxides (30%)" },
      { name: "Biomass & Waste Burning", share: 14, color: "#DC2626", speciation: "Levoglucosan marker (18%), Potassium K⁺ (26%), Organic Carbon (56%)" },
      { name: "Industrial & Power Plants", share: 11, color: "#7C3AED", speciation: "Heavy metals (Pb, Zn, Cd), Fly ash, Sulfates" },
      { name: "Domestic & Other", share: 5, color: "#64748B", speciation: "Cooking fuel aerosols, biogenic organics" }
    ],
    speciationMarkers: [
      { compound: "Organic Carbon (OC)", share: 26.5, desc: "Vehicular exhaust, biomass burning, secondary organic aerosols" },
      { compound: "Elemental Carbon (EC)", share: 9.8, desc: "Primary diesel combustion, incomplete burning" },
      { compound: "Sulfate (SO₄²⁻)", share: 18.2, desc: "Oxidation of industrial and regional SO2" },
      { compound: "Nitrate (NO₃⁻)", share: 15.6, desc: "Oxidation of NOx from traffic and high-temp combustion" },
      { compound: "Ammonium (NH₄⁺)", share: 7.4, desc: "Agricultural fertilizer & livestock ammonia neutralization" },
      { compound: "Crustal & Mineral Matter", share: 16.5, desc: "Soil dust, resuspension from paved/unpaved roads & C&D sites" },
      { compound: "Trace Elements & Others", share: 6.0, desc: "Metals (Fe, Zn, Pb) from industrial and tire/brake wear" }
    ]
  },
  "Delhi": {
    pm25Current: 89,
    aqiCurrent: 198,
    pm25YoYChange: -14.1,
    pm25Avg30d: 94,
    pm25Avg7d: 84,
    peakAqi: 345,
    peakAqiDate: "21 Jun 2026",
    daysCount: { good: 10, satisfactory: 36, moderate: 74, poor: 52, very_poor: 18, severe: 2 },
    pollutants: [
      { key: "pm25", name: "PM 2.5", val: 89, unit: "µg/m³", limit: 60, status: "Moderate exceedance", trend: -14 },
      { key: "pm10", name: "PM 10", val: 182, unit: "µg/m³", limit: 100, status: "Moderate exceedance", trend: -11 },
      { key: "no2", name: "NO₂", val: 56, unit: "µg/m³", limit: 80, status: "Within standard", trend: -8 },
      { key: "nox", name: "NOₓ", val: 64, unit: "ppb", limit: 80, status: "Within standard", trend: -7 },
      { key: "so2", name: "SO₂", val: 16, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -1 },
      { key: "co", name: "CO", val: 1.4, unit: "mg/m³", limit: 2.0, status: "Within standard", trend: -10 },
      { key: "o3", name: "O₃ (8h)", val: 72, unit: "µg/m³", limit: 100, status: "Within standard", trend: +5 },
      { key: "nh3", name: "NH₃", val: 138, unit: "µg/m³", limit: 400, status: "Well within standard", trend: -2 }
    ],
    sources: [
      { name: "Vehicular Transport", share: 34, color: "#1D3F86", speciation: "High diesel/petrol fleet density" },
      { name: "Secondary Inorganic Aerosols", share: 24, color: "#4F46E5", speciation: "Regional transport of sulfates & nitrates" },
      { name: "Road & Construction Dust", share: 18, color: "#D97706", speciation: "High road traffic re-suspension" },
      { name: "Biomass & Waste Burning", share: 12, color: "#DC2626", speciation: "Local municipal solid waste & domestic fires" },
      { name: "Industrial & Power Plants", share: 7, color: "#7C3AED", speciation: "Surrounding industrial hubs & brick kilns" },
      { name: "Domestic & Other", share: 5, color: "#64748B", speciation: "Commercial eateries & generators" }
    ],
    speciationMarkers: [
      { compound: "Organic Carbon (OC)", share: 28.1, desc: "Vehicular exhaust, domestic burning" },
      { compound: "Elemental Carbon (EC)", share: 11.4, desc: "High density commercial diesel traffic" },
      { compound: "Sulfate (SO₄²⁻)", share: 17.5, desc: "Regional coal combustion & industrial transport" },
      { compound: "Nitrate (NO₃⁻)", share: 17.8, desc: "Urban vehicle emissions transformed to aerosol nitrate" },
      { compound: "Ammonium (NH₄⁺)", share: 7.2, desc: "Neutralization with urban acids" },
      { compound: "Crustal & Mineral Matter", share: 13.0, desc: "Road dust & mechanical abrasion" },
      { compound: "Trace Elements & Others", share: 5.0, desc: "Brake wear, tire wear" }
    ]
  },
  "UP": {
    pm25Current: 84,
    aqiCurrent: 188,
    pm25YoYChange: -11.0,
    pm25Avg30d: 91,
    pm25Avg7d: 81,
    peakAqi: 320,
    peakAqiDate: "17 Jun 2026",
    daysCount: { good: 12, satisfactory: 40, moderate: 80, poor: 46, very_poor: 13, severe: 1 },
    pollutants: [
      { key: "pm25", name: "PM 2.5", val: 84, unit: "µg/m³", limit: 60, status: "Moderate exceedance", trend: -11 },
      { key: "pm10", name: "PM 10", val: 174, unit: "µg/m³", limit: 100, status: "Moderate exceedance", trend: -8 },
      { key: "no2", name: "NO₂", val: 44, unit: "µg/m³", limit: 80, status: "Within standard", trend: -5 },
      { key: "nox", name: "NOₓ", val: 50, unit: "ppb", limit: 80, status: "Within standard", trend: -3 },
      { key: "so2", name: "SO₂", val: 22, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -3 },
      { key: "co", name: "CO", val: 1.3, unit: "mg/m³", limit: 2.0, status: "Within standard", trend: -7 },
      { key: "o3", name: "O₃ (8h)", val: 62, unit: "µg/m³", limit: 100, status: "Within standard", trend: +2 },
      { key: "nh3", name: "NH₃", val: 142, unit: "µg/m³", limit: 400, status: "Well within standard", trend: 0 }
    ],
    sources: [
      { name: "Vehicular Transport", share: 26, color: "#1D3F86", speciation: "Highway corridors and urban centers" },
      { name: "Industrial & Power Plants", share: 20, color: "#7C3AED", speciation: "Noida/Ghaziabad industrial zones & brick kilns" },
      { name: "Secondary Inorganic Aerosols", share: 21, color: "#4F46E5", speciation: "High sulfate/nitrate conversion" },
      { name: "Road & Construction Dust", share: 18, color: "#D97706", speciation: "Unpaved shoulders & expressways" },
      { name: "Biomass & Waste Burning", share: 11, color: "#DC2626", speciation: "Agricultural fringes & MSW" },
      { name: "Domestic & Other", share: 4, color: "#64748B", speciation: "Solid fuel use in peri-urban areas" }
    ],
    speciationMarkers: [
      { compound: "Organic Carbon (OC)", share: 25.8, desc: "Industrial and vehicular emissions" },
      { compound: "Elemental Carbon (EC)", share: 9.2, desc: "Heavy transport and brick kiln fuel" },
      { compound: "Sulfate (SO₄²⁻)", share: 20.4, desc: "Industrial coal and heavy fuel oil combustion" },
      { compound: "Nitrate (NO₃⁻)", share: 14.5, desc: "Highway corridors NOx transformation" },
      { compound: "Ammonium (NH₄⁺)", share: 8.1, desc: "Agricultural ammonium inputs" },
      { compound: "Crustal & Mineral Matter", share: 15.6, desc: "Construction & unpaved roads" },
      { compound: "Trace Elements & Others", share: 6.4, desc: "Industrial process markers" }
    ]
  },
  "Haryana": {
    pm25Current: 78,
    aqiCurrent: 172,
    pm25YoYChange: -13.8,
    pm25Avg30d: 84,
    pm25Avg7d: 75,
    peakAqi: 298,
    peakAqiDate: "15 Jun 2026",
    daysCount: { good: 16, satisfactory: 48, moderate: 82, poor: 38, very_poor: 8, severe: 0 },
    pollutants: [
      { key: "pm25", name: "PM 2.5", val: 78, unit: "µg/m³", limit: 60, status: "Moderate exceedance", trend: -13.8 },
      { key: "pm10", name: "PM 10", val: 156, unit: "µg/m³", limit: 100, status: "Moderate exceedance", trend: -10 },
      { key: "no2", name: "NO₂", val: 40, unit: "µg/m³", limit: 80, status: "Within standard", trend: -6 },
      { key: "nox", name: "NOₓ", val: 46, unit: "ppb", limit: 80, status: "Within standard", trend: -5 },
      { key: "so2", name: "SO₂", val: 15, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -2 },
      { key: "co", name: "CO", val: 1.0, unit: "mg/m³", limit: 2.0, status: "Within standard", trend: -8 },
      { key: "o3", name: "O₃ (8h)", val: 58, unit: "µg/m³", limit: 100, status: "Within standard", trend: +1 },
      { key: "nh3", name: "NH₃", val: 118, unit: "µg/m³", limit: 400, status: "Well within standard", trend: -1 }
    ],
    sources: [
      { name: "Vehicular Transport", share: 28, color: "#1D3F86", speciation: "Gurugram/Faridabad traffic" },
      { name: "Secondary Inorganic Aerosols", share: 22, color: "#4F46E5", speciation: "Atmospheric aerosol formation" },
      { name: "Road & Construction Dust", share: 21, color: "#D97706", speciation: "High development zones & mining dust" },
      { name: "Biomass & Waste Burning", share: 15, color: "#DC2626", speciation: "Crop residue & farm biomass" },
      { name: "Industrial & Power Plants", share: 9, color: "#7C3AED", speciation: "Manufacturing clusters" },
      { name: "Domestic & Other", share: 5, color: "#64748B", speciation: "Peri-urban domestic cooking" }
    ],
    speciationMarkers: [
      { compound: "Organic Carbon (OC)", share: 26.0, desc: "Traffic and agricultural burning" },
      { compound: "Elemental Carbon (EC)", share: 9.0, desc: "Highway freight and diesel machinery" },
      { compound: "Sulfate (SO₄²⁻)", share: 16.8, desc: "Regional emissions" },
      { compound: "Nitrate (NO₃⁻)", share: 14.8, desc: "Transport corridor NOx" },
      { compound: "Ammonium (NH₄⁺)", share: 9.2, desc: "Intensive agricultural NH3" },
      { compound: "Crustal & Mineral Matter", share: 18.2, desc: "Soil and road dust" },
      { compound: "Trace Elements & Others", share: 6.0, desc: "Industrial and vehicular traces" }
    ]
  },
  "Rajasthan": {
    pm25Current: 69,
    aqiCurrent: 154,
    pm25YoYChange: -10.5,
    pm25Avg30d: 74,
    pm25Avg7d: 67,
    peakAqi: 275,
    peakAqiDate: "12 Jun 2026",
    daysCount: { good: 22, satisfactory: 56, moderate: 76, poor: 32, very_poor: 6, severe: 0 },
    pollutants: [
      { key: "pm25", name: "PM 2.5", val: 69, unit: "µg/m³", limit: 60, status: "Slight exceedance", trend: -10.5 },
      { key: "pm10", name: "PM 10", val: 148, unit: "µg/m³", limit: 100, status: "Moderate exceedance", trend: -7 },
      { key: "no2", name: "NO₂", val: 32, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -4 },
      { key: "nox", name: "NOₓ", val: 38, unit: "ppb", limit: 80, status: "Well within standard", trend: -3 },
      { key: "so2", name: "SO₂", val: 14, unit: "µg/m³", limit: 80, status: "Well within standard", trend: -1 },
      { key: "co", name: "CO", val: 0.9, unit: "mg/m³", limit: 2.0, status: "Within standard", trend: -5 },
      { key: "o3", name: "O₃ (8h)", val: 52, unit: "µg/m³", limit: 100, status: "Within standard", trend: +2 },
      { key: "nh3", name: "NH₃", val: 96, unit: "µg/m³", limit: 400, status: "Well within standard", trend: -1 }
    ],
    sources: [
      { name: "Road & Construction Dust", share: 31, color: "#D97706", speciation: "Arid soil, unpaved terrain & mining dust" },
      { name: "Vehicular Transport", share: 24, color: "#1D3F86", speciation: "National highways & town clusters" },
      { name: "Industrial & Power Plants", share: 18, color: "#7C3AED", speciation: "Alwar/Bhiwadi manufacturing clusters" },
      { name: "Secondary Inorganic Aerosols", share: 15, color: "#4F46E5", speciation: "Sulfate & nitrate particulates" },
      { name: "Biomass & Waste Burning", share: 8, color: "#DC2626", speciation: "Domestic and stubble burning" },
      { name: "Domestic & Other", share: 4, color: "#64748B", speciation: "Traditional cookstoves" }
    ],
    speciationMarkers: [
      { compound: "Organic Carbon (OC)", share: 22.4, desc: "Combustion & natural biogenic emissions" },
      { compound: "Elemental Carbon (EC)", share: 7.6, desc: "Highway transport & diesel power" },
      { compound: "Sulfate (SO₄²⁻)", share: 15.0, desc: "Industrial SO2 oxidation" },
      { compound: "Nitrate (NO₃⁻)", share: 11.8, desc: "Highway traffic nitrogen" },
      { compound: "Ammonium (NH₄⁺)", share: 6.2, desc: "Soil and agricultural emissions" },
      { compound: "Crustal & Mineral Matter", share: 31.5, desc: "Arid windblown mineral dust" },
      { compound: "Trace Elements & Others", share: 5.5, desc: "Mineral processing" }
    ]
  }
};

// Generates 192 historical daily records for trends (from Feb 01, 2026 to Aug 11, 2026)
export function generateDailyHistory(region = "All-Delhi NCR") {
  const profile = REGIONAL_AIR_PROFILES[region] || REGIONAL_AIR_PROFILES["All-Delhi NCR"];
  const start = new Date("2026-02-01T00:00:00");
  const end = new Date("2026-08-11T00:00:00");
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const records = [];
  let rollingSum7 = 0;
  let rollingSum30 = 0;
  const pmHistory = [];

  const baseScale = profile.pm25Current / 82;

  for (let i = 0; i < days; i++) {
    const curDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = curDate.toISOString().slice(0, 10);
    
    // Seasonal pattern: higher in Feb/Mar, lower in monsoon (Jul/Aug)
    const month = curDate.getMonth();
    const seasonalFactor = month <= 2 ? 1.45 : month <= 4 ? 1.15 : month === 5 ? 0.95 : 0.68;
    
    const noise = Math.sin(i * 0.4) * 12 + Math.cos(i * 0.15) * 18 + (Math.sin(i * 1.7) * 8);
    const pm25Raw = Math.max(22, Math.round((70 * seasonalFactor + noise) * baseScale));
    
    const prevYearPm25 = Math.round(pm25Raw * (1.12 + Math.sin(i * 0.3) * 0.05));

    pmHistory.push(pm25Raw);
    rollingSum7 += pm25Raw;
    if (i >= 7) rollingSum7 -= pmHistory[i - 7];
    
    rollingSum30 += pm25Raw;
    if (i >= 30) rollingSum30 -= pmHistory[i - 30];

    const rolling7 = Math.round(rollingSum7 / Math.min(i + 1, 7));
    const rolling30 = Math.round(rollingSum30 / Math.min(i + 1, 30));

    const aqi = Math.round(pm25Raw * 2.2 + 25);
    const cat = getAqiCategory(aqi);

    records.push({
      date: dateStr,
      label: curDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      pm25: pm25Raw,
      pm25PrevYear: prevYearPm25,
      rolling7,
      rolling30,
      aqi,
      category: cat.key,
      categoryLabel: cat.label,
      categoryColor: cat.color,
      cpcbStandard: 60
    });
  }

  return records;
}

export function getAirData(region = "All-Delhi NCR", dateFrom = "2026-02-01", dateTo = "2026-08-11") {
  const profile = REGIONAL_AIR_PROFILES[region] || REGIONAL_AIR_PROFILES["All-Delhi NCR"];
  const allHistory = generateDailyHistory(region);
  
  const filteredHistory = allHistory.filter((d) => d.date >= dateFrom && d.date <= dateTo);
  const totalDays = filteredHistory.length || 1;

  const pm25Sum = filteredHistory.reduce((acc, d) => acc + d.pm25, 0);
  const avgPm25 = Math.round(pm25Sum / totalDays);
  
  const peakRecord = filteredHistory.reduce(
    (max, cur) => (cur.aqi > max.aqi ? cur : max),
    filteredHistory[0] || { aqi: profile.peakAqi, label: profile.peakAqiDate }
  );

  const catCounts = {
    good: filteredHistory.filter((d) => d.category === "good").length,
    satisfactory: filteredHistory.filter((d) => d.category === "satisfactory").length,
    moderate: filteredHistory.filter((d) => d.category === "moderate").length,
    poor: filteredHistory.filter((d) => d.category === "poor").length,
    very_poor: filteredHistory.filter((d) => d.category === "very_poor").length,
    severe: filteredHistory.filter((d) => d.category === "severe").length
  };

  const goodOrModerateDays = catCounts.good + catCounts.satisfactory + catCounts.moderate;
  const goodOrModeratePct = Math.round((goodOrModerateDays / totalDays) * 100);

  const latestDay = filteredHistory.length ? filteredHistory[filteredHistory.length - 1] : { pm25: profile.pm25Current, aqi: profile.aqiCurrent };

  return {
    region,
    totalDays,
    livePm25: latestDay.pm25,
    liveAqi: latestDay.aqi,
    liveCategory: getAqiCategory(latestDay.aqi),
    avgPm25: avgPm25 || profile.pm25Current,
    pm25YoYChange: profile.pm25YoYChange,
    rolling7Latest: filteredHistory.length ? filteredHistory[filteredHistory.length - 1].rolling7 : profile.pm25Avg7d,
    rolling30Latest: filteredHistory.length ? filteredHistory[filteredHistory.length - 1].rolling30 : profile.pm25Avg30d,
    peakAqi: peakRecord ? peakRecord.aqi : profile.peakAqi,
    peakAqiDate: peakRecord ? (peakRecord.label || peakRecord.date) : profile.peakAqiDate,
    daysCount: catCounts,
    goodOrModeratePct,
    pollutants: profile.pollutants,
    sources: profile.sources,
    speciationMarkers: profile.speciationMarkers,
    history: filteredHistory
  };
}
