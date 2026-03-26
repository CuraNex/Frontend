import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export const KpiCard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "bg-primary/15 text-primary", delay = 0 }: KpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className="glass-card-hover p-5"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${
            changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {change}
          </p>
        )}
      </div>
      <div className={`kpi-icon ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);
