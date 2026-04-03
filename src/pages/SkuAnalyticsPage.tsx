import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { fetchSkuTop5, fetchSkuAnalytics, type SkuSummary, type SkuAnalytics } from "@/lib/api";

const SkuAnalyticsPage = () => {
  const [skus, setSkus] = useState<SkuSummary[]>([]);
  const [selected, setSelected] = useState<SkuSummary | null>(null);
  const [analytics, setAnalytics] = useState<SkuAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkuTop5()
      .then((list) => {
        setSkus(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setAnalytics(null);
    fetchSkuAnalytics(selected.sku)
      .then(setAnalytics)
      .catch(console.error);
  }, [selected]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="SKU Analytics" description="Drug-level analytics and risk assessment" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader title="SKU Analytics" description="Drug-level analytics and risk assessment" />

      {/* SKU Table */}
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["SKU","Name","Category","Dosage Form","Shelf Life","Avg Demand","Suggested Stock"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr
                  key={sku.sku}
                  onClick={() => setSelected(sku)}
                  className={`border-b border-border/50 cursor-pointer transition-colors ${
                    selected?.sku === sku.sku ? "bg-primary/5" : "hover:bg-white/40"
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono text-xs">{sku.sku}</td>
                  <td className="py-2.5 px-3 font-medium">{sku.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{sku.category}</td>
                  <td className="py-2.5 px-3 text-muted-foreground font-medium">{sku.dosageForm}</td>
                  <td className="py-2.5 px-3">{sku.shelfLife}</td>
                  <td className="py-2.5 px-3 font-semibold">{sku.avgDemand.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">{sku.suggestedStock.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Pill filter bar */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {skus.map((sku) => (
            <button
              key={sku.sku}
              onClick={() => setSelected(sku)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selected?.sku === sku.sku ? "gradient-primary text-white shadow-md" : "bg-white/60 text-muted-foreground hover:bg-white/80"
              }`}
            >
              {sku.name}
            </button>
          ))}
        </div>
      </GlassCard>

      {analytics && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard className="p-5" delay={0.1}>
            <h3 className="font-semibold text-sm mb-4">Demand Trend — {selected.name}</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-4 h-0.5 bg-[#4F46E5]" />
                Historical Demand
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-4 h-0.5 bg-[#00E096]" />
                Future Projection (4 Weeks)
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.demandTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Line type="linear" dataKey="demand" stroke="#4F46E5" strokeWidth={2.5} dot={false} connectNulls />
                <Line type="linear" dataKey="forecast" stroke="#00E096" strokeWidth={2.5} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-5" delay={0.15}>
            <h3 className="font-semibold text-sm mb-4">Seasonality Pattern</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.seasonality}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="demand" fill="#7B5AFE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default SkuAnalyticsPage;
