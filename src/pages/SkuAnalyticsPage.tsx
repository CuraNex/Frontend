import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { skuDetails, demandOverTimeData } from "@/data/mockData";
import { Pill, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const seasonalityData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  demand: Math.round(600 + Math.sin((i - 2) / 2) * 300 + Math.random() * 80),
}));

const SkuAnalyticsPage = () => {
  const [selected, setSelected] = useState(skuDetails[0]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="SKU Analytics" description="Drug-level analytics and risk assessment" />

      {/* SKU Table */}
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["SKU","Name","Category","Price","Shelf Life","Expiry Risk","Stockout Risk"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skuDetails.map((sku) => (
                <tr
                  key={sku.sku}
                  onClick={() => setSelected(sku)}
                  className={`border-b border-border/50 cursor-pointer transition-colors ${
                    selected.sku === sku.sku ? "bg-primary/5" : "hover:bg-white/40"
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono text-xs">{sku.sku}</td>
                  <td className="py-2.5 px-3 font-medium">{sku.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{sku.category}</td>
                  <td className="py-2.5 px-3">{sku.price}</td>
                  <td className="py-2.5 px-3">{sku.shelfLife}</td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={sku.expiryRisk} />
                  </td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={sku.stockoutRisk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5" delay={0.1}>
          <h3 className="font-semibold text-sm mb-4">Demand Trend — {selected.name}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={demandOverTimeData.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="hsl(245 58% 60%)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={0.15}>
          <h3 className="font-semibold text-sm mb-4">Seasonality Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={seasonalityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="demand" fill="hsl(280 60% 65%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

const RiskBadge = ({ level }: { level: string }) => {
  const colors = {
    Low: "bg-success/15 text-success",
    Medium: "bg-warning/15 text-warning",
    High: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${colors[level as keyof typeof colors] || ""}`}>
      {level}
    </span>
  );
};

export default SkuAnalyticsPage;
