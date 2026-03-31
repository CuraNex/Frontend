import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { modelMetrics, featureImportance } from "@/data/mockData";
import { Brain, Target, TrendingDown, Gauge } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const AdminPage = () => {
  const best = modelMetrics[0];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Model Insights" description="Machine learning model performance and diagnostics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Best Model" value={best.model} icon={Brain} delay={0} />
        <KpiCard title="MAPE" value={`${best.mape}%`} icon={Target} iconColor="bg-success/15 text-success" delay={0.05} />
        <KpiCard title="RMSE" value={best.rmse} icon={TrendingDown} iconColor="bg-accent text-accent-foreground" delay={0.1} />
        <KpiCard title="Accuracy" value={`${best.accuracy}%`} icon={Gauge} iconColor="bg-info/15 text-info" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model comparison */}
        <GlassCard className="p-5" delay={0.2}>
          <h3 className="font-semibold text-sm mb-4">Model Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Model","MAPE (%)","RMSE","Bias","Accuracy (%)"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelMetrics.map((m, i) => (
                  <tr key={m.model} className={`border-b border-border/50 ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="py-2.5 px-3 font-semibold">{m.model} {i === 0 && <span className="text-[10px] text-primary ml-1">★ Best</span>}</td>
                    <td className="py-2.5 px-3">{m.mape}</td>
                    <td className="py-2.5 px-3">{m.rmse}</td>
                    <td className="py-2.5 px-3">{m.bias}</td>
                    <td className="py-2.5 px-3 font-semibold text-primary">{m.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Feature Importance */}
        <GlassCard className="p-5" delay={0.25}>
          <h3 className="font-semibold text-sm mb-4">Feature Importance (SHAP-like)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} width={140} />
              <Tooltip />
              <Bar dataKey="importance" fill="hsl(280 60% 65%)" radius={[0, 6, 6, 0]} name="Importance" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminPage;
