import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fetchAnomalies, type AnomalyData } from "@/lib/api";

// ─── Tooltip ─────────────────────────────────────────────────────────────────

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-2 text-xs bg-white/95 border border-border rounded-lg shadow-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p style={{ color: "#ff5c7a" }}>
        Anomalies: <span className="font-semibold">{payload[0]?.value}</span>
      </p>
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const AlertsPage = () => {
  const [data, setData] = useState<AnomalyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortQty, setSortQty] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchAnomalies()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Anomaly Detection & Alerts" description="Flag unusual ordering patterns for investigation" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Anomaly Detection & Alerts" description="Flag unusual ordering patterns for investigation" />
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load anomaly data. Ensure the API server is running.</p>
        </GlassCard>
      </div>
    );
  }

  const sortedOrders = [...data.tableRows].sort((a, b) =>
    sortQty === "asc" ? a.qty - b.qty : b.qty - a.qty
  );

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader
        title="Anomaly Detection & Alerts"
        description="Flag unusual ordering patterns for investigation"
      />

      {/* Anomalous Orders Detected header */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">Anomalous Orders Detected</h3>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-2">
        <GlassCard className="p-6 text-center" delay={0.05}>
          <p className="text-4xl font-bold text-foreground mb-2">{data.anomalyCount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Anomalies Detected</p>
          <p className="text-sm font-semibold text-muted-foreground mt-1">out of {data.totalOrders.toLocaleString()} orders</p>
        </GlassCard>
        <GlassCard className="p-6 text-center" delay={0.1}>
          <p className="text-4xl font-bold text-foreground mb-2">{data.anomalyRate}%</p>
          <p className="text-sm text-muted-foreground">Anomaly Rate</p>
        </GlassCard>
      </div>

      {/* Anomalous orders table */}
      <GlassCard className="p-0 overflow-hidden" delay={0.15}>
        <div className="max-h-[400px] overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">date</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">retailer_id</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">sku_id</th>
                <th
                  className="text-right py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => setSortQty(s => s === "asc" ? "desc" : "asc")}
                >
                  <span className="flex items-center justify-end gap-1">
                    {sortQty === "asc" ? "↑" : "↓"} quantity_ordered
                  </span>
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">pair_mean</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">z_score</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 last:border-0 hover:bg-white/20 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-muted-foreground tabular-nums">{row.date}</td>
                  <td className="py-3 px-4 text-sm text-right tabular-nums">{row.retailer_id.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{row.sku_id}</td>
                  <td className="py-3 px-4 text-sm text-right tabular-nums font-medium text-foreground">{row.qty}</td>
                  <td className="py-3 px-4 text-sm text-right tabular-nums text-muted-foreground">{row.pair_mean}</td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span
                      className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold"
                      style={{
                        background: row.z_score >= 5.3
                          ? "rgba(255,92,92,0.18)"
                          : "rgba(255,92,122,0.10)",
                        color: row.z_score >= 5.3 ? "#ff5c5c" : "#ff6883ff",
                      }}
                    >
                      {row.z_score.toFixed(2)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Anomaly Timeline */}
      <GlassCard className="p-5" delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📅</span>
          <h3 className="font-semibold text-sm">Anomaly Timeline</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data.timeline}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(240 10% 85%)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Anomaly Count",
                angle: -90,
                position: "insideLeft",
                offset: 12,
                style: { fontSize: 11, fill: "hsl(230 10% 46%)" },
              }}
            />
            <Tooltip content={<TimelineTooltip />} cursor={{ fill: "rgba(255,92,122,0.06)" }} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={18} name="Anomalies">
              {data.timeline.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#ff5c7a"
                  fillOpacity={entry.count >= 300 ? 1 : entry.count >= 100 ? 0.85 : entry.count >= 30 ? 0.65 : 0.45}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};

export default AlertsPage;