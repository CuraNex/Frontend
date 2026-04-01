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
  imageSrc?: string;
  imageAlt?: string;
}

export const KpiCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary/15 text-primary",
  delay = 0,
  imageSrc,
  imageAlt,
}: KpiCardProps) => {
  const valueText = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.15, ease: "easeOut" } }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={
        imageSrc
          ? "glass-card-hover p-5 rounded-3xl border border-white/60 bg-white/40"
          : "glass-card-hover p-5"
      }
    >
      {imageSrc ? (
        <div className="flex items-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                {title}
              </p>
            </div>
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              className="w-[150px] h-[110px] object-contain"
              loading="lazy"
              draggable={false}
            />
          </div>

          <div className="text-right space-y-1">
            <p className="text-4xl font-bold tracking-tight text-foreground ">{valueText}</p>
            {change && (
              <p className="text-sm font-semibold">
                <span
                  className={
                    changeType === "positive"
                      ? "text-success"
                      : changeType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {change.split(" ")[0]}
                </span>
                {change.includes(" ") ? (
                  <span className="text-muted-foreground"> {change.substring(change.indexOf(" ") + 1)}</span>
                ) : null}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-bold uppercase">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <p
                className={`text-xs font-medium ${
                  changeType === "positive"
                    ? "text-success"
                    : changeType === "negative"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {change}
              </p>
            )}
          </div>

          <div className={`kpi-icon ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
