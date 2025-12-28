import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const Home = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    time: new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cities = ["Select Location...", "Andheri", "Bandra", "Colaba", "Connaught Place", "Dadar", "Dwarka", "Juhu", "Karol Bagh", "Lajpat Nagar", "Saket"];

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

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      // 3. Navigate to Dashboard and pass the result data
      navigate('/dashboard', { state: { result: data, searchParams: formData } });

    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch risk analysis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <main className="relative flex-1 container mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center py-20">
        
        {/* BACKGROUND AMBIANCE */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
        </div>

        {/* 1. LEFT SIDE: SYSTEM DATA & VALUE PROP */}
        <div className="relative z-10 lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse"></span>
              Neural Risk Assessment Engine
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-[0.95]">
              Quantify <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">Urban Risk.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Transitioning from reactive safety to <span className="text-white font-medium">proactive intelligence</span>. 
              Our platform analyzes micro-trends in urban crime data to generate real-time safety heuristics for your specific route.
            </p>
          </div>

          {/* DATA CARDS (Fills the space nicely) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <p className="text-blue-500 text-xs font-bold uppercase tracking-tighter mb-1">Database</p>
              <p className="text-2xl font-mono font-bold">14.2M</p>
              <p className="text-[10px] text-slate-500">Indexed Incidents</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <p className="text-indigo-500 text-xs font-bold uppercase tracking-tighter mb-1">Precision</p>
              <p className="text-2xl font-mono font-bold">99.8%</p>
              <p className="text-[10px] text-slate-500">Accuracy Rating</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-tighter mb-1">Updated</p>
              <p className="text-2xl font-mono font-bold">0.4s</p>
              <p className="text-[10px] text-slate-500">Live Sync Interval</p>
            </div>
          </div>
        </div>

        {/* 2. RIGHT SIDE: THE FROSTED TERMINAL */}
        <div className="relative z-10 lg:col-span-5 w-full">
          <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent">
            <form 
              onSubmit={handleSubmit}
              className="bg-[#11141a]/90 backdrop-blur-2xl rounded-[2.5rem] p-8 lg:p-12 shadow-2xl"
            >
              <div className="mb-10 text-center">
                <h2 className="text-xl font-bold tracking-tight">Generate Route Report</h2>
                <p className="text-xs text-slate-500 mt-2 font-medium">Select your coordinate sectors for analysis</p>
              </div>

              <div className="space-y-6">
                {/* SELECT ORIGIN */}
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Origin Point</label>
                  <select 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-slate-300"
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  >
                    {cities.map(c => <option key={c} value={c === cities[0] ? "" : c} className="bg-[#11141a]">{c}</option>)}
                  </select>
                </div>

                {/* SELECT DESTINATION */}
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Destination Sector</label>
                  <select 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer text-slate-300"
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  >
                    {cities.map(c => <option key={c} value={c === cities[0] ? "" : c} className="bg-[#11141a]">{c}</option>)}
                  </select>
                </div>

                {/* TIME SELECT */}
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Analysis Window</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-300"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 relative overflow-hidden group bg-white text-[#0a0c10] py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Running Neural Nets..." : "Run Risk Analysis"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">End-to-End Encryption Layer Active</p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* --- FEATURE BAR (Fills the bottom) --- */}
      <section className="border-y border-white/5 bg-white/[0.01] py-12">
        <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <Feature icon="⚡" title="Real-time Feed" desc="Live police data integration." />
          <Feature icon="🛡️" title="Route Guard" desc="Machine learning pathing." />
          <Feature icon="📊" title="Heat Mapping" desc="Geospatial risk visualization." />
          <Feature icon="🧬" title="DNA Heuristics" desc="Pattern recognition algorithms." />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="text-2xl">{icon}</div>
    <div>
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  </div>
);

export default Home;