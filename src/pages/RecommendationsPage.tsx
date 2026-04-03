import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { ClipboardList, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchRecommendations, type RecommendationsData } from "@/lib/api";

const RecommendationsPage = () => {
  const [selectedRetailer, setSelectedRetailer] = useState("All");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRecommendations(selectedRetailer, criticalOnly)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRetailer, criticalOnly]);

  if (loading && !data) {
    return (
      <div className="space-y-8 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Pre-Staging Recommendations" description="AI-driven reorder suggestions for proactive inventory management" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8 max-w-[1400px] w-full mx-auto">
        <PageHeader title="Pre-Staging Recommendations" description="AI-driven reorder suggestions for proactive inventory management" />
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load recommendations. Ensure the API server is running.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto">
      <PageHeader title="Pre-Staging Recommendations" description="AI-driven reorder suggestions for proactive inventory management" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-6 sm:items-end w-full mb-2">
        <div className="flex-1 max-w-sm space-y-2">
          <label className="text-sm font-medium text-foreground">Filter by Retailer</label>
          <div className="relative">
            <select
              value={selectedRetailer}
              onChange={(e) => setSelectedRetailer(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border/60 bg-white/35 backdrop-blur-sm px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
            >
              {data.retailerOptions.map(retailer => (
                <option key={retailer} value={retailer}>{retailer}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:mb-2.5">
          <input 
            type="checkbox" 
            id="criticalOnly"
            checked={criticalOnly}
            onChange={(e) => setCriticalOnly(e.target.checked)}
            className="w-4 h-4 rounded border-border/50 bg-muted/40 focus:ring-1 focus:ring-primary/50 text-primary cursor-pointer accent-primary"
          />
          <label htmlFor="criticalOnly" className="text-sm font-medium text-foreground cursor-pointer select-none">
            Critical SKUs Only
          </label>
        </div>
      </div>

      {/* Top Reorder Suggestions */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 items-start">
          <GlassCard className="p-5 w-full">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Top Reorder Suggestions</h3>
              </div>
              <span className="text-xs text-muted-foreground">Showing {data.items.length} of {data.totalItems} items</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
              {data.items.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center bg-white/10 rounded-xl border border-border/60">
                  No recommendations found matching these filters.
                </div>
              ) : (
                data.items.map((rec, i) => (
                <motion.div
                  key={`${rec.retailer_id}-${rec.sku_id}-${i}`}
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
                ))
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
          <BarChart data={data.categorySummary} margin={{ top: 8, right: 10, left: 0, bottom: 24 }}>
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
              {data.categorySummary.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "hsl(245 58% 55%)" : "hsl(245 58% 60%)"}
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
