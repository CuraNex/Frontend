import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { GlassCard } from "@/components/GlassCard";
import { kpiData, demandOverTimeData, topDrugsData, districtDemandData } from "@/data/mockData";
import { Building2, Package, Target, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import pharmacyBuilding from "@/assets/pharmecybuilding.png";
import capsule from "@/assets/capsule.png";
import targetImg from "@/assets/target.png";
import warningImg from "@/assets/warning image.png";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader title="Dashboard" description="Real-time pharmaceutical demand forecasting overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="TOTAL PHARMACIES"
          value={kpiData.totalPharmacies.toLocaleString()}
          change="+12 this month"
          changeType="positive"
          icon={Building2}
          imageSrc={pharmacyBuilding}
          imageAlt="Pharmacy"
          delay={0}
        />
        <KpiCard
          title="TOTAL SKUS"
          value={kpiData.totalSKUs.toLocaleString()}
          change="+48 new"
          changeType="positive"
          icon={Package}
          imageSrc={capsule}
          imageAlt="Capsule"
          delay={0.05}
        />
        <KpiCard
          title="FORECAST ACCURACY"
          value={`${kpiData.forecastAccuracy}%`}
          change="+1.2% vs last month"
          changeType="positive"
          icon={Target}
          imageSrc={targetImg}
          imageAlt="Target"
          delay={0.1}
        />
        <KpiCard
          title="STOCKOUT RISK"
          value={`${kpiData.stockoutRisk}%`}
          change="-0.5% vs last month"
          changeType="negative"
          icon={AlertTriangle}
          imageSrc={warningImg}
          imageAlt="Warning"
          delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Demand Chart */}
        <GlassCard className="lg:col-span-2 p-5" delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Predicted vs Actual Demand</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={demandOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(245 58% 60%)" strokeWidth={2.5} dot={false} name="Predicted" />
              <Line type="monotone" dataKey="actual" stroke="hsl(280 60% 65%)" strokeWidth={2} dot={false} name="Actual" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Top Drugs */}
        <GlassCard className="p-5" delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Top Demanded Drugs</h3>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {topDrugsData.slice(0, 6).map((drug, i) => (
              <div key={drug.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{drug.name}</p>
                  <p className="text-xs text-muted-foreground">{drug.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{(drug.demand / 1000).toFixed(1)}k</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* District Map + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5" delay={0.3}>
          <h3 className="font-semibold text-sm mb-4">District Demand Heatmap</h3>
          <div className="grid grid-cols-2 gap-2">
            {districtDemandData.map((d) => (
              <div key={d.district} className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
                <div>
                  <p className="text-sm font-medium">{d.district}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    d.risk === "high" ? "bg-destructive/15 text-destructive" :
                    d.risk === "medium" ? "bg-warning/15 text-warning" :
                    "bg-success/15 text-success"
                  }`}>
                    {d.risk} risk
                  </span>
                </div>
                <p className="text-sm font-semibold">{(d.demand / 1000).toFixed(0)}k</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={0.35}>
          <h3 className="font-semibold text-sm mb-4">Demand by Drug Category</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topDrugsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" fill="hsl(245 58% 60%)" radius={[0, 6, 6, 0]} name="Demand" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
