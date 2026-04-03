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
  Bell,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navItems: Array<{
  title: string;
  path: string;
  icon: any;
  badge?: number;
}> = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Forecast Explorer", path: "/forecast", icon: TrendingUp },
  { title: "Pharmacy Insights", path: "/pharmacies", icon: Building2 },
  { title: "SKU Analytics", path: "/sku", icon: Pill },
  { title: "Alerts", path: "/alerts", icon: AlertTriangle },
  { title: "Recommendations", path: "/recommendations", icon: Globe },
  { title: "Model Insights", path: "/admin", icon: Settings },
];

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full gap-0">
      {/* Sidebar */}
      <aside
        className="w-[260px] shrink-0 flex flex-col overflow-hidden bg-white/30 backdrop-blur-md border-r border-white/50 sticky top-0 h-svh"
      >
        {/* Logo */}
        <div className="h-[120px] flex items-center shrink-0 ">
          <div className="flex items-center gap-3 min-w-0">
          
              <img
                src={logo}
                alt="CuraNex"
                // className="w-full h-full object-contain p-1"
                loading="eager"
                draggable={false}
              />
        
            {/* <span className="font-bold text-xl tracking-tight text-foreground">
              CuraNex
            </span> */}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "sidebar-active-gradient shadow-lg shadow-primary/20 -translate-y-[1px]"
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
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 bg-transparent overflow-hidden">
        {/* Top bar */}
        <header className="h-16 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 bg-transparent">
          <div />
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
        <main className="flex-1 p-6 overflow-auto rounded-tl-3xl">
          {children}
        </main>
      </div>
    </div>
  );
};
