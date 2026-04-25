import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    time: new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorized for a more "Systemic" feel
  const zones = {
    "North Sector": ["Delhi - Karol Bagh", "Delhi - Rohini", "Delhi - Dwarka"],
    "South Sector": ["Delhi - Saket", "Delhi - Lajpat Nagar", "Mumbai - Colaba"],
    "West Sector": ["Mumbai - Andheri", "Mumbai - Juhu", "Mumbai - Bandra"],
    "Central Business District": ["Delhi - Connaught Place", "Mumbai - Dadar"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: formData.origin,
          drop: formData.destination,
          datetime: formData.time.replace('T', ' ') + ":00",
        }),
      });

      if (!response.ok) throw new Error("API Failure");
      const data = await response.json();

      // Navigate to Dashboard with results
      navigate('/dashboard', { state: { result: data, searchParams: formData } });

    } catch (error) {
      console.error("Analysis Error:", error);
      alert("System could not correlate data. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">

      {/* --- ANALYTICAL BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-16 flex flex-col lg:grid lg:grid-cols-12 gap-16 items-center py-16">

        {/* LEFT: PROJECT IDENTITY */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Geospatial Crime Intelligence v2.1
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              Urban Ride <br />
              <span className="text-blue-500 font-light">Safety Analytics</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Utilizing <span className="text-slate-200 font-medium">Historical Incident Aggregation</span> and temporal modeling to provide commuters with data-driven risk assessments for metropolitan transit.
            </p>
          </div>

          {/* SYSTEM METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <MetricCard label="Data Integrity" value="High" sub="Verified Police Records" color="text-blue-400" />
            <MetricCard label="Risk Resolution" value="500m" sub="Micro-Zone Accuracy" color="text-indigo-400" />
            <MetricCard label="Model Latency" value="240ms" sub="Real-time Processing" color="text-emerald-400" />
          </div>
        </div>

        {/* RIGHT: THE ANALYSIS ENGINE (FORM) */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#161a23] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white">Safety Parameters</h2>
              <p className="text-sm text-slate-500 font-medium">Configure transit variables for risk modeling</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ORIGIN */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Departure Point</label>
                <select
                  required
                  className="w-full bg-[#0d0f14] border border-white/5 rounded-xl px-4 py-4 focus:ring-1 focus:ring-blue-500 transition-all text-slate-300 appearance-none"
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                >
                  <option value="">Select Origin...</option>
                  {Object.entries(zones).map(([zone, cities]) => (
                    <optgroup label={zone} key={zone} className="bg-[#161a23]">
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* DESTINATION */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Arrival Destination</label>
                <select
                  required
                  className="w-full bg-[#0d0f14] border border-white/5 rounded-xl px-4 py-4 focus:ring-1 focus:ring-blue-500 transition-all text-slate-300 appearance-none"
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option value="">Select Destination...</option>
                  {Object.entries(zones).map(([zone, cities]) => (
                    <optgroup label={zone} key={zone} className="bg-[#161a23]">
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* TIME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Commute Timestamp</label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#0d0f14] border border-white/5 rounded-xl px-4 py-4 focus:ring-1 focus:ring-blue-500 transition-all text-slate-300"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              {/* ACTION */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20"
              >
                {isSubmitting ? "Processing Dataset..." : "Generate Risk Assessment"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* --- SYSTEM CAPABILITIES --- */}
      <section className="border-t border-white/5 bg-[#0d0f14] py-10">
        <div className="container mx-auto px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <Capability title="Temporal Analysis" desc="Risk variance by hour and day." />
          <Capability title="Hotspot Mapping" desc="Identification of high-incident clusters." />
          <Capability title="Predictive Scoring" desc="Statistical likelihood of incident occurrence." />
          <Capability title="Path Optimization" desc="Safety-first route recommendation logic." />
        </div>
      </section>
    </div>
  );
};

const MetricCard = ({ label, value, sub, color }) => (
  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-[10px] text-slate-600 font-medium">{sub}</p>
  </div>
);

const Capability = ({ title, desc }) => (
  <div className="space-y-2">
    <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;