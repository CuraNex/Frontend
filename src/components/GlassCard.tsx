import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const GlassCard = ({ children, className = "", hover = true, delay = 0 }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -6, transition: { duration: 0.15, ease: "easeOut" } }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={`${hover ? "glass-card-hover" : "glass-card"} ${className}`}
  >
    {children}
  </motion.div>
);
