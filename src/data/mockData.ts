// Mock data for CuraNex dashboard

export const kpiData = {
  totalPharmacies: 2847,
  totalSKUs: 12453,
  forecastAccuracy: 94.2,
  stockoutRisk: 3.8,
};

export const demandOverTimeData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 2, i + 1);
  const base = 1200 + Math.sin(i / 5) * 300;
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    predicted: Math.round(base + Math.random() * 100),
    actual: Math.round(base + (Math.random() - 0.5) * 200),
  };
});

export const topDrugsData = [
  { name: "Paracetamol 500mg", demand: 45200, category: "Analgesic" },
  { name: "Amoxicillin 250mg", demand: 38900, category: "Antibiotic" },
  { name: "Metformin 500mg", demand: 32100, category: "Antidiabetic" },
  { name: "Omeprazole 20mg", demand: 28700, category: "GI" },
  { name: "Atorvastatin 10mg", demand: 25300, category: "Cardiovascular" },
  { name: "Losartan 50mg", demand: 22800, category: "Cardiovascular" },
  { name: "Cetirizine 10mg", demand: 19500, category: "Antihistamine" },
  { name: "Azithromycin 500mg", demand: 17200, category: "Antibiotic" },
];

export const districtDemandData = [
  { district: "Colombo", demand: 185000, lat: 6.9271, lng: 79.8612, risk: "low" },
  { district: "Gampaha", demand: 142000, lat: 7.0840, lng: 80.0098, risk: "low" },
  { district: "Kandy", demand: 98000, lat: 7.2906, lng: 80.6337, risk: "medium" },
  { district: "Galle", demand: 76000, lat: 6.0535, lng: 80.2210, risk: "low" },
  { district: "Kurunegala", demand: 68000, lat: 7.4863, lng: 80.3647, risk: "medium" },
  { district: "Jaffna", demand: 52000, lat: 9.6615, lng: 80.0255, risk: "high" },
  { district: "Ratnapura", demand: 45000, lat: 6.6828, lng: 80.3992, risk: "medium" },
  { district: "Matara", demand: 41000, lat: 5.9549, lng: 80.5550, risk: "low" },
  { district: "Badulla", demand: 38000, lat: 6.9934, lng: 81.0550, risk: "high" },
  { district: "Anuradhapura", demand: 35000, lat: 8.3114, lng: 80.4037, risk: "medium" },
  { district: "Trincomalee", demand: 28000, lat: 8.5874, lng: 81.2152, risk: "high" },
  { district: "Batticaloa", demand: 25000, lat: 7.7310, lng: 81.6747, risk: "high" },
];

export const forecastData = Array.from({ length: 52 }, (_, i) => {
  const base = 800 + Math.sin(i / 8) * 200;
  return {
    week: `W${i + 1}`,
    p10: Math.round(base * 0.75),
    p50: Math.round(base),
    p90: Math.round(base * 1.3),
    actual: i < 40 ? Math.round(base + (Math.random() - 0.5) * 150) : null,
  };
});

export const pharmacies = [
  { id: "PH001", name: "City Pharmacy Colombo", district: "Colombo", type: "Retail", tier: "A", orderFreq: "Daily" },
  { id: "PH002", name: "National Hospital Pharmacy", district: "Colombo", type: "Hospital", tier: "A", orderFreq: "Daily" },
  { id: "PH003", name: "Kandy General Pharmacy", district: "Kandy", type: "Retail", tier: "B", orderFreq: "Weekly" },
  { id: "PH004", name: "Galle Medical Center", district: "Galle", type: "Hospital", tier: "B", orderFreq: "Bi-weekly" },
  { id: "PH005", name: "Jaffna Health Pharmacy", district: "Jaffna", type: "Retail", tier: "C", orderFreq: "Weekly" },
];

export const alerts = [
  { id: 1, type: "stockout", severity: "critical", drug: "Amoxicillin 250mg", pharmacy: "Jaffna Health Pharmacy", message: "Stock expected to deplete in 2 days", time: "5 min ago" },
  { id: 2, type: "stockout", severity: "high", drug: "Metformin 500mg", pharmacy: "Kandy General Pharmacy", message: "Below safety stock threshold", time: "12 min ago" },
  { id: 3, type: "overstock", severity: "medium", drug: "Cetirizine 10mg", pharmacy: "City Pharmacy Colombo", message: "Excess stock — 45 days supply on hand", time: "1 hr ago" },
  { id: 4, type: "anomaly", severity: "high", drug: "Paracetamol 500mg", pharmacy: "National Hospital Pharmacy", message: "Sudden 280% demand spike detected", time: "2 hrs ago" },
  { id: 5, type: "stockout", severity: "medium", drug: "Losartan 50mg", pharmacy: "Galle Medical Center", message: "Projected stockout in 5 days", time: "3 hrs ago" },
  { id: 6, type: "overstock", severity: "low", drug: "Azithromycin 500mg", pharmacy: "City Pharmacy Colombo", message: "Shelf life expiry risk — 60 days remaining", time: "5 hrs ago" },
];

export const modelMetrics = [
  { model: "LightGBM", mape: 5.8, rmse: 142, bias: -0.3, accuracy: 94.2 },
  { model: "TFT", mape: 6.2, rmse: 156, bias: 0.8, accuracy: 93.8 },
  { model: "N-BEATS", mape: 7.1, rmse: 178, bias: -1.2, accuracy: 92.9 },
];

export const featureImportance = [
  { feature: "Historical Demand (Lag-1)", importance: 0.32 },
  { feature: "Day of Week", importance: 0.18 },
  { feature: "Seasonal Index", importance: 0.15 },
  { feature: "Pharmacy Tier", importance: 0.12 },
  { feature: "Drug Category", importance: 0.09 },
  { feature: "District Population", importance: 0.07 },
  { feature: "Price Band", importance: 0.04 },
  { feature: "Dengue Index", importance: 0.03 },
];

export const skuDetails = [
  { sku: "SKU-001", name: "Paracetamol 500mg", category: "Analgesic", price: "LKR 2.50", shelfLife: "36 months", expiryRisk: "Low", stockoutRisk: "Low" },
  { sku: "SKU-002", name: "Amoxicillin 250mg", category: "Antibiotic", price: "LKR 8.00", shelfLife: "24 months", expiryRisk: "Medium", stockoutRisk: "High" },
  { sku: "SKU-003", name: "Metformin 500mg", category: "Antidiabetic", price: "LKR 3.50", shelfLife: "36 months", expiryRisk: "Low", stockoutRisk: "Medium" },
  { sku: "SKU-004", name: "Omeprazole 20mg", category: "GI", price: "LKR 5.00", shelfLife: "24 months", expiryRisk: "Medium", stockoutRisk: "Low" },
  { sku: "SKU-005", name: "Atorvastatin 10mg", category: "Cardiovascular", price: "LKR 12.00", shelfLife: "30 months", expiryRisk: "Low", stockoutRisk: "Low" },
];
