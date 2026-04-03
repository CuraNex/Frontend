import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { ClipboardList, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const RecommendationsPage = () => {
  // Demo data (replace with API later)
  const recommendations = Array.from({ length: 22 }, (_, idx) => {
    const base = [
      { retailer_id: "National Hospital Pharmacy", sku_id: "Paracetamol 500mg", category: "Analgesic" },
      { retailer_id: "Jaffna Health Pharmacy", sku_id: "Amoxicillin 250mg", category: "Antibiotic" },
      { retailer_id: "City Pharmacy Colombo", sku_id: "Metformin 500mg", category: "Antidiabetic" },
      { retailer_id: "Kandy General Pharmacy", sku_id: "Omeprazole 20mg", category: "GI" },
      { retailer_id: "Galle Medical Center", sku_id: "Atorvastatin 10mg", category: "Cardiovascular" },
    ][idx % 5];

    const avg = Math.round(250 + Math.random() * 1200);
    const last = Math.round(avg * (0.8 + Math.random() * 0.2));
    const suggested = Math.round(avg * (1.08 + Math.random() * 0.25));
    const safety = Math.round(avg * (0.12 + Math.random() * 0.1));

    return {
      id: idx + 1,
      ...base,
      avg_recent_demand: avg,
      last_order_qty: last,
      suggested_qty: suggested,
      safety_stock: safety,
      is_critical: idx % 6 === 1,
    };
  });

  const categorySummary = [
    { category: "Antibiotic", suggested_qty: 69500 },
    { category: "Cardiovascular", suggested_qty: 16200 },
    { category: "Antihistamine", suggested_qty: 15100 },
    { category: "Antipyretic", suggested_qty: 9200 },
    { category: "Diabetes", suggested_qty: 8800 },
    { category: "Analgesic/NSAID", suggested_qty: 8600 },
    { category: "Gastrointestinal", suggested_qty: 7100 },
    { category: "Antileukotriene", suggested_qty: 2400 },
    { category: "Antifungal", suggested_qty: 2100 },
    { category: "Antiemetic", suggested_qty: 1500 },
    { category: "Respiratory", suggested_qty: 1300 },
    { category: "Neuropathic/Pain", suggested_qty: 900 },
    { category: "Immunomodulator", suggested_qty: 600 },
    { category: "Corticosteroid", suggested_qty: 400 },
  ];

  const top10 = recommendations.slice(0, 10);
  const rest = recommendations.slice(10);

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto">
      <PageHeader title="Pre-Staging Recommendations" description="AI-driven reorder suggestions for proactive inventory management" />

      {/* Top Reorder Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">Top Reorder Suggestions</span>
            <span className="text-xs text-muted-foreground">({recommendations.length} items)</span>
          </div>
        </div>

        {/* Compact cards (not full-width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <GlassCard className="p-5 md:max-w-[720px]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Top Reorder Suggestions</h3>
              </div>
              <span className="text-xs text-muted-foreground">Showing 10</span>
            </div>

            <div className="space-y-3">
              {top10.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-border/60 bg-white/35 backdrop-blur-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{rec.sku_id}</p>
                        {rec.is_critical && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-semibold">
                            critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{rec.retailer_id} • {rec.category}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground">Suggested</p>
                      <p className="font-semibold text-primary">{rec.suggested_qty.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-white/45 border border-border/50 p-2">
                      <p className="text-muted-foreground">Avg demand</p>
                      <p className="font-medium">{rec.avg_recent_demand.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-white/45 border border-border/50 p-2">
                      <p className="text-muted-foreground">Last order</p>
                      <p className="font-medium">{rec.last_order_qty.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-white/45 border border-border/50 p-2">
                      <p className="text-muted-foreground">Safety stock</p>
                      <p className="font-medium">{rec.safety_stock.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Scrollable list for the rest */}
          <GlassCard className="p-5 md:max-w-[520px]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">More suggestions</h3>
              </div>
              <span className="text-xs text-muted-foreground">+{Math.max(0, rest.length)}</span>
            </div>

            <div className="max-h-[520px] overflow-auto pr-2 space-y-2">
              {rest.map((rec) => (
                <div key={rec.id} className="rounded-lg border border-border/60 bg-white/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{rec.sku_id}</p>
                      <p className="text-xs text-muted-foreground truncate">{rec.retailer_id} • {rec.category}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary shrink-0">{rec.suggested_qty.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {rest.length === 0 && (
                <p className="text-sm text-muted-foreground">No additional items.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recommendations by Category */}
      <GlassCard className="p-5" delay={0.05}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Recommendations by Category</h3>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={categorySummary} margin={{ top: 8, right: 10, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 85%)" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11, fill: "hsl(230 10% 46%)" }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "hsl(240 6% 25%)", fontWeight: 600 }}
              itemStyle={{ color: "hsl(240 6% 25%)" }}
            />
            <Bar dataKey="suggested_qty" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {categorySummary.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "hsl(190 90% 45%)" : "hsl(245 58% 60%)"}
                  opacity={index === 0 ? 1 : Math.max(0.28, 1 - index * 0.05)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};

export default RecommendationsPage;
