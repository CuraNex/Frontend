import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { forecastData, pharmacies } from "@/data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value?.toLocaleString() ?? "—"}</span>
        </p>
      ))}
    </div>
  );
};

const ForecastPage = () => {
  const [pharmacy, setPharmacy] = useState("PH001");
  const [horizon, setHorizon] = useState("13");

  const weeks = parseInt(horizon);
  const sliced = forecastData.slice(0, weeks);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Forecast Explorer" description="Explore demand predictions with confidence intervals" />

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Pharmacy</label>
          <select value={pharmacy} onChange={(e) => setPharmacy(e.target.value)} className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary">
            {pharmacies.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
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
          <select value={horizon} onChange={(e) => setHorizon(e.target.value)} className="block bg-white/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary">
            <option value="4">1 Month (4 weeks)</option>
            <option value="13">1 Quarter (13 weeks)</option>
            <option value="52">1 Year (52 weeks)</option>
          </select>
        </div>
      </GlassCard>

      {/* Forecast Chart */}
      <GlassCard className="p-5" delay={0.1}>
        <h3 className="font-semibold text-sm mb-1">Probabilistic Forecast</h3>
        <p className="text-xs text-muted-foreground mb-4">P10 / P50 / P90 confidence bands</p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={sliced}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="p90" stroke="none" fill="hsl(245 58% 60% / 0.12)" name="P90" />
            <Area type="monotone" dataKey="p10" stroke="none" fill="#F1EEFF" name="P10" />
            <Line type="monotone" dataKey="p50" stroke="hsl(245 58% 60%)" strokeWidth={2.5} dot={false} name="P50 (Median)" />
            <Line type="monotone" dataKey="actual" stroke="hsl(280 60% 65%)" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Predicted Quantities Table */}
      <GlassCard className="p-5" delay={0.2}>
        <h3 className="font-semibold text-sm mb-4">Predicted Order Quantities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Week</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">P10</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">P50</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">P90</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Actual</th>
              </tr>
            </thead>
            <tbody>
              {sliced.slice(0, 10).map((row) => (
                <tr key={row.week} className="border-b border-border/50 hover:bg-white/40 transition-colors">
                  <td className="py-2 px-3 font-medium">{row.week}</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{row.p10}</td>
                  <td className="py-2 px-3 text-right font-semibold text-primary">{row.p50}</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{row.p90}</td>
                  <td className="py-2 px-3 text-right">{row.actual ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default ForecastPage;
