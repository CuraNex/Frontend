/**
 * CuraNex API Client
 * Centralised fetch layer for all backend endpoints.
 */

const API_BASE = "/api";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  kpi: {
    totalPharmacies: number;
    totalSKUs: number;
    totalOrders: number;
    forecastAccuracy: number;
    stockoutRisk: number;
  };
  weeklyTrend: { date: string; dateRaw: string; actual: number | null; forecast: number | null }[];
  topDrugs: { name: string; demand: number; category: string }[];
  retailerTypeData: { name: string; value: number }[];
  categoryData: { category: string; demand: number }[];
}

export const fetchDashboardOverview = () => fetchJSON<DashboardOverview>("/dashboard/overview");

// ── Forecast ─────────────────────────────────────────────────────────────────

export interface ForecastFilters {
  retailers: { value: string; label: string }[];
  skus: { value: string; label: string }[];
  categories: string[];
}

export interface ForecastTimeseries {
  recordsCount: number;
  chartData: {
    week: string; dateRaw: string;
    actual: number | null;
    naive?: number | null;
    validationForecast?: number | null;
  }[];
  futureData: { week: string; dateRaw: string; futureExtrapolation: number }[];
  summaryStats: { metric: string; value: string }[];
  orderDistribution: { bin: string; binMid: number; count: number }[];
}

export const fetchForecastFilters = () => fetchJSON<ForecastFilters>("/forecast/filters");

export const fetchForecastTimeseries = (retailer = "All", sku = "All", category = "All") =>
  fetchJSON<ForecastTimeseries>(`/forecast/timeseries?retailer=${encodeURIComponent(retailer)}&sku=${encodeURIComponent(sku)}&category=${encodeURIComponent(category)}`);

// ── Pharmacy ─────────────────────────────────────────────────────────────────

export interface PharmacySummary {
  id: string; name: string; district: string; type: string; tier: string;
}

export interface PharmacyDetails {
  info: { type: string; tier: string; district: string; name: string };
  orderFreq: string;
  demandTrend: { date: string; demand: number | null; forecast: number | null }[];
  insights: string[];
}

export const fetchPharmacyTop5 = () => fetchJSON<PharmacySummary[]>("/pharmacy/top5");
export const fetchPharmacyDetails = (id: string) => fetchJSON<PharmacyDetails>(`/pharmacy/${id}/details`);

// ── SKU ──────────────────────────────────────────────────────────────────────

export interface SkuSummary {
  sku: string; name: string; category: string; dosageForm: string;
  shelfLife: string; avgDemand: number; suggestedStock: number;
}

export interface SkuAnalytics {
  demandTrend: { date: string; demand: number | null; forecast: number | null }[];
  seasonality: { month: string; demand: number }[];
}

export const fetchSkuTop5 = () => fetchJSON<SkuSummary[]>("/sku/top5");
export const fetchSkuAnalytics = (skuId: string) => fetchJSON<SkuAnalytics>(`/sku/${skuId}/analytics`);

// ── Anomalies ────────────────────────────────────────────────────────────────

export interface AnomalyData {
  anomalyCount: number;
  totalOrders: number;
  anomalyRate: number;
  tableRows: { date: string; retailer_id: number; sku_id: string; qty: number; pair_mean: number; z_score: number }[];
  timeline: { month: string; count: number }[];
}

export const fetchAnomalies = () => fetchJSON<AnomalyData>("/anomalies");

// ── Recommendations ──────────────────────────────────────────────────────────

export interface RecommendationItem {
  retailer_id: string; sku_id: string; category: string;
  avg_recent_demand: number; last_order_qty: number;
  suggested_qty: number; safety_stock: number; is_critical: boolean;
}

export interface RecommendationsData {
  retailerOptions: string[];
  items: RecommendationItem[];
  totalItems: number;
  categorySummary: { category: string; suggested_qty: number }[];
}

export const fetchRecommendations = (retailer = "All", criticalOnly = false) =>
  fetchJSON<RecommendationsData>(`/recommendations?retailer=${encodeURIComponent(retailer)}&critical_only=${criticalOnly}`);

// ── Model Performance ────────────────────────────────────────────────────────

export interface ModelRanking {
  rank: number; model: string; mae: number; rmse: number;
  mape: string; wMAPE: string; bias: string; fillRate: string;
  nSamples: number; bestMAE: boolean; bestRMSE: boolean; bestWMAPE: boolean; bestFill: boolean;
}

export interface ModelEvaluation {
  rankings: ModelRanking[];
  wmapeBar: { model: string; wMAPE: number }[];
  radarData: Record<string, any>[];
  radarModels: string[];
  kpi: { bestModel: string; mape: string; rmse: string; fillRate: string };
}

export interface ModelDeepDive {
  modelInfo: { mae: number; wMAPE: string; fillRate: string } | null;
  featureImportance: { feature: string; importance: number }[];
  scatter: { x: number; y: number }[];
}

export const fetchModelEvaluation = () => fetchJSON<ModelEvaluation>("/models/evaluation");
export const fetchModelDeepDive = (model: string) => fetchJSON<ModelDeepDive>(`/models/${model}/deep-dive`);
