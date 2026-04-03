import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { alerts } from "@/data/mockData";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Config ──────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { color: "bg-destructive/15 text-destructive border-destructive/20", icon: AlertTriangle },
  high:     { color: "bg-warning/15 text-warning border-warning/20",             icon: AlertCircle },
  medium:   { color: "bg-info/15 text-info border-info/20",                      icon: AlertCircle },
  low:      { color: "bg-muted text-muted-foreground border-border",             icon: AlertCircle },
};

const typeLabels: Record<string, string> = {
  stockout:  "Stockout",
  overstock: "Overstock",
  anomaly:   "Anomaly",
};

// ─── Mock anomaly table data ──────────────────────────────────────────────────

const anomalousOrders = [
  { date: "2024-12-02 00:00:00", retailer_id: 3389,  sku_id: "M010882", qty: 4,  pair_mean: 1.2, z_score: 5.02 },
  { date: "2024-08-12 00:00:00", retailer_id: 12939, sku_id: "M012706", qty: 4,  pair_mean: 1.2, z_score: 4.93 },
  { date: "2025-04-07 00:00:00", retailer_id: 9424,  sku_id: "M009518", qty: 11, pair_mean: 4.0, z_score: 4.99 },
  { date: "2024-04-15 00:00:00", retailer_id: 2818,  sku_id: "M013459", qty: 12, pair_mean: 4.9, z_score: 4.84 },
  { date: "2025-05-12 00:00:00", retailer_id: 12472, sku_id: "M009072", qty: 15, pair_mean: 6.1, z_score: 4.87 },
  { date: "2024-04-15 00:00:00", retailer_id: 12025, sku_id: "M009651", qty: 18, pair_mean: 6.8, z_score: 5.46 },
  { date: "2024-04-15 00:00:00", retailer_id: 4174,  sku_id: "M010208", qty: 19, pair_mean: 7.2, z_score: 5.00 },
  { date: "2025-04-07 00:00:00", retailer_id: 1870,  sku_id: "M009594", qty: 19, pair_mean: 8.2, z_score: 4.87 },
  { date: "2025-04-14 00:00:00", retailer_id: 6910,  sku_id: "M010253", qty: 20, pair_mean: 8.7, z_score: 5.34 },
  { date: "2025-04-07 00:00:00", retailer_id: 2499,  sku_id: "M013459", qty: 20, pair_mean: 9.2, z_score: 5.05 },
  { date: "2024-04-15 00:00:00", retailer_id: 12025, sku_id: "M009651", qty: 18, pair_mean: 6.8, z_score: 5.46 },
  { date: "2024-04-15 00:00:00", retailer_id: 4174,  sku_id: "M010208", qty: 19, pair_mean: 7.2, z_score: 5.00 },
  { date: "2025-04-07 00:00:00", retailer_id: 1870,  sku_id: "M009594", qty: 19, pair_mean: 8.2, z_score: 4.87 },
  { date: "2025-04-14 00:00:00", retailer_id: 6910,  sku_id: "M010253", qty: 20, pair_mean: 8.7, z_score: 5.34 },
  { date: "2025-04-07 00:00:00", retailer_id: 2499,  sku_id: "M013459", qty: 20, pair_mean: 9.2, z_score: 5.05 },
  { date: "2024-04-15 00:00:00", retailer_id: 12025, sku_id: "M009651", qty: 18, pair_mean: 6.8, z_score: 5.46 },
  { date: "2024-04-15 00:00:00", retailer_id: 4174,  sku_id: "M010208", qty: 19, pair_mean: 7.2, z_score: 5.00 },
  { date: "2025-04-07 00:00:00", retailer_id: 1870,  sku_id: "M009594", qty: 19, pair_mean: 8.2, z_score: 4.87 },
  { date: "2025-04-14 00:00:00", retailer_id: 6910,  sku_id: "M010253", qty: 20, pair_mean: 8.7, z_score: 5.34 },
  { date: "2025-04-07 00:00:00", retailer_id: 2499,  sku_id: "M013459", qty: 20, pair_mean: 9.2, z_score: 5.05 },
];

// ─── Anomaly timeline data (monthly bins) ────────────────────────────────────

const timelineData = [
  { month: "Jan 2024", count: 8  },
  { month: "Feb 2024", count: 18 },
  { month: "Mar 2024", count: 52 },
  { month: "Apr 2024", count: 355},
  { month: "May 2024", count: 318},
  { month: "Jun 2024", count: 125},
  { month: "Jul 2024", count: 104},
  { month: "Aug 2024", count: 38 },
  { month: "Sep 2024", count: 5  },
  { month: "Oct 2024", count: 3  },
  { month: "Nov 2024", count: 6  },
  { month: "Dec 2024", count: 12 },
  { month: "Jan 2025", count: 15 },
  { month: "Feb 2025", count: 22 },
  { month: "Mar 2025", count: 38 },
  { month: "Apr 2025", count: 389},
  { month: "May 2025", count: 328},
  { month: "Jun 2025", count: 115},
  { month: "Jul 2025", count: 108},
  { month: "Aug 2025", count: 32 },
  { month: "Sep 2025", count: 8  },
  { month: "Oct 2025", count: 4  },
  { month: "Nov 2025", count: 7  },
  { month: "Dec 2025", count: 14 },
];

const recommendations = [
  { drug: "Amoxicillin 250mg",  action: "Reorder 5,000 units",              pharmacy: "Jaffna Health Pharmacy",       priority: "Urgent" },
  { drug: "Metformin 500mg",    action: "Reorder 2,000 units",              pharmacy: "Kandy General Pharmacy",       priority: "High"   },
  { drug: "Cetirizine 10mg",    action: "Redistribute 3,000 units to Galle",pharmacy: "City Pharmacy Colombo",        priority: "Medium" },
  { drug: "Paracetamol 500mg",  action: "Investigate demand spike",         pharmacy: "National Hospital Pharmacy",   priority: "High"   },
];

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
  const [sortQty, setSortQty] = useState<"asc" | "desc">("asc");

  const sortedOrders = [...anomalousOrders].sort((a, b) =>
    sortQty === "asc" ? a.qty - b.qty : b.qty - a.qty
  );

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader
        title="Anomaly Detection & Alerts"
        description="Flag unusual ordering patterns for investigation"
      />

      {/* Active Alerts + Recommendations */}
    
      {/* ── Anomaly Detection Section ─────────────────────────────────────── */}

      {/* Section title */}
      

      {/* Anomalous Orders Detected header */}
      <div className="flex items-center gap-2">
        <span className="text-base">🔍</span>
        <h3 className="text-sm font-semibold text-foreground">Anomalous Orders Detected</h3>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-2">
        <GlassCard className="p-6 text-center" delay={0.05}>
          <p className="text-4xl font-bold text-cyan-400 mb-2">2,961</p>
          <p className="text-sm text-muted-foreground">Anomalies Detected</p>
          <p className="text-sm font-semibold text-cyan-500 mt-1">out of 493,195 orders</p>
        </GlassCard>
        <GlassCard className="p-6 text-center" delay={0.1}>
          <p className="text-4xl font-bold text-cyan-400 mb-2">0.60%</p>
          <p className="text-sm text-muted-foreground">Anomaly Rate</p>
        </GlassCard>
      </div>

      {/* Anomalous orders table */}
      <GlassCard className="p-0 overflow-hidden" delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
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
                        color: row.z_score >= 5.3 ? "#ff5c5c" : "#ff8fa3",
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
            data={timelineData}
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
              {timelineData.map((entry, index) => (
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