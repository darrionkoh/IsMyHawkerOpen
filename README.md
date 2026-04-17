# 🍜 IsMyHawkerOpen? 🇸🇬

**Never trek to a closed hawker center again.** A real-time status tracker for Singapore's hawker centers, built with live data from NEA and GovTech.

[Live Demo](https://is-my-hawker-open.vercel.app)

---

## 💡 The Problem
We've all been there: trekking to your favorite hawker center for that specific $4.50 Laksa, only to be met with a "Scheduled Cleaning" sign and cordoned-off entrances. I built this because I tired of wallowing in hunger-induced sadness.

## 🚀 Features
- **Live Status:** Real-time Open/Closed/Warning indicators based on current time and date.
- **Cleaning Schedules:** Integrates official NEA datasets to predict future closures.
- **Interactive Mapping:** Powered by Leaflet.js and OneMap SG (including a sleek Night Mode).
- **Favorites System:** Save your "frequent haunts" for 1-tap checking.
- **Mobile First:** Designed to be a PWA-like experience for foodies on the go.

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS (with Dark Mode support)
- **Maps:** Leaflet.js + OneMap API
- **Data:** Live fetch from [data.gov.sg](https://data.gov.sg) (NEA Datastore API)
- **Deployment:** Vercel

## ⚙️ Engineering Highlights
- **Hybrid Data Model:** Combines local GeoJSON for map performance with live API polling for closure accuracy.
- **Graceful Degradation:** Implemented a fail-safe system that falls back to local JSON if the GovTech API hits rate limits (429 errors).
- **Session Caching:** Reduces API overhead and improves load times by caching live results in `sessionStorage`.

