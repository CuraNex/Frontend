# CuraNex — Frontend Decision Interface

This directory contains the user interface for **CuraNex**. It serves as the primary Decision Intelligence Dashboard where distribution team leads can interact with predictive analytics, view reorder alerts, and manage proactive inventory staging.

## 🛠️ Technology Stack
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Package Manager:** npm

## ⚙️ Prerequisites
- **Node.js 18** (or newer)

## 🚀 Setup & Installation

Install the required Node packages:
```bash
npm install
```

## 🏃‍♂️ Running the Development Server

The React frontend communicates directly with our FastAPI backend. Before starting the frontend, ensure that the Backend server is actively running on port `8000`.

To start the Vite development server:
```bash
npm run dev
```

The frontend will run locally on **port 8080**.
👉 **Open [http://localhost:8080](http://localhost:8080) in your browser.**

### API Proxy Note
In development mode, Vite is configured (via `vite.config.ts`) to automatically proxy any requests made to `/api/*` directly to `http://localhost:8000`. This avoids CORS issues during local development.

## 📦 Building for Production

When you are ready to deploy, generate a production-ready static bundle:
```bash
npm run build
```

To test the production build locally:
```bash
npm run preview
```

*(Note: When deploying the built static files to your production hosting environment, ensure that you properly configure the API base URL if the frontend is not served behind the same proxy as the backend.)*
