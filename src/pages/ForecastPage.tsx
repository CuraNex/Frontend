import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { forecastData, pharmacies } from "@/data/mockData";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1 bg-white/90 border border-border rounded-lg shadow-sm">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((entry: any, i: number) =>
        entry.value != null ? (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-semibold">
              {entry.value?.toLocaleString() ?? "—"}
            </span>
          </p>
        ) : null
      )}
    </div>
  );
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="text-muted-foreground">Qty: <span className="font-semibold text-foreground">{label}</span></p>
      <p className="text-[#378ADD]">Frequency: <span className="font-semibold">{payload[0]?.value}</span></p>
    </div>
  );
};

const CustomLegend = ({
  items,
}: {
  items: { color: string; label: string; dashed?: boolean }[];
}) => (
  <div className="flex flex-wrap gap-4 mb-4">
    {items.map((item) => (
      <span
        key={item.label}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 0,
            borderTop: item.dashed
              ? `2.5px dashed ${item.color}`
              : `2.5px solid ${item.color}`,
          }}
        />
        {item.label}
      </span>
    ))}
  </div>
);

// Mocked order distribution histogram data
const orderDistributionData = [
  { qty: 1,  freq: 235 },
  { qty: 2,  freq: 260 },
  { qty: 3,  freq: 248 },
  { qty: 4,  freq: 195 },
  { qty: 5,  freq: 148 },
  { qty: 6,  freq: 102 },
  { qty: 7,  freq: 78 },
  { qty: 8,  freq: 60 },
  { qty: 9,  freq: 45 },
  { qty: 10, freq: 35 },
  { qty: 11, freq: 28 },
  { qty: 12, freq: 22 },
  { qty: 13, freq: 18 },
  { qty: 14, freq: 15 },
  { qty: 15, freq: 12 },
  { qty: 16, freq: 10 },
  { qty: 17, freq: 9 },
  { qty: 18, freq: 8 },
  { qty: 19, freq: 6 },
  { qty: 20, freq: 8 },
  { qty: 21, freq: 5 },
  { qty: 22, freq: 4 },
  { qty: 23, freq: 3 },
  { qty: 24, freq: 3 },
  { qty: 25, freq: 4 },
  { qty: 26, freq: 2 },
  { qty: 27, freq: 2 },
  { qty: 28, freq: 1 },
  { qty: 29, freq: 1 },
  { qty: 30, freq: 1 },
  { qty: 31, freq: 1 },
  { qty: 32, freq: 3 },
];

const summaryStats = [
  { metric: "Mean",   value: "5.6" },
  { metric: "Median", value: "4.0" },
  { metric: "Std Dev",value: "5.1" },
  { metric: "Min",    value: "1" },
  { metric: "Max",    value: "32" },
  { metric: "Total",  value: "9,451" },
];

const ForecastPage = () => {
  const [pharmacy, setPharmacy] = useState("PH001");
  const [category, setCategory] = useState("all");
  const [horizon, setHorizon] = useState("13");

  const weeks = parseInt(horizon);
  const sliced = forecastData.slice(0, weeks);

  const recordsCount = 11028;

  const chartData = sliced.map((d, i) => {
    const p50 = d.p50;
    const naive = i === 0 ? p50 : sliced[i - 1]?.p50;
    const ensemble = Math.round(p50 * 0.7 + (naive ?? p50) * 0.3);
    return {
      ...d,
      naive,
      ensemble,
      bandLow: d.p10,
      bandHigh: d.p90,
      futurePredicted: d.actual == null ? d.p50 : null,
    };
  });

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader
        title="Forecast Explorer"
        description="Explore demand predictions with confidence intervals"
      />

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Pharmacy</label>
          <select
            value={pharmacy}
            onChange={(e) => setPharmacy(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            {pharmacies.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Therapeutic Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All categories</option>
            <option value="analgesic">Analgesic</option>
            <option value="antibiotic">Antibiotic</option>
            <option value="antidiabetic">Antidiabetic</option>
            <option value="gi">GI</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="antihistamine">Antihistamine</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Drug (SKU)</label>
          <select className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary">
            <option>Paracetamol 500mg</option>
            <option>Amoxicillin 250mg</option>
            <option>Metformin 500mg</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Time Horizon</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="4">1 Month (4 weeks)</option>
            <option value="13">1 Quarter (13 weeks)</option>
            <option value="52">1 Year (52 weeks)</option>
          </select>
        </div>
      </GlassCard>

      <p className="text-sm text-muted-foreground -mt-3 px-1">
        Showing {recordsCount.toLocaleString()} records
      </p>

      {/* Probabilistic Forecast Chart */}
      <GlassCard className="p-5" delay={0.1}>
        <h3 className="font-semibold text-sm mb-1">Probabilistic Forecast</h3>
        <p className="text-xs text-muted-foreground mb-4">
          P10 / P50 / P90 confidence bands
        </p>
        <CustomLegend
          items={[
        
            { color: "#00C2FF", label: "Actual Demand" },
            { color: "#ff5c5c", label: "SNaïve Baseline", dashed: true },
            { color: "#FFD400", label: "AI Ensemble Forecast", dashed: true },
          ]}
        />
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="bandHigh"
              stroke="none"
              fill="url(#bandGradient)"
              fillOpacity={1}
              legendType="none"
              name="P90"
              isAnimationActive={false}
              activeDot={false}
            />
           
            <Line
              type="monotone"
              dataKey="naive"
              stroke="#ff5c5c"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              name="SNaïve Baseline"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="ensemble"
              stroke="#FFD400"
              strokeWidth={2.5}
              strokeDasharray="3 3"
              dot={false}
              name="AI Ensemble Forecast"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#00C2FF"
              strokeWidth={2.75}
              dot={false}
              name="Actual Demand"
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Predicted Demand (Future Only) Chart */}
      <GlassCard className="p-5" delay={0.15}>
        <h3 className="font-semibold text-sm mb-1">Predicted Demand (Future Only)</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Shows median forecast for weeks without actuals
        </p>
        <CustomLegend
          items={[{ color: "#1D9E75", label: "Predicted (P50)" }]}
        />
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="futurePredicted"
              stroke="#1D9E75"
              strokeWidth={2.75}
              fill="url(#futureGradient)"
              fillOpacity={1}
              dot={false}
              name="Predicted (P50)"
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Summary Statistics + Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Summary Statistics Table */}
        <GlassCard className="p-5" delay={0.2}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">📊</span>
            <h3 className="font-semibold text-sm">Summary Statistics</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Metric
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryStats.map((row, i) => (
                  <tr
                    key={row.metric}
                    className={`
                      border-b border-border/40 last:border-0 transition-colors
                      hover:bg-primary/5
                      ${i % 2 === 0 ? "bg-white/30" : "bg-white/10"}
                    `}
                  >
                    <td className="py-3 px-4 text-muted-foreground font-medium text-sm">
                      {row.metric}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`
                          font-semibold text-sm
                          ${row.metric === "Total"
                            ? "text-primary"
                            : row.metric === "Max"
                            ? "text-rose-500"
                            : row.metric === "Min"
                            ? "text-emerald-500"
                            : "text-foreground"
                          }
                        `}
                      >
                        {row.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
         
        </GlassCard>

        {/* Order Distribution Bar Chart */}
        <GlassCard className="p-5" delay={0.25}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📦</span>
            <h3 className="font-semibold text-sm">Order Distribution</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-6">
            Frequency by quantity ordered
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={orderDistributionData}
              margin={{ top: 4, right: 8, left: 0, bottom: 20 }}
              barCategoryGap="10%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(240 10% 88%)"
                vertical={false}
              />
              <XAxis
                dataKey="qty"
                tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                tickLine={false}
                axisLine={false}
                interval={4}
                label={{
                  value: "Quantity Ordered",
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 11,
                  fill: "hsl(230 10% 46%)",
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Frequency",
                  angle: -90,
                  position: "insideLeft",
                  offset: 12,
                  fontSize: 11,
                  fill: "hsl(230 10% 46%)",
                }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(55,138,221,0.08)" }} />
              <Bar dataKey="freq" name="Frequency" radius={[3, 3, 0, 0]}>
                {orderDistributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.freq >= 200
                        ? "#378ADD"
                        : entry.freq >= 100
                        ? "#5DA0E8"
                        : entry.freq >= 50
                        ? "#85B7EB"
                        : "#B5D4F4"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

      </div>
    </div>
  );
};

export default ForecastPage;