import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { GlassCard } from "@/components/GlassCard";
import { Building2, Package, Target, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import pharmacyBuilding from "@/assets/pharmecybuilding.png";
import capsule from "@/assets/capsule.png";
import targetImg from "@/assets/target.png";
import warningImg from "@/assets/warning image.png";
import { fetchDashboardOverview, type DashboardOverview } from "@/lib/api";

import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ['#7A59FF', '#977EFF', '#80B3FF'];

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

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const RADIAN = Math.PI / 180;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${value}%`}
    </text>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverview()
      .then(setData)
      .catch((e) => console.error("Dashboard fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Dashboard" description="Real-time pharmaceutical demand forecasting overview" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Dashboard" description="Real-time pharmaceutical demand forecasting overview" />
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load dashboard data. Ensure the API server is running.</p>
        </GlassCard>
      </div>
    );
  }

  const kpi = data.kpi;
  const retailerTypeData = data.retailerTypeData.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <PageHeader title="Dashboard" description="Real-time pharmaceutical demand forecasting overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="TOTAL PHARMACIES"
          value={kpi.totalPharmacies.toLocaleString()}
          change=""
          changeType="positive"
          icon={Building2}
          imageSrc={pharmacyBuilding}
          imageAlt="Pharmacy"
          delay={0}
        />
        <KpiCard
          title="TOTAL SKUS"
          value={kpi.totalSKUs.toLocaleString()}
          change=""
          changeType="positive"
          icon={Package}
          imageSrc={capsule}
          imageAlt="Capsule"
          delay={0.05}
        />
        <KpiCard
          title="FORECAST ACCURACY"
          value={`${kpi.forecastAccuracy}%`}
          change=""
          changeType="positive"
          icon={Target}
          imageSrc={targetImg}
          imageAlt="Target"
          delay={0.1}
        />
        <KpiCard
          title="STOCKOUT RISK"
          value={`${kpi.stockoutRisk}%`}
          change=""
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
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">Weekly Demand Trend</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span style={{ display: "inline-block", width: 22, height: 0, borderTop: "2.5px solid #3b82f6" }} />
              Historical Demand
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ display: "inline-block", width: 22, height: 0, borderTop: "2.5px solid #00E096" }} />
              Future Projection (4 Weeks)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data.weeklyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 88%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }}
                tickLine={false}
                axisLine={false}
                interval={12}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(v: number) => v.toLocaleString()}
              />
              {/* Historical Demand — blue filled area */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#historicalGrad)"
                dot={false}
                name="Historical Demand"
                connectNulls={false}
              />
              {/* Future Projection — solid green line */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#00E096"
                strokeWidth={2.5}
                dot={false}
                name="Future Projection (4 Weeks)"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Top Drugs */}
        <GlassCard className="p-5" delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Top Demanded Drugs</h3>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {data.topDrugs.slice(0, 6).map((drug, i) => (
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
          <h3 className="font-semibold text-sm mb-4">Demand by Retailer Type</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={retailerTypeData}
                cx="45%"
                cy="50%"
                innerRadius={55}
                outerRadius={130}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {retailerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                itemStyle={{ color: "hsl(240 6% 25%)", fontWeight: 600 }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend verticalAlign="middle" align="right" layout="vertical" iconType="square" wrapperStyle={{ fontSize: '11px', color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={0.35}>
          <h3 className="font-semibold text-sm mb-4">Demand by Therapeutic Category</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} width={110} />
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
