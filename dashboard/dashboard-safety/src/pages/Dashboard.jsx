import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell
} from 'recharts';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.result;

  if (!data) return (
    <div className="bg-[#0a0c10] min-h-screen text-cyan-500 flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="tracking-widest uppercase text-xs">Synchronizing_Neural_Uplink...</span>
      </div>
    </div>
  );

  const { risk_assessment, temporal_comparison, reasoning, infrastructure, query, multipliers, optimization_suggestion } = data;

  const temporalData = [
    { name: 'MORNING', risk: temporal_comparison.morning.risk_percent },
    { name: 'AFTERNOON', risk: temporal_comparison.afternoon.risk_percent },
    { name: 'EVENING', risk: temporal_comparison.evening.risk_percent },
    { name: 'NIGHT', risk: temporal_comparison.night.risk_percent },
  ];

  const radarData = [
    { subject: 'CCTV', A: Math.max(10, infrastructure.cctv_cameras * 10), fullMark: 100 },
    { subject: 'Police', A: infrastructure.nearby_police_stations * 20, fullMark: 100 },
    { subject: 'Intel', A: infrastructure.infrastructure_score, fullMark: 100 },
    { subject: 'Response', A: 100 - (infrastructure.police_response_time_minutes * 5), fullMark: 100 },
    { subject: 'Stability', A: Math.max(10, 100 - infrastructure.historical_incidents), fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#06080a] text-slate-300 font-sans p-4 lg:p-8">
      
      {/* HEADER HUD */}
      <header className="max-w-[1700px] mx-auto mb-8 flex flex-wrap justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">System_Online</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            NEURAL_<span className="text-cyan-500 italic">RISK_REPORT</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">ID: {data.timestamp.split('T')[1].slice(0, 8)} // SECTOR: {query.pickup_location} → {query.drop_location}</p>
        </div>
        
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase rounded-lg hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          Initiate New Scan
        </button>
      </header>

      <main className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. PRIMARY RISK GAUGE */}
        <div className="lg:col-span-3 bg-[#0d1117] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none">RISK</div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 self-start">Threat_Saturation</h3>
          
          <div className="relative flex items-center justify-center py-6">
            <svg className="w-52 h-52 transform -rotate-90">
              <circle cx="104" cy="104" r="92" stroke="#1c222d" strokeWidth="8" fill="none" />
              <circle cx="104" cy="104" r="92" stroke="#22d3ee" strokeWidth="12" fill="none" 
                strokeDasharray="578" strokeDashoffset={578 - (578 * risk_assessment.current_risk_percent) / 100}
                strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000" />
            </svg>
            <div className="absolute text-center">
              <p className="text-6xl font-black text-white">{risk_assessment.current_risk_percent.toFixed(0)}%</p>
              <p className={`text-[10px] font-bold mt-1 uppercase ${risk_assessment.risk_level === 'LOW' ? 'text-emerald-400' : 'text-red-400'}`}>
                {risk_assessment.risk_level}_LEVEL
              </p>
            </div>
          </div>
          
          <div className="w-full mt-6 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic text-center">
               "{risk_assessment.risk_action}"
             </p>
          </div>
        </div>

        {/* 2. TEMPORAL RISK TIMELINE */}
        <div className="lg:col-span-6 bg-[#0d1117] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Temporal_Matrix</h3>
            <div className="flex gap-3">
               <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-600 uppercase">Safest_Window</p>
                  <p className="text-xs font-black text-emerald-400 uppercase">{temporal_comparison.safest_time}</p>
               </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temporalData}>
                <defs>
                  <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="risk" stroke="#22d3ee" strokeWidth={3} fill="url(#cyanGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            <MultiplierStat label="Time" val={multipliers.time_multiplier} />
            <MultiplierStat label="Season" val={multipliers.season_multiplier} />
            <MultiplierStat label="Weekend" val={multipliers.weekend_multiplier} />
            <MultiplierStat label="Combined" val={multipliers.combined_multiplier} />
          </div>
        </div>

        {/* 3. INFRASTRUCTURE RADAR */}
        <div className="lg:col-span-3 bg-[#0d1117] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 self-start">Resource_Map</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Intel" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-3 mt-6">
             <InfraRow label="Infrastructure Score" val={`${infrastructure.infrastructure_score}%`} />
             <InfraRow label="Police Presence" val={infrastructure.nearby_police_stations} />
             <InfraRow label="Historical Load" val={infrastructure.historical_incidents} />
          </div>
        </div>

        {/* 4. AI HEURISTICS & REASONING TERMINAL */}
        <div className="lg:col-span-8 bg-[#0d1117] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            Heuristic_Reasoning_Terminal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[350px] overflow-y-auto pr-4 custom-scrollbar">
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 border-l-2 border-cyan-500 pl-3">Risk Catalysts</h4>
              <ul className="space-y-4">
                {reasoning.primary_risk_factors.map((item, i) => (
                  <li key={i} className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    <span className="text-cyan-500 mr-2">»</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 border-l-2 border-indigo-500 pl-3">Infrastructure Analysis</h4>
              <ul className="space-y-4">
                {reasoning.infrastructure_analysis.map((item, i) => (
                  <li key={i} className="text-[11px] text-slate-400 italic leading-relaxed">
                    <span className="text-indigo-500 mr-2">◈</span> {item.replace(/✅|⚠️|🚔/g, '')}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                <p className="text-[9px] font-black text-cyan-500 uppercase mb-2">Seasonal Dynamics</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">{reasoning.seasonal_analysis}</p>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <p className="text-[9px] font-black text-emerald-500 uppercase mb-2">Safety Protocols</p>
                <div className="flex flex-wrap gap-2">
                   {reasoning.safety_recommendations.map((r, i) => (
                     <span key={i} className="bg-white/5 px-2 py-1 rounded text-[9px] text-slate-300">{r.replace('🛡️', '')}</span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. OPTIMIZATION CENTER */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0d1117] to-[#0a0c10] border-2 border-cyan-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 px-4 py-1 bg-cyan-500 text-[#000] text-[9px] font-black uppercase">Advisory</div>
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Neural_Optimization</h3>
           
           <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Target Safe Window</p>
                <p className="text-4xl font-black text-white">{optimization_suggestion.recommended_time}</p>
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-6">
                 <div>
                    <p className="text-2xl font-black text-cyan-400">{optimization_suggestion.potential_risk_reduction_percent}%</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Risk Reduction</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-white uppercase">{optimization_suggestion.urgency_level}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Urgency</p>
                 </div>
              </div>

              <div className={`p-4 rounded-2xl border ${optimization_suggestion.should_reschedule ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'} text-[10px] font-medium leading-relaxed`}>
                {optimization_suggestion.should_reschedule ? "System suggests rescheduling to minimize threat trajectory." : "Current schedule aligns with optimal safety parameters."}
              </div>
           </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-[1700px] mx-auto mt-8 flex justify-between items-center opacity-30 text-[8px] font-mono uppercase tracking-[0.5em] text-slate-500">
        <span>Secure_Encryption_AES256</span>
        <span>Neural_Engine_V4.2</span>
        <span>Timestamp: {data.timestamp}</span>
      </footer>
    </div>
  );
};

// HELPER COMPONENTS
const MultiplierStat = ({ label, val }) => (
  <div>
    <p className="text-[8px] font-bold text-slate-600 uppercase mb-1">{label}</p>
    <p className={`text-xs font-black ${val > 1 ? 'text-red-400' : 'text-cyan-400'}`}>{val}x</p>
  </div>
);

const InfraRow = ({ label, val }) => (
  <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
    <span className="text-slate-500 uppercase font-bold">{label}</span>
    <span className="text-white font-mono">{val}</span>
  </div>
);

export default Dashboard;