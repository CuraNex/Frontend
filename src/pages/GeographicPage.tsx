import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { districtDemandData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GeographicPage = () => {
  const sorted = [...districtDemandData].sort((a, b) => b.demand - a.demand);
  const maxDemand = sorted[0]?.demand || 1;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Geographic Insights" description="District-level demand analysis across Sri Lanka" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual map representation */}
        <GlassCard className="p-5" delay={0.1}>
          <h3 className="font-semibold text-sm mb-4">District Demand Heatmap</h3>
          <div className="space-y-2">
            {sorted.map((d) => {
              const pct = (d.demand / maxDemand) * 100;
              return (
                <div key={d.district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{d.district}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        d.risk === "high" ? "bg-destructive/15 text-destructive" :
                        d.risk === "medium" ? "bg-warning/15 text-warning" :
                        "bg-success/15 text-success"
                      }`}>{d.risk}</span>
                      <span className="text-muted-foreground">{(d.demand / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={0.15}>
          <h3 className="font-semibold text-sm mb-4">Demand Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sorted} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="district" tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }} tickLine={false} axisLine={false} width={100} />
              <Tooltip />
              <Bar dataKey="demand" fill="hsl(168 80% 50%)" radius={[0, 4, 4, 0]} name="Demand" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

export default GeographicPage;
