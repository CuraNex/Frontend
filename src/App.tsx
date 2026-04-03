import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardPage from "./pages/DashboardPage";
import ForecastPage from "./pages/ForecastPage";
import PharmacyInsightsPage from "./pages/PharmacyInsightsPage";
import SkuAnalyticsPage from "./pages/SkuAnalyticsPage";
import AlertsPage from "./pages/AlertsPage";
import GeographicPage from "./pages/GeographicPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import PreloaderDust from "@/components/PreloaderDust";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {loading && <PreloaderDust onDone={() => setLoading(false)} />}

      {!loading && (
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppSidebar>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/pharmacies" element={<PharmacyInsightsPage />} />
                <Route path="/sku" element={<SkuAnalyticsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppSidebar>
          </BrowserRouter>
        </TooltipProvider>
      )}
    </QueryClientProvider>
  );
};

export default App;
