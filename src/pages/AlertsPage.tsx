import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { alerts } from "@/data/mockData";
import { AlertTriangle, AlertCircle, TrendingUp, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const severityConfig = {
  critical: { color: "bg-destructive/15 text-destructive border-destructive/20", icon: AlertTriangle },
  high: { color: "bg-warning/15 text-warning border-warning/20", icon: AlertCircle },
  medium: { color: "bg-info/15 text-info border-info/20", icon: AlertCircle },
  low: { color: "bg-muted text-muted-foreground border-border", icon: AlertCircle },
};

const typeLabels: Record<string, string> = {
  stockout: "Stockout",
  overstock: "Overstock",
  anomaly: "Anomaly",
};

const AlertsPage = () => {
  const recommendations = [
    { drug: "Amoxicillin 250mg", action: "Reorder 5,000 units", pharmacy: "Jaffna Health Pharmacy", priority: "Urgent" },
    { drug: "Metformin 500mg", action: "Reorder 2,000 units", pharmacy: "Kandy General Pharmacy", priority: "High" },
    { drug: "Cetirizine 10mg", action: "Redistribute 3,000 units to Galle", pharmacy: "City Pharmacy Colombo", priority: "Medium" },
    { drug: "Paracetamol 500mg", action: "Investigate demand spike", pharmacy: "National Hospital Pharmacy", priority: "High" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Alerts & Recommendations" description="Proactive supply chain alerts and AI-powered recommendations" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Alerts */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Alerts</h3>
          {alerts.map((alert, i) => {
            const cfg = severityConfig[alert.severity as keyof typeof severityConfig];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 border-l-2 ${cfg.color}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{alert.drug}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {typeLabels[alert.type]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.pharmacy} · {alert.time}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recommendations</h3>
          {recommendations.map((rec, i) => (
            <GlassCard key={i} className="p-4" hover delay={i * 0.05}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{rec.drug}</p>
                  <p className="text-xs text-primary font-medium mt-1">{rec.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{rec.pharmacy}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${
                  rec.priority === "Urgent" ? "bg-destructive/15 text-destructive" :
                  rec.priority === "High" ? "bg-warning/15 text-warning" :
                  "bg-info/15 text-info"
                }`}>
                  {rec.priority}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
