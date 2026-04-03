import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
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
import { fetchForecastFilters, fetchForecastTimeseries, type ForecastFilters, type ForecastTimeseries } from "@/lib/api";

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

const ForecastPage = () => {
  const [filters, setFilters] = useState<ForecastFilters | null>(null);
  const [tsData, setTsData] = useState<ForecastTimeseries | null>(null);
  const [loading, setLoading] = useState(true);

  const [retailer, setRetailer] = useState("All");
  const [sku, setSku] = useState("All");
  const [category, setCategory] = useState("All");
  const [horizon, setHorizon] = useState("4");

  // Load filters once
  useEffect(() => {
    fetchForecastFilters()
      .then(setFilters)
      .catch(console.error);
  }, []);

  // Fetch time series whenever filters change
  useEffect(() => {
    setLoading(true);
    fetchForecastTimeseries(retailer, sku, category)
      .then(setTsData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [retailer, sku, category]);

  // Apply horizon filter to future data
  const futureChartData = useMemo(() => {
    if (!tsData) return [];
    const horizonWeeks = parseInt(horizon);
    return tsData.futureData.slice(0, horizonWeeks + 1); // +1 for bridge point
  }, [tsData, horizon]);

  if (!filters && loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Forecast Explorer" description="Explore demand predictions with confidence intervals" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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
            value={retailer}
            onChange={(e) => setRetailer(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All pharmacies</option>
            {filters?.retailers.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
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
            <option value="All">All categories</option>
            {filters?.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Drug (SKU)</label>
          <select
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All SKUs</option>
            {filters?.skus.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Time Horizon</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="1">1 Week</option>
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
            <option value="4">1 Month</option>
          </select>
        </div>
      </GlassCard>

      <p className="text-sm text-muted-foreground -mt-3 px-1">
        {loading ? "Loading..." : `Showing ${tsData?.recordsCount?.toLocaleString() ?? 0} records`}
      </p>

      {tsData && (
        <>
          {/*  Demand Time Series Chart */}
          <GlassCard className="p-5" delay={0.1}>
            <h3 className="font-semibold text-sm mb-3"> Demand Time Series</h3>
            <CustomLegend
              items={[
                { color: "#00C2FF", label: "Actual Demand" },
                { color: "#ff5c5c", label: "SNaïve Baseline", dashed: true },
                { color: "#00E096", label: "Historical Validation Forecast", dashed: true },
              ]}
            />
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart
                data={tsData.chartData}
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
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="naive"
                  stroke="#ff5c5c"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  name="SNaïve Baseline"
                  connectNulls
                />
                <Line
                  type="linear"
                  dataKey="validationForecast"
                  stroke="#00E096"
                  strokeWidth={2.5}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Historical Validation Forecast"
                  connectNulls
                />
                <Line
                  type="linear"
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
              Forecast Estimate for {horizon === "4" ? "1 Month" : `${horizon} Week${horizon === "1" ? "" : "s"}`}
            </p>
            <CustomLegend
              items={[{ color: "#00E096", label: "Future Extrapolation (4 Weeks)" }]}
            />
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                data={futureChartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00E096" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00E096" stopOpacity={0.02} />
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
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="linear"
                  dataKey="futureExtrapolation"
                  stroke="#00E096"
                  strokeWidth={2.75}
                  fill="url(#futureGradient)"
                  fillOpacity={1}
                  dot={false}
                  name="Future Extrapolation (4 Weeks)"
                  connectNulls={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Summary Statistics + Order Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Summary Statistics Table */}
            <GlassCard className="p-5" delay={0.2}>
              <div className="flex items-center gap-2 mb-4">
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
                    {tsData.summaryStats.map((row, i) => (
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
                <h3 className="font-semibold text-sm">Order Distribution</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 ml-6">
                Frequency by quantity ordered
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={tsData.orderDistribution}
                  margin={{ top: 4, right: 8, left: 0, bottom: 20 }}
                  barCategoryGap="10%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(240 10% 88%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="bin"
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
                  <Bar dataKey="count" name="Frequency" radius={[3, 3, 0, 0]}>
                    {tsData.orderDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.count >= 200
                            ? "#378ADD"
                            : entry.count >= 100
                            ? "#5DA0E8"
                            : entry.count >= 50
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
        </>
      )}
    </div>
  );
};

export default ForecastPage;