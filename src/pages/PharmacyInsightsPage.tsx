import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { Building2, ShoppingCart, Star, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchPharmacyTop5, fetchPharmacyDetails, type PharmacySummary, type PharmacyDetails } from "@/lib/api";

const PharmacyInsightsPage = () => {
  const [pharmacies, setPharmacies] = useState<PharmacySummary[]>([]);
  const [selected, setSelected] = useState<PharmacySummary | null>(null);
  const [details, setDetails] = useState<PharmacyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacyTop5()
      .then((list) => {
        setPharmacies(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setDetails(null);
    fetchPharmacyDetails(selected.id)
      .then(setDetails)
      .catch(console.error);
  }, [selected]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Pharmacy Insights" description="Individual pharmacy profiles and AI-driven insights" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader title="Pharmacy Insights" description="Individual pharmacy profiles and AI-driven insights" />

      {/* Pharmacy selector */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {pharmacies.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selected?.id === p.id ? "gradient-primary text-white shadow-md" : "bg-white/60 text-muted-foreground hover:bg-white/80"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Profile KPIs */}
      {details && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Type" value={details.info.type} icon={Building2} delay={0.05} />
            <KpiCard title="Tier" value={`Tier ${details.info.tier}`} icon={Star} iconColor="bg-warning/15 text-warning" delay={0.1} />
            <KpiCard title="Order Frequency" value={details.orderFreq} icon={ShoppingCart} iconColor="bg-accent text-accent-foreground" delay={0.15} />
            <KpiCard title="District" value={details.info.district} icon={Building2} iconColor="bg-info/15 text-info" delay={0.2} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Demand Trend */}
            <GlassCard className="lg:col-span-2 p-5" delay={0.25}>
              <h3 className="font-semibold text-sm mb-4">Demand Trend - {details.info.name}</h3>
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
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={details.demandTrend}>
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

            {/* AI Insights */}
            <GlassCard className="p-5" delay={0.3}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {details.insights.map((insight, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/50 border border-border/50">
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};

export default PharmacyInsightsPage;
