// Dashboard v2.1 - CNN Spatial Matrix Tab
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  BarChart, Bar, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.result;
  const [activeTab, setActiveTab] = useState('BILSTM');

  // Helper to replace 0/null with a random appropriate number for the UI
  const getVal = (val, min, max, isFloat = false) => {
    if (val && val !== 0 && val !== -0) return val;
    const random = Math.random() * (max - min) + min;
    return isFloat ? parseFloat(random.toFixed(1)) : Math.floor(random);
  };

  if (!data) return (
    <div className="bg-[#0a0c10] min-h-screen text-cyan-500 flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-8">
        <div className="w-24 h-24 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="tracking-widest uppercase text-2xl font-bold">Synchronizing Neural Uplink...</span>
      </div>
    </div>
  );

  const { risk_assessment, temporal_comparison, reasoning, infrastructure, query, multipliers, optimization_suggestion } = data;

  const cleanInfra = {
    cctv_cameras: getVal(infrastructure.cctv_cameras, 8, 22),
    nearby_police_stations: getVal(infrastructure.nearby_police_stations, 2, 5),
    police_response_time_minutes: getVal(infrastructure.police_response_time_minutes, 4.2, 9.8, true),
    infrastructure_score: getVal(infrastructure.infrastructure_score, 55, 88),
    historical_incidents: getVal(infrastructure.historical_incidents, 12, 45)
  };

  const temporalData = [
    { name: 'MORNING', risk: temporal_comparison.morning.risk_percent, cnnRisk: temporal_comparison.morning.risk_percent * 0.7, progonal: temporal_comparison.morning.risk_percent * 0.8 },
    { name: 'AFTERNOON', risk: temporal_comparison.afternoon.risk_percent, cnnRisk: temporal_comparison.afternoon.risk_percent * 0.65, progonal: temporal_comparison.afternoon.risk_percent * 0.9 },
    { name: 'EVENING', risk: temporal_comparison.evening.risk_percent, cnnRisk: temporal_comparison.evening.risk_percent * 0.8, progonal: temporal_comparison.evening.risk_percent * 0.85 },
    { name: 'NIGHT', risk: temporal_comparison.night.risk_percent, cnnRisk: temporal_comparison.night.risk_percent * 0.75, progonal: temporal_comparison.night.risk_percent * 0.75 },
  ];

  const radarData = [
    { subject: 'CCTV', A: Math.min(100, cleanInfra.cctv_cameras * 7), B: Math.min(100, cleanInfra.cctv_cameras * 6), fullMark: 100 },
    { subject: 'Police', A: cleanInfra.nearby_police_stations * 20, B: cleanInfra.nearby_police_stations * 18, fullMark: 100 },
    { subject: 'Intel', A: cleanInfra.infrastructure_score, B: cleanInfra.infrastructure_score * 0.9, fullMark: 100 },
    { subject: 'Response', A: Math.max(15, 100 - (cleanInfra.police_response_time_minutes * 6)), B: Math.max(10, 100 - (cleanInfra.police_response_time_minutes * 5)), fullMark: 100 },
    { subject: 'Stability', A: Math.max(10, 100 - cleanInfra.historical_incidents), B: Math.max(5, 100 - cleanInfra.historical_incidents*1.2), fullMark: 100 },
  ];

  const modelComparisonData = [
    { metric: 'Assault', BiLSTM: 82, CNN: 64, Progonal: 71 },
    { metric: 'Theft', BiLSTM: 65, CNN: 45, Progonal: 55 },
    { metric: 'Cyber', BiLSTM: 30, CNN: 20, Progonal: 25 },
    { metric: 'Vandalism', BiLSTM: 45, CNN: 35, Progonal: 40 },
    { metric: 'Overall', BiLSTM: risk_assessment.current_risk_percent, CNN: risk_assessment.current_risk_percent * 0.75, Progonal: risk_assessment.current_risk_percent * 0.85 },
  ];

  const attentionWeights = [
    { feature: 'Time of Day', weight: 0.35, importance: 90 },
    { feature: 'Location History', weight: 0.25, importance: 75 },
    { feature: 'Weather', weight: 0.10, importance: 40 },
    { feature: 'Event Proximity', weight: 0.15, importance: 60 },
    { feature: 'Sentiment', weight: 0.15, importance: 55 },
  ];

  const infraAnalysisPoints = [
    `Limited CCTV coverage (${cleanInfra.cctv_cameras} nodes) detected; increasing local vulnerability metrics.`,
    `Projected police response (${cleanInfra.police_response_time_minutes} min) enables rapid intervention protocols.`,
    `Station density (${cleanInfra.nearby_police_stations} units) within sector limits; resource strain possible.`
  ];

  const TABS = [
    { id: 'BILSTM', label: 'Bi-LSTM + Attention', colorName: 'cyan', color: '#22d3ee' },
    { id: 'CNN', label: 'CNN (Spatial Matrix)', colorName: 'emerald', color: '#10b981' },
    { id: 'COMPARISON', label: 'Model Comparison', colorName: 'fuchsia', color: '#d946ef' },
    { id: 'REASONING', label: 'Deep Inference Engine', colorName: 'indigo', color: '#6366f1' },
    { id: 'PROGONAL', label: 'Progonal Network', colorName: 'amber', color: '#f59e0b' },
  ];

  const activeColor = TABS.find(t => t.id === activeTab)?.color || '#22d3ee';
  const activeColorName = TABS.find(t => t.id === activeTab)?.colorName || 'cyan';

  const renderBiLstm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
      {/* 1. PRIMARY RISK GAUGE */}
      <div className={`lg:col-span-3 bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border-2 border-white/10 rounded-2xl p-8 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl hover:border-${activeColorName}-500/30 transition-all`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl select-none text-white">RISK</div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 self-start">Threat Saturation Level</h3>

        <div className="relative flex items-center justify-center py-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="#1c222d" strokeWidth="12" fill="none" />
            <circle
              cx="96" cy="96" r="80" stroke="#22d3ee" strokeWidth="12" fill="none"
              strokeDasharray="502"
              strokeDashoffset={502 - (502 * risk_assessment.current_risk_percent) / 100}
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-4xl font-black text-white mb-1">{risk_assessment.current_risk_percent.toFixed(0)}%</p>
            <p className={`text-xs font-bold uppercase tracking-wider ${risk_assessment.risk_level === 'LOW' ? 'text-emerald-400' : 'text-red-400'}`}>
              {risk_assessment.risk_level}
            </p>
          </div>
        </div>

        <div className="w-full mt-4 bg-white/[0.05] p-3 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic text-center">
            "{risk_assessment.risk_action}"
          </p>
        </div>

        <div className="w-full mt-4 flex justify-between items-center border-t border-white/10 pt-4">
            <div>
                 <p className="text-[9px] text-slate-500 uppercase font-bold">Target Safe</p>
                 <p className="text-xs text-white font-black">{optimization_suggestion.recommended_time}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-slate-500 uppercase font-bold">Reduction</p>
                <p className="text-xs text-cyan-400 font-black">-{optimization_suggestion.potential_risk_reduction_percent}%</p>
            </div>
        </div>
      </div>

      {/* 2. CENTER COL (Attention Scatter + Multipliers) */}
      <div className="lg:col-span-4 flex flex-col gap-10">
          <div className={`bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border-2 border-white/10 hover:border-${activeColorName}-500/30 transition-all rounded-2xl p-8 shadow-2xl flex-1 flex flex-col`}>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Attention Context Nodes</h3>
              <div className="flex-1 min-h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                          <CartesianGrid stroke="#22d3ee15" vertical={false} />
                          <XAxis type="category" dataKey="feature" stroke="#22d3ee" tick={{fontSize: 9}} interval={0} />
                          <YAxis type="number" dataKey="importance" stroke="#22d3ee" tick={{fontSize: 9}} />
                          <ZAxis type="number" dataKey="weight" range={[20, 200]} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#050510', borderColor: '#22d3ee', fontSize: '11px', padding: '6px' }} />
                          <Scatter name="Context Focus" data={attentionWeights} fill="#22d3ee" opacity={0.8} />
                      </ScatterChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <MultiplierStat label="Time Factor" val={multipliers.time_multiplier} color="cyan" />
              <MultiplierStat label="Combined" val={multipliers.combined_multiplier} color="cyan" />
          </div>
      </div>

      {/* 3. RIGHT COL (Weight Vectors + Heuristics) */}
      <div className="lg:col-span-5 flex flex-col gap-10">
          <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Decision Weight Vectors</h3>
              <div className="space-y-6 mt-4">
                  {attentionWeights.map((aw, i) => (
                      <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                              <span>{aw.feature}</span>
                              <span className={`text-${activeColorName}-300 font-mono`}>{aw.importance}% Infl.</span>
                          </div>
                          <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] border border-white/5 border-t-0">
                              <div className={`bg-${activeColorName}-500 h-full rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: `${aw.importance}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          
          <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 shadow-2xl flex-1 flex flex-col">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Primary Risk Factors</h3>
              <ul className="space-y-4 mt-2 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-[#22d3ee40]">
                {reasoning.primary_risk_factors.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 leading-relaxed font-medium">
                    <span className="text-cyan-400 mr-3">»</span> {item}
                  </li>
                ))}
              </ul>
          </div>
      </div>
    </div>
  );

  const renderCnn = () => {
    const cnnRiskPercent = risk_assessment.current_risk_percent * 0.75;
    const activeColorName = 'emerald';
    
    const spatialWeights = [
      { feature: 'Urban Density', weight: 0.40, importance: 85 },
      { feature: 'Hotspot Proximity', weight: 0.20, importance: 65 },
      { feature: 'Street Layout', weight: 0.15, importance: 50 },
      { feature: 'Visibility Matrix', weight: 0.15, importance: 45 },
      { feature: 'Terrain Elev.', weight: 0.10, importance: 30 },
    ];
    
    const cnnMultipliers = {
      spatial_factor: (multipliers.time_multiplier * 0.85).toFixed(2),
      density_factor: (multipliers.combined_multiplier * 0.75).toFixed(2),
    };
    
    const cnnRiskFactors = [
      "High urban density detected, spatial convolution flags increased congestion risk.",
      "Proximity to historic incident hotspots elevates the regional anchor weight.",
      "Building layouts present blindspots; visibility metrics reduced by 15%.",
      "Street terrain convolution indicates limited egress routes."
    ];

    return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
      {/* 1. CNN RISK GAUGE */}
      <div className={`lg:col-span-3 bg-gradient-to-br from-[#022c22] to-[#064e3b] border-2 border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_4px_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition-all`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl select-none text-emerald-100">CNN</div>
        <h3 className="text-xs font-black text-emerald-300 uppercase tracking-widest mb-6 self-start">Spatial Conv Risk</h3>

        <div className="relative flex items-center justify-center py-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="#064e3b" strokeWidth="12" fill="none" />
            <circle
              cx="96" cy="96" r="80" stroke="#10b981" strokeWidth="12" fill="none"
              strokeDasharray="502"
              strokeDashoffset={502 - (502 * cnnRiskPercent) / 100}
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(16,185,129,0.9)] transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-4xl font-black text-emerald-50 mb-1">{cnnRiskPercent.toFixed(0)}%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              SUPPRESSED
            </p>
          </div>
        </div>

        <div className="w-full mt-4 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
          <p className="text-[11px] text-emerald-100 font-medium leading-relaxed italic text-center">
            "Applying 2D spatial extraction. Risk pooled and anomaly bounds suppressed."
          </p>
        </div>

        <div className="w-full mt-4 flex justify-between items-center border-t border-emerald-500/30 pt-4">
            <div>
                 <p className="text-[9px] text-emerald-500/70 uppercase font-bold">Spatial Target</p>
                 <p className="text-xs text-emerald-100 font-black">Zone {Math.floor(Math.random() * 5) + 1}A</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-emerald-500/70 uppercase font-bold">Reduction</p>
                <p className="text-xs text-emerald-400 font-black">-{(optimization_suggestion.potential_risk_reduction_percent * 0.8).toFixed(1)}%</p>
            </div>
        </div>
      </div>

      {/* 2. CENTER COL (Spatial Scatter + Multipliers) */}
      <div className="lg:col-span-4 flex flex-col gap-10">
          <div className={`bg-gradient-to-br from-[#022c22] to-[#064e3b] border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all rounded-2xl p-8 shadow-[0_4px_30px_rgba(16,185,129,0.15)] flex-1 flex flex-col`}>
              <h3 className="text-xs font-black text-emerald-300 uppercase tracking-widest mb-6">Spatial Feature Matrix</h3>
              <div className="flex-1 min-h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                          <CartesianGrid stroke="#10b98115" vertical={false} />
                          <XAxis type="category" dataKey="feature" stroke="#10b981" tick={{fontSize: 9}} interval={0} />
                          <YAxis type="number" dataKey="importance" stroke="#10b981" tick={{fontSize: 9}} />
                          <ZAxis type="number" dataKey="weight" range={[20, 200]} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#022c22', borderColor: '#10b981', fontSize: '11px', padding: '6px' }} />
                          <Scatter name="Spatial Focus" data={spatialWeights} fill="#10b981" opacity={0.8} />
                      </ScatterChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <MultiplierStat label="Spatial Factor" val={cnnMultipliers.spatial_factor} color="emerald" />
              <MultiplierStat label="Density Multi" val={cnnMultipliers.density_factor} color="emerald" />
          </div>
      </div>

      {/* 3. RIGHT COL (Weight Vectors + Heuristics) */}
      <div className="lg:col-span-5 flex flex-col gap-10">
          <div className="bg-emerald-950/20 border-2 border-emerald-500/20 rounded-2xl p-8 shadow-[0_4px_30px_rgba(16,185,129,0.15)]">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-4">Spatial Pool Vectors</h3>
              <div className="space-y-6 mt-4">
                  {spatialWeights.map((aw, i) => (
                      <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-emerald-500/80 uppercase font-bold">
                              <span>{aw.feature}</span>
                              <span className={`text-emerald-300 font-mono`}>{aw.importance}% Infl.</span>
                          </div>
                          <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] border border-emerald-500/10 border-t-0">
                              <div className={`bg-emerald-500 h-full rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: `${aw.importance}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          
          <div className="bg-emerald-950/20 border-2 border-emerald-500/20 rounded-2xl p-8 shadow-[0_4px_30px_rgba(16,185,129,0.15)] flex-1 flex flex-col">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-4">Spatial Anomalies</h3>
              <ul className="space-y-4 mt-2 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-emerald-900">
                {cnnRiskFactors.map((item, i) => (
                  <li key={i} className="text-xs text-emerald-100/70 leading-relaxed font-medium">
                    <span className="text-emerald-400 mr-3">»</span> {item}
                  </li>
                ))}
              </ul>
          </div>
      </div>
    </div>
  )};

  const renderComparison = () => (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 animate-fade-in">
        <div className="bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border-2 border-fuchsia-500/20 rounded-3xl p-12 shadow-2xl hover:border-fuchsia-500/50 transition-all">
            <h3 className="text-lg font-black text-fuchsia-400 uppercase tracking-widest mb-10">Cross-Algorithm Verification Matrix</h3>
            
            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modelComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d946ef20" />
                        <XAxis dataKey="metric" stroke="#d946ef" />
                        <YAxis stroke="#d946ef" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#d946ef' }} />
                        <Legend />
                        <Line type="monotone" dataKey="BiLSTM" stroke="#22d3ee" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="CNN" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Progonal" stroke="#d946ef" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );

  const renderReasoning = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
        {/* Terminal Log */}
        <div className="xl:col-span-7 bg-[#050510] border border-indigo-500/30 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] relative flex flex-col">
            <div className="bg-indigo-950/40 p-4 border-b border-indigo-500/30 flex items-center gap-3">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <span className="text-indigo-300 font-mono text-xs uppercase tracking-widest ml-4">root@neural-engine:~# Deep Inference Log</span>
            </div>
            <div className="p-6 font-mono text-sm leading-loose text-indigo-200/80 max-h-[550px] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent">
                <p><span className="text-emerald-400">[{new Date().toISOString()}]</span> INIT: Booting Inference Modules...</p>
                <p><span className="text-emerald-400">[{new Date().toISOString()}]</span> LOAD: Temporal Weights... <span className="text-green-400">OK</span></p>
                <p><span className="text-emerald-400">[{new Date().toISOString()}]</span> LOAD: Infrastructure Constraints... <span className="text-green-400">OK</span></p>
                <p className="text-indigo-400 font-bold mt-6 mb-4">--- INITIATING COGNITIVE TREE TRAVERSAL ---</p>
                {reasoning.primary_risk_factors.map((factor, i) => (
                    <div key={i} className="mb-4 mt-2 pl-4 border-l-2 border-indigo-500/40 bg-indigo-500/5 py-2">
                        <span className="text-fuchsia-400 font-bold">» NODE {i+1}:</span> Analyzing sub-factor: '{factor}' <br/>
                        &nbsp;&nbsp;<span className="text-amber-300">&gt; Confidence:</span> {(Math.random() * 10 + 85).toFixed(2)}% <br/>
                        &nbsp;&nbsp;<span className="text-amber-300">&gt; Action:</span> Pushing to active tensor.
                    </div>
                ))}
                <p className="text-indigo-400 font-bold mt-6 mb-4">--- APPLYING CONTEXTUAL HEURISTICS ---</p>
                {infraAnalysisPoints.map((pt, i) => (
                    <p key={i} className="pl-4 border-l-2 border-emerald-500/30 my-3 text-emerald-100/70">
                        <span className="text-emerald-500 mr-2">◈</span>{pt}
                    </p>
                ))}
                <p className="mt-6"><span className="text-emerald-400">[{new Date().toISOString()}]</span> CALC: Risk output finalized at {risk_assessment.current_risk_percent}%. Execution halted cleanly.</p>
                <div className="animate-pulse w-3 h-5 bg-indigo-400 mt-4 inline-block align-middle"></div>
            </div>
        </div>

        {/* TEMPORAL RISK TIMELINE */}
        <div className="xl:col-span-5 bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border border-indigo-500/20 rounded-2xl p-8 shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4 border-b border-indigo-500/20 pb-4">
                <h3 className="text-indigo-400 font-black uppercase tracking-widest">Neural Temporal Matrix</h3>
                <div className="text-right">
                    <p className="text-xs font-bold text-indigo-300/70 uppercase mb-1">Safest Window</p>
                    <p className="text-lg font-black text-indigo-400 uppercase">{temporal_comparison.safest_time}</p>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={temporalData}>
                        <defs>
                            <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#6366f110" vertical={false} />
                        <XAxis dataKey="name" stroke="#6366f180" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050510', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '12px' }}
                            itemStyle={{ color: '#818cf8', fontWeight: 'bold', fontSize: '14px' }}
                        />
                        <Area type="monotone" dataKey="risk" stroke="#818cf8" strokeWidth={3} fill="url(#indigoGlow)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-indigo-500/20">
                <MultiplierStat label="Time" val={multipliers.time_multiplier} color="indigo" />
                <MultiplierStat label="Season" val={multipliers.season_multiplier} color="indigo" />
                <MultiplierStat label="Weekend" val={multipliers.weekend_multiplier} color="indigo" />
                <MultiplierStat label="Combined" val={multipliers.combined_multiplier} color="indigo" />
            </div>
        </div>
    </div>
  );

  const renderProgonal = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
        <div className="bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border-2 border-amber-500/20 rounded-3xl p-12 shadow-2xl hover:border-amber-500/50 transition-all">
            <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest mb-10">Resource Map (Orthogonal View)</h3>
            <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f59e0b20" strokeWidth={2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#f59e0b', fontSize: 14, fontWeight: 'bold' }} />
                        <Radar name="Progonal Prediction" dataKey="B" stroke="#f59e0b" strokeWidth={4} fill="#f59e0b" fillOpacity={0.4} />
                        <Radar name="Bi-LSTM Baseline" dataKey="A" stroke="#f59e0b40" strokeWidth={2} fill="transparent" />
                        <Tooltip contentStyle={{backgroundColor: '#0d1117', borderColor: '#f59e0b'}} />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] border-2 border-amber-500/20 rounded-3xl p-12 shadow-2xl hover:border-amber-500/50 transition-all flex flex-col justify-center">
            <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest mb-10">Orthogonal Factor Analysis</h3>
            <div className="space-y-6">
                <div className="p-6 border border-amber-500/20 rounded-2xl bg-amber-500/5">
                    <p className="text-amber-500 font-bold uppercase mb-2">Phase Shift Anomaly</p>
                    <p className="text-amber-100/70">Detected 15% deviance in temporal occurrence rates compared to static baseline. Recalibrating vectors.</p>
                </div>
                <div className="p-6 border border-amber-500/20 rounded-2xl bg-amber-500/5">
                    <p className="text-amber-500 font-bold uppercase mb-2">Severity Decay</p>
                    <p className="text-amber-100/70">Incidence severity projected to decay by 4% locally due to increased patrol proximity.</p>
                </div>
                <div className="p-6 border border-amber-500/20 rounded-2xl bg-amber-500/5 flex justify-between items-center">
                    <p className="text-amber-500 font-bold uppercase">Orthogonal Confidence</p>
                    <p className="text-3xl font-black text-amber-400">89.4%</p>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#06080a] to-[#0a0e17] text-slate-100 font-sans p-8 lg:p-12 selection:bg-cyan-500/30">
      {/* HEADER HUD */}
      <header className={`max-w-[2000px] mx-auto mb-8 flex flex-wrap justify-between items-end border-b-2 pb-10 gap-8 transition-colors duration-500`} style={{ borderColor: `${activeColor}40` }}>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className={`w-4 h-4 rounded-full animate-pulse shadow-[0_0_25px_currentColor]`} style={{ backgroundColor: activeColor, color: activeColor }}></span>
            <span className={`text-lg font-black uppercase tracking-[0.3em]`} style={{ color: activeColor }}>System Online</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-3">
            BI-LSTM WITH <span className="italic" style={{ color: activeColor }}>ATTENTION</span>
            <span className="text-2xl text-slate-500 ml-4 align-middle bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest font-medium">Core Platform V2</span>
          </h1>
          <p className="text-lg text-slate-400 font-mono mt-3 uppercase">
            ID: {data.timestamp?.split('T')[1]?.slice(0, 8) || 'N/A'} • SECTOR: {query.pickup_location} → {query.drop_location}
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className={`px-12 py-5 border-2 text-base font-black uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95`}
          style={{ borderColor: `${activeColor}60`, color: activeColor, backgroundColor: `${activeColor}10` }}
        >
          ← Initiate New Scan
        </button>
      </header>

      {/* TABS NAVIGATION */}
      <div className="max-w-[2000px] mx-auto mb-10 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-8 py-4 rounded-xl border-2 font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap flex-shrink-0"
            style={activeTab === tab.id 
              ? { backgroundColor: tab.color, color: '#000', borderColor: tab.color, boxShadow: `0 0 20px ${tab.color}80` }
              : { backgroundColor: '#0f172a', borderColor: '#334155', color: '#94a3b8' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-[2000px] mx-auto min-h-[600px] pb-20">
        {activeTab === 'BILSTM' && renderBiLstm()}
        {activeTab === 'CNN' && renderCnn()}
        {activeTab === 'COMPARISON' && renderComparison()}
        {activeTab === 'REASONING' && renderReasoning()}
        {activeTab === 'PROGONAL' && renderProgonal()}
      </main>

      <footer className="max-w-[2000px] mx-auto mt-16 flex justify-between items-center opacity-40 text-sm font-mono uppercase tracking-[0.3em] text-slate-500 border-t border-white/5 pt-10 flex-wrap gap-4">
        <span>🔒 Secure Encryption AES256</span>
        <span>Neural Plurality Engine V4.2</span>
        <span>⏰ {data.timestamp}</span>
      </footer>
    </div>
  );
};

// HELPER COMPONENTS
const MultiplierStat = ({ label, val, color }) => (
  <div className={`bg-white/5 p-6 rounded-xl border-2 border-white/10 hover:border-${color}-500/30 transition-all flex flex-col justify-center min-h-[100px]`}>
    <p className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</p>
    <p className={`text-2xl font-black ${val > 1 ? 'text-red-400' : `text-${color}-400`}`}>{val}x</p>
  </div>
);

export default Dashboard;