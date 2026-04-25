import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Trial = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Simulate real-time data updates
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      
      
      <main className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 2. BACKGROUND ARCHITECTURE */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* 3. LEFT COLUMN: THE OFFER */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-20 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400">Urban Ride Safety System</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold text-white tracking-tight leading-[0.9] mb-8">
              Urban Ride <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Safety.</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              Unlock the full suite of predictive analytics and real-time monitoring for urban commutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => navigate('/home')}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center group"
              >
                Get Started Now
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <div className="flex items-center px-6 py-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="text-slate-400 text-sm">System Active. <strong>Continuous</strong> Threat Monitoring.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">2k+</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Nodes</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">0.4ms</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Latency</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Uptime</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">AES</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">256-bit</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. RIGHT COLUMN: SERVICE PREVIEW (DASHBOARD AESTHETIC) */}
        <div className="relative z-10 flex-1 hidden lg:flex items-center justify-center p-12">
          <div className="relative w-full max-w-xl aspect-square">
            {/* The "Main" Interface Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden p-1 flex flex-col">
              
              {/* Fake UI Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">{time} // SESSION_ACTIVE</div>
              </div>

              {/* Fake Content Area */}
              <div className="flex-1 p-6 space-y-6">
                <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center relative group">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[80%] h-[1px] bg-blue-500/50 shadow-[0_0_15px_blue]"></div>
                   </div>
                   <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Scanning Perimeter...</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/5 p-3">
                      <div className="w-8 h-1 bg-white/20 rounded-full mb-3"></div>
                      <div className="w-full h-2 bg-white/10 rounded-full"></div>
                      <div className="w-[60%] h-2 bg-white/10 rounded-full mt-2"></div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Feed</span>
                    <span className="text-[10px] text-blue-400 font-mono">ENCRYPTED</span>
                  </div>
                  <div className="h-24 rounded-lg bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col opacity-20">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-1 border-b border-white/20"></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Orbitals */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </main>

      {/* FOOTER STRIP */}
      <footer className="relative z-50 px-8 py-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <div>© 2025 URBAN RIDE SAFETY PROJECT</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Trial;