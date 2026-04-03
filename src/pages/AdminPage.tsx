import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { Brain, Target, TrendingDown, Gauge } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  ScatterChart, Scatter, Label,
} from "recharts";
import {
  fetchModelEvaluation, fetchModelDeepDive,
  type ModelEvaluation, type ModelDeepDive, type ModelRanking,
} from "@/lib/api";

// ─── Colors ──────────────────────────────────────────────────────────────────

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

const AdminPage = () => {
  const [evalData, setEvalData] = useState<ModelEvaluation | null>(null);
  const [deepDive, setDeepDive] = useState<ModelDeepDive | null>(null);
  const [selectedModel, setSelectedModel] = useState("ensemble");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelEvaluation()
      .then(setEvalData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchModelDeepDive(selectedModel)
      .then(setDeepDive)
      .catch(console.error);
  }, [selectedModel]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Model Insights" description="Machine learning model performance and diagnostics" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!evalData) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Model Insights" description="Machine learning model performance and diagnostics" />
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load model evaluation data.</p>
        </GlassCard>
      </div>
    );
  }

  const kpi = evalData.kpi;
  const modelColor = MODEL_COLORS[selectedModel] ?? "#378ADD";
  const modelInfo = deepDive?.modelInfo;

  const perfectLine = [{ x: 0, y: 0 }, { x: 300, y: 300 }];

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader
        title="Model Insights"
        description="Machine learning model performance and diagnostics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Best Model" value={kpi.bestModel}  icon={Brain}        delay={0} />
        <KpiCard title="MAPE"       value={kpi.mape}       icon={Target}       iconColor="bg-success/15 text-success"      delay={0.05} />
        <KpiCard title="RMSE"       value={kpi.rmse}       icon={TrendingDown} iconColor="bg-accent text-accent-foreground" delay={0.1} />
        <KpiCard title="Fill Rate"  value={kpi.fillRate}   icon={Gauge}        iconColor="bg-info/15 text-info"            delay={0.15} />
      </div>

      {/* Model Ranking — full width */}
      <GlassCard className="p-5" delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
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
              {evalData.rankings.map((row, i) => (
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
            <h3 className="font-semibold text-sm">Multi-Metric Radar</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Normalised scores — higher = better for all axes</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {evalData.radarModels.map(m => (
              <span key={m} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-5 h-0 border-t-2" style={{ borderColor: MODEL_COLORS[m] ?? "#888" }} />
                {m}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart 
              data={evalData.radarData} 
              margin={{ top: 16, right: 32, bottom: 16, left: 32 }}
              startAngle={90}
            >
              <PolarGrid gridType="circle" stroke="hsl(230 15% 70%)" strokeWidth={0.5} />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 11, fill: "hsl(230 10% 40%)", fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 1]} 
                tickCount={6} 
                tick={{ fontSize: 9, fill: "hsl(230 10% 50%)" }} 
                axisLine={false}
                orientation="middle"
              />
              {evalData.radarModels.map((m) => (
                <Radar 
                  key={m} 
                  name={m} 
                  dataKey={m}
                  stroke={MODEL_COLORS[m] ?? "#888"} 
                  fill={MODEL_COLORS[m] ?? "#888"}
                  fillOpacity={m === evalData.rankings[0]?.model ? 0.25 : 0.06}
                  strokeWidth={m === evalData.rankings[0]?.model ? 2.5 : 1.2}
                  dot={m === evalData.rankings[0]?.model ? { r: 3, fillOpacity: 1 } : false}
                  animationDuration={1000}
                />
              ))}
              <Tooltip content={<RadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={0.3}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">wMAPE by Model</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Weighted Mean Absolute Percentage Error — lower is better</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={evalData.wmapeBar} margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" vertical={false} />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 45]} />
              <Tooltip content={<BarTooltipContent />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="wMAPE" radius={[4, 4, 0, 0]} maxBarSize={48} name="wMAPE">
                {evalData.wmapeBar.map((entry, index) => (
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
              {evalData.rankings
                .filter(m => m.model !== "seasonal_naive")
                .map(m => (
                <option key={m.model} value={m.model}>
                  {m.model}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            {modelInfo && (
              <div className="hidden sm:flex items-center gap-2">
                {[
                  { label: "MAE",       val: String(modelInfo.mae) },
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
          </div>
        </div>

        {/* Model Deep-Dive — Now single column focusing on Scatter Plot */}
        <div className="mt-8 space-y-6">          {/* Actual vs Predicted scatter — Full Width Focus */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2 px-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: modelColor }} />
              {selectedModel} — Actual vs Predicted (Validation Test Set)
            </p>
            {deepDive && deepDive.scatter.length > 0 ? (
              <div className="bg-white/10 rounded-2xl p-4 border border-border/30">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 16, right: 36, bottom: 32, left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" vertical={false} />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={[0, "auto"]}
                      tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                      tickLine={false}
                      axisLine={false}
                      name="Actual"
                    >
                      <Label
                        value="Actual Demand (Units)"
                        offset={-20}
                        position="insideBottom"
                        style={{ fontSize: 11, fill: "hsl(230 10% 46%)", fontWeight: 500 }}
                      />
                    </XAxis>
                    <YAxis
                      type="number"
                      dataKey="y"
                      domain={[0, "auto"]}
                      tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                      tickLine={false}
                      axisLine={false}
                      name="Predicted"
                    >
                      <Label
                        value="Predicted Demand (Units)"
                        angle={-90}
                        position="insideLeft"
                        offset={12}
                        style={{ fontSize: 11, fill: "hsl(230 10% 46%)", fontWeight: 500 }}
                      />
                    </YAxis>
                    <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />

                    {/* Perfect forecast diagonal */}
                    <Scatter
                      name="Perfect forecast"
                      data={perfectLine}
                      line={{ stroke: "hsl(var(--primary))", strokeWidth: 2, strokeDasharray: "8 5", opacity: 0.4 }}
                      shape={() => null as any}
                      legendType="none"
                    />

                    {/* Actual data points */}
                    <Scatter
                      name={selectedModel}
                      data={deepDive.scatter}
                      fill={modelColor}
                      fillOpacity={0.5}
                      shape={(props: any) => (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4.5}
                          fill={modelColor}
                          fillOpacity={0.6}
                          stroke={modelColor}
                          strokeWidth={0.5}
                          strokeOpacity={0.8}
                        />
                      )}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[320px] rounded-2xl border border-border/40 bg-white/20">
                <p className="text-sm text-muted-foreground">Scatter plot data not available for {selectedModel}</p>
              </div>
            )}
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPage;