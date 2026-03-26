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
  ChevronLeft,
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
  { title: "Model Insights", path: "/admin", icon: Settings },
];

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-lg tracking-tight whitespace-nowrap"
                >
                  CuraNex
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                activeClassName=""
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-sidebar-border shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
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
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </motion.div>
    </div>
  );
};
