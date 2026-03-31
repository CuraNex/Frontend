import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { pharmacies, demandOverTimeData } from "@/data/mockData";
import { Building2, ShoppingCart, Star, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PharmacyInsightsPage = () => {
  const [selected, setSelected] = useState(pharmacies[0]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Pharmacy Insights" description="Individual pharmacy profiles and AI-driven insights" />

      {/* Pharmacy selector */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {pharmacies.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selected.id === p.id ? "gradient-primary text-white shadow-md" : "bg-white/60 text-muted-foreground hover:bg-white/80"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Profile KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Type" value={selected.type} icon={Building2} delay={0.05} />
        <KpiCard title="Tier" value={`Tier ${selected.tier}`} icon={Star} iconColor="bg-warning/15 text-warning" delay={0.1} />
        <KpiCard title="Order Frequency" value={selected.orderFreq} icon={ShoppingCart} iconColor="bg-accent text-accent-foreground" delay={0.15} />
        <KpiCard title="District" value={selected.district} icon={Building2} iconColor="bg-info/15 text-info" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Demand Trend */}
        <GlassCard className="lg:col-span-2 p-5" delay={0.25}>
          <h3 className="font-semibold text-sm mb-4">Demand Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={demandOverTimeData.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="hsl(245 58% 60%)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="p-5" delay={0.3}>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              "This pharmacy has increasing demand due to seasonal trends in respiratory medications.",
              "Order frequency is consistent — consider automated reorder setup.",
              "Demand for antibiotics is 23% above district average, likely due to proximity to hospital.",
              "Recommended stock buffer increase of 15% for Q2.",
            ].map((insight, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/50 border border-border/50">
                <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PharmacyInsightsPage;
