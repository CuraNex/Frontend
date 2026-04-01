import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Pill,
  AlertTriangle,
  Globe,
  Settings,
  Search,
  Bell,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Forecast Explorer", path: "/forecast", icon: TrendingUp },
  { title: "Pharmacy Insights", path: "/pharmacies", icon: Building2 },
  { title: "SKU Analytics", path: "/sku", icon: Pill },
  { title: "Alerts", path: "/alerts", icon: AlertTriangle },
  { title: "Geographic", path: "/geographic", icon: Globe },
  { title: "Messages", path: "#", icon: MessageSquare, badge: 6 },
  { title: "Model Insights", path: "/admin", icon: Settings },
];

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full p-4 gap-0">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 bg-white/90 backdrop-blur-xl rounded-l-3xl flex flex-col overflow-hidden border-r border-border/50">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 shrink-0 mt-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 glow-primary">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              CuraNex
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "sidebar-active-gradient"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                activeClassName=""
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap flex-1">{item.title}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Upgrade Button */}
        <div className="p-4 shrink-0">
          <button className="w-full gradient-btn flex items-center justify-center gap-2 py-3 rounded-2xl text-sm">
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/60 backdrop-blur-xl rounded-r-3xl overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border/40 bg-white/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pharmacies, drugs, districts..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
