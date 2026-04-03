import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { Brain, Target, TrendingDown, Gauge } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  ScatterChart, Scatter, ReferenceLine, Label,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const modelRankings = [
  { rank: 1, model: "xgb",           mae: 1.81, rmse: 3.57,  mape: "13.2%", wMAPE: "10.2%", bias: "0.4%",   fillRate: "95.1%", nSamples: 76376, bestMAE: true,  bestRMSE: false, bestWMAPE: true,  bestFill: false },
  { rank: 2, model: "lgbm",          mae: 1.81, rmse: 3.58,  mape: "13.4%", wMAPE: "10.2%", bias: "0.2%",   fillRate: "95.0%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: false },
  { rank: 3, model: "ensemble",      mae: 1.83, rmse: 3.76,  mape: "13.1%", wMAPE: "10.3%", bias: "0.9%",   fillRate: "95.3%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: true  },
  { rank: 4, model: "snaive",        mae: 3.97, rmse: 7.40,  mape: "31.5%", wMAPE: "22.2%", bias: "3.2%",   fillRate: "90.5%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: false },
  { rank: 5, model: "seasonal_naive",mae: 3.97, rmse: 7.40,  mape: "31.5%", wMAPE: "22.2%", bias: "3.2%",   fillRate: "90.5%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: false },
  { rank: 6, model: "tft",           mae: 6.69, rmse: 13.71, mape: "49.8%", wMAPE: "37.5%", bias: "-31.0%", fillRate: "65.8%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: false },
  { rank: 7, model: "nbeats",        mae: 7.11, rmse: 13.64, mape: "55.3%", wMAPE: "39.9%", bias: "-8.2%",  fillRate: "76.0%", nSamples: 76376, bestMAE: false, bestRMSE: false, bestWMAPE: false, bestFill: false },
];

const featureImportanceByModel: Record<string, { feature: string; importance: number }[]> = {
  xgb: [
    { feature: "lag_1_demand",       importance: 0.341 },
    { feature: "lag_7_demand",       importance: 0.298 },
    { feature: "rolling_mean_4w",    importance: 0.221 },
    { feature: "price",              importance: 0.175 },
    { feature: "day_of_week",        importance: 0.143 },
    { feature: "month",              importance: 0.118 },
    { feature: "promotion_flag",     importance: 0.097 },
    { feature: "stock_availability", importance: 0.082 },
    { feature: "category_encoded",   importance: 0.061 },
    { feature: "pharmacy_id",        importance: 0.044 },
  ],
  lgbm: [
    { feature: "lag_1_demand",       importance: 0.318 },
    { feature: "rolling_mean_4w",    importance: 0.287 },
    { feature: "lag_7_demand",       importance: 0.254 },
    { feature: "price",              importance: 0.198 },
    { feature: "promotion_flag",     importance: 0.162 },
    { feature: "month",              importance: 0.139 },
    { feature: "day_of_week",        importance: 0.111 },
    { feature: "stock_availability", importance: 0.088 },
    { feature: "pharmacy_id",        importance: 0.067 },
    { feature: "category_encoded",   importance: 0.049 },
  ],
  ensemble: [
    { feature: "lag_1_demand",       importance: 0.312 },
    { feature: "lag_7_demand",       importance: 0.278 },
    { feature: "rolling_mean_4w",    importance: 0.241 },
    { feature: "price",              importance: 0.189 },
    { feature: "day_of_week",        importance: 0.154 },
    { feature: "month",              importance: 0.132 },
    { feature: "promotion_flag",     importance: 0.118 },
    { feature: "stock_availability", importance: 0.097 },
    { feature: "category_encoded",   importance: 0.076 },
    { feature: "pharmacy_id",        importance: 0.054 },
  ],
  snaive: [
    { feature: "lag_7_demand",       importance: 0.521 },
    { feature: "lag_1_demand",       importance: 0.312 },
    { feature: "rolling_mean_4w",    importance: 0.187 },
    { feature: "day_of_week",        importance: 0.143 },
    { feature: "month",              importance: 0.098 },
    { feature: "price",              importance: 0.062 },
    { feature: "promotion_flag",     importance: 0.041 },
    { feature: "stock_availability", importance: 0.033 },
    { feature: "category_encoded",   importance: 0.021 },
    { feature: "pharmacy_id",        importance: 0.018 },
  ],
  seasonal_naive: [
    { feature: "lag_7_demand",       importance: 0.498 },
    { feature: "lag_1_demand",       importance: 0.334 },
    { feature: "rolling_mean_4w",    importance: 0.201 },
    { feature: "day_of_week",        importance: 0.159 },
    { feature: "month",              importance: 0.112 },
    { feature: "price",              importance: 0.071 },
    { feature: "promotion_flag",     importance: 0.048 },
    { feature: "stock_availability", importance: 0.037 },
    { feature: "category_encoded",   importance: 0.024 },
    { feature: "pharmacy_id",        importance: 0.019 },
  ],
  tft: [
    { feature: "rolling_mean_4w",    importance: 0.389 },
    { feature: "lag_1_demand",       importance: 0.271 },
    { feature: "price",              importance: 0.243 },
    { feature: "lag_7_demand",       importance: 0.198 },
    { feature: "promotion_flag",     importance: 0.177 },
    { feature: "month",              importance: 0.154 },
    { feature: "stock_availability", importance: 0.131 },
    { feature: "day_of_week",        importance: 0.109 },
    { feature: "category_encoded",   importance: 0.087 },
    { feature: "pharmacy_id",        importance: 0.063 },
  ],
  nbeats: [
    { feature: "rolling_mean_4w",    importance: 0.412 },
    { feature: "lag_1_demand",       importance: 0.289 },
    { feature: "lag_7_demand",       importance: 0.231 },
    { feature: "price",              importance: 0.187 },
    { feature: "month",              importance: 0.162 },
    { feature: "promotion_flag",     importance: 0.138 },
    { feature: "day_of_week",        importance: 0.114 },
    { feature: "stock_availability", importance: 0.093 },
    { feature: "pharmacy_id",        importance: 0.071 },
    { feature: "category_encoded",   importance: 0.052 },
  ],
};

// Generate deterministic scatter points seeded per model
function generateScatterData(modelName: string, count = 320) {
  const seed = modelName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const noise = (i: number, scale: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 0.5 + 0.5;
    return (x - 0.5) * scale;
  };
  // tighter cluster for top models, wider spread for weaker ones
  const spreadMap: Record<string, number> = {
    xgb: 4, lgbm: 4.5, ensemble: 5, snaive: 14, seasonal_naive: 14, tft: 22, nbeats: 20,
  };
  const spread = spreadMap[modelName] ?? 10;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const actual = Math.max(1, Math.round(Math.abs(Math.sin(seed + i * 0.17) * 60 + noise(i, 60))));
    const predicted = Math.max(0, Math.round(actual + noise(i * 3, spread * 2)));
    points.push({ x: Math.min(actual, 300), y: Math.min(predicted, 300) });
  }
  return points;
}

const MODEL_COLORS: Record<string, string> = {
  xgb:           "#00C2FF",
  lgbm:          "#7F77DD",
  ensemble:      "#FFD400",
  snaive:        "#ff5c5c",
  seasonal_naive:"#1D9E75",
  tft:           "#5DCAA5",
  nbeats:        "#378ADD",
};

const TOP_MODELS = new Set(["xgb", "lgbm", "ensemble"]);

const normalize = (val: number, min: number, max: number, invert = false) => {
  const n = (val - min) / (max - min);
  return parseFloat((invert ? 1 - n : n).toFixed(3));
};

const maes      = modelRankings.map(m => m.mae);
const rmses     = modelRankings.map(m => m.rmse);
const wmapes    = modelRankings.map(m => parseFloat(m.wMAPE));
const fillRates = modelRankings.map(m => parseFloat(m.fillRate));

const radarModels = modelRankings.map((m) => ({
  name: m.model,
  MAE:       normalize(m.mae,               Math.min(...maes),      Math.max(...maes),      true),
  RMSE:      normalize(m.rmse,              Math.min(...rmses),     Math.max(...rmses),     true),
  wMAPE:     normalize(parseFloat(m.wMAPE), Math.min(...wmapes),    Math.max(...wmapes),    true),
  Fill_Rate: normalize(parseFloat(m.fillRate), Math.min(...fillRates), Math.max(...fillRates), false),
}));

const radarChartData = ["MAE","RMSE","wMAPE","Fill_Rate"].map(metric => {
  const row: any = { metric };
  radarModels.forEach(m => { row[m.name] = (m as any)[metric]; });
  return row;
});

const wMAPEBarData = modelRankings.map(m => ({
  model: m.model,
  wMAPE: parseFloat(m.wMAPE),
}));

// ─── Sub-components ──────────────────────────────────────────────────────────

const GreenCell = ({ children, highlight }: { children: React.ReactNode; highlight: boolean }) => (
  <td
    className="py-3 px-4 text-right text-sm tabular-nums"
    style={highlight ? { background: "rgba(34,139,70,0.55)", color: "#d1fae5", fontWeight: 600 } : {}}
  >
    {children}
  </td>
);

const RadarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value?.toFixed(3)}</span>
        </p>
      ))}
    </div>
  );
};

const BarTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p style={{ color: MODEL_COLORS[label] ?? "#378ADD" }}>
        wMAPE: <span className="font-semibold">{payload[0]?.value}%</span>
      </p>
    </div>
  );
};

const FeatureTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p style={{ color: "hsl(280 60% 65%)" }}>
        Importance: <span className="font-semibold">{payload[0]?.value?.toFixed(3)}</span>
      </p>
    </div>
  );
};

const ScatterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="text-muted-foreground">Actual: <span className="font-semibold text-foreground">{d.x}</span></p>
      <p className="text-muted-foreground">Predicted: <span className="font-semibold text-foreground">{d.y}</span></p>
      <p className="text-muted-foreground">Error: <span className="font-semibold" style={{ color: Math.abs(d.x - d.y) > 10 ? "#ff5c5c" : "#1D9E75" }}>{(d.y - d.x).toFixed(1)}</span></p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const best = modelRankings[0];

const AdminPage = () => {
  const [selectedModel, setSelectedModel] = useState("ensemble");

  const featureData   = featureImportanceByModel[selectedModel] ?? [];
  const scatterData   = generateScatterData(selectedModel);
  const modelColor    = MODEL_COLORS[selectedModel] ?? "#378ADD";
  const modelInfo     = modelRankings.find(m => m.model === selectedModel);

  // Perfect forecast diagonal line points
  const perfectLine = [{ x: 0, y: 0 }, { x: 300, y: 300 }];

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader
        title="Model Insights"
        description="Machine learning model performance and diagnostics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Best Model" value={best.model}        icon={Brain}        delay={0} />
        <KpiCard title="MAPE"       value={best.mape}         icon={Target}       iconColor="bg-success/15 text-success"      delay={0.05} />
        <KpiCard title="RMSE"       value={String(best.rmse)} icon={TrendingDown} iconColor="bg-accent text-accent-foreground" delay={0.1} />
        <KpiCard title="Fill Rate"  value={best.fillRate}     icon={Gauge}        iconColor="bg-info/15 text-info"            delay={0.15} />
      </div>

      {/* Model Ranking — full width */}
      <GlassCard className="p-5" delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🏆</span>
          <h3 className="font-semibold text-sm">Model Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                {["Rank","Model","MAE","RMSE","MAPE","wMAPE","Bias","Fill_Rate","N_samples"].map((h) => (
                  <th
                    key={h}
                    className={`py-2.5 px-4 text-xs font-medium text-muted-foreground tracking-wide border-b border-border/40 ${
                      h === "Rank" || h === "Model" ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelRankings.map((row, i) => (
                <tr key={row.model} className="border-b border-border/30 last:border-0 hover:bg-white/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-muted-foreground w-16">{row.rank}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground min-w-[140px]">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: MODEL_COLORS[row.model] ?? "#888" }} />
                      {row.model}
                      {i === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 font-semibold">★ Best</span>
                      )}
                    </span>
                  </td>
                  <GreenCell highlight={row.bestMAE}>{row.mae.toFixed(2)}</GreenCell>
                  <GreenCell highlight={row.bestRMSE}>{row.rmse.toFixed(2)}</GreenCell>
                  <td className="py-3 px-4 text-right text-sm tabular-nums">{row.mape}</td>
                  <GreenCell highlight={row.bestWMAPE}>{row.wMAPE}</GreenCell>
                  <td className="py-3 px-4 text-right text-sm tabular-nums" style={{ color: row.bias.startsWith("-") ? "hsl(0 72% 51%)" : "hsl(142 71% 35%)" }}>
                    {row.bias}
                  </td>
                  <GreenCell highlight={row.bestFill}>{row.fillRate}</GreenCell>
                  <td className="py-3 px-4 text-right text-sm tabular-nums text-muted-foreground">{row.nSamples.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Radar + wMAPE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5" delay={0.25}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🎯</span>
            <h3 className="font-semibold text-sm">Multi-Metric Radar</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Normalised scores — higher = better for all axes</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {radarModels.map(m => (
              <span key={m.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-5 h-0 border-t-2" style={{ borderColor: MODEL_COLORS[m.name] ?? "#888" }} />
                {m.name}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarChartData} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
              <PolarGrid stroke="hsl(230 15% 75%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(230 10% 46%)", fontWeight: 500 }} />
              <PolarRadiusAxis angle={90} domain={[0, 1]} tickCount={5} tick={{ fontSize: 10, fill: "hsl(230 10% 55%)" }} axisLine={false} />
              {radarModels.map((m) => (
                <Radar key={m.name} name={m.name} dataKey={m.name}
                  stroke={MODEL_COLORS[m.name] ?? "#888"} fill={MODEL_COLORS[m.name] ?? "#888"}
                  fillOpacity={m.name === "xgb" ? 0.18 : 0.04}
                  strokeWidth={m.name === "xgb" ? 2.5 : 1.5}
                  dot={m.name === "xgb"}
                />
              ))}
              <Tooltip content={<RadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={0.3}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📊</span>
            <h3 className="font-semibold text-sm">wMAPE by Model</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Weighted Mean Absolute Percentage Error — lower is better</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={wMAPEBarData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" vertical={false} />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 45]} />
              <Tooltip content={<BarTooltipContent />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="wMAPE" radius={[4, 4, 0, 0]} maxBarSize={48} name="wMAPE">
                {wMAPEBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MODEL_COLORS[entry.model] ?? "#378ADD"} fillOpacity={TOP_MODELS.has(entry.model) ? 1 : 0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="inline-block w-8 h-0 border-t-2 border-dashed border-emerald-500" />
            <span className="text-xs text-muted-foreground">Top 3 models (xgb, lgbm, ensemble) achieve ~10% wMAPE</span>
          </div>
        </GlassCard>
      </div>


      {/* ── Model Deep-Dive ─────────────────────────────────────────────────── */}
      <GlassCard className="p-5" delay={0.4}>
        {/* Header + dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-semibold text-sm">Model Deep-Dive</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Feature importance and actual vs predicted for the selected model
            </p>
          </div>
          <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium block">Select Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[160px]"
                style={{ borderLeft: `3px solid ${modelColor}` }}
              >
                {modelRankings.map(m => (
                  <option key={m.model} value={m.model}>
                    #{m.rank} {m.model}
                  </option>
                ))}
              </select>
            </div>
          <div className="flex items-center gap-3">
            {/* metric pills for selected model */}
            {modelInfo && (
              <div className="hidden sm:flex items-center gap-2">
                {[
                  { label: "MAE",       val: modelInfo.mae.toFixed(2) },
                  { label: "wMAPE",     val: modelInfo.wMAPE },
                  { label: "Fill Rate", val: modelInfo.fillRate },
                ].map(pill => (
                  <span
                    key={pill.label}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <span className="text-muted-foreground">{pill.label}</span>
                    <span className="font-semibold text-foreground">{pill.val}</span>
                  </span>
                ))}
              </div>
            )}
            {/* Dropdown */}
            
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Feature Importance for selected model */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: modelColor }} />
              Feature Importance — {selectedModel}
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={featureData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toFixed(2)}
                  domain={[0, 0.55]}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip content={<FeatureTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]} name="Importance" maxBarSize={20}>
                  {featureData.map((_, idx) => (
                    <Cell
                      key={`fi-${idx}`}
                      fill={modelColor}
                      fillOpacity={1 - idx * 0.07}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right — Actual vs Predicted scatter */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: modelColor }} />
              {selectedModel} — Actual vs Predicted (Test)
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 4, right: 16, bottom: 24, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 310]}
                  tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  name="Actual"
                >
                  <Label
                    value="Actual Quantity"
                    offset={-12}
                    position="insideBottom"
                    style={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  />
                </XAxis>
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 310]}
                  tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  name="Predicted"
                >
                  <Label
                    value="Predicted Quantity"
                    angle={-90}
                    position="insideLeft"
                    offset={16}
                    style={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                  />
                </YAxis>
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />

                {/* Perfect forecast diagonal */}
                <Scatter
                  name="Perfect forecast"
                  data={perfectLine}
                  line={{ stroke: "#FFD400", strokeWidth: 2, strokeDasharray: "8 5" }}
                  shape={() => null as any}
                  legendType="none"
                />

                {/* Actual data points */}
                <Scatter
                  name={selectedModel}
                  data={scatterData}
                  fill={modelColor}
                  fillOpacity={0.55}
                  shape={(props: any) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={3.5}
                      fill={modelColor}
                      fillOpacity={0.5}
                      stroke={modelColor}
                      strokeOpacity={0.8}
                      strokeWidth={0.5}
                    />
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Perfect forecast legend */}
            <div className="flex items-center gap-2 mt-2 px-1">
              <span className="inline-block w-8 h-0 border-t-2 border-dashed border-amber-400" />
              <span className="text-xs text-muted-foreground">Perfect forecast</span>
            </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPage;