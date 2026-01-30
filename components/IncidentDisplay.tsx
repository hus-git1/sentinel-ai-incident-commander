
import React, { useState } from 'react';
import { IncidentAnalysis } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { MitreCard } from './MitreCard';

interface Props {
  analysis: IncidentAnalysis;
}

export const IncidentDisplay: React.FC<Props> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'killchain' | 'playbook'>('assessment');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex gap-4">
          {(['assessment', 'killchain', 'playbook'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.replace(/([A-Z])/g, ' $1').trim()}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Commander Confidence</div>
            <div className={`text-sm font-mono font-bold ${analysis.confidence > 80 ? 'text-green-400' : analysis.confidence > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {analysis.confidence}%
            </div>
          </div>
          <SeverityBadge severity={analysis.severity} />
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'assessment' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <section>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Incident Executive Summary
              </h3>
              <p className="text-slate-400 leading-relaxed">{analysis.summary}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Likely Threat Cause</h4>
                <p className="text-sm text-slate-200">{analysis.threatCause}</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Current Kill Chain Stage</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200">{analysis.killChainStage}</span>
                  <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${(['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation', 'Installation', 'Command and Control', 'Actions on Objectives'].indexOf(analysis.killChainStage) + 1) * 14.2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <section>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Logical Reasoning Path</h4>
              <div className="space-y-2">
                {analysis.reasoning.map((step, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-400 italic">
                    <span className="text-blue-500/50 font-mono">[{i+1}]</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'killchain' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full"></span>
              MITRE ATT&CK Mapping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.mitreMapping.map((tech, i) => (
                <MitreCard key={i} technique={tech} />
              ))}
            </div>
            
            <section className="mt-8 p-4 bg-red-950/10 border border-red-900/30 rounded-xl">
              <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Incident Response Stakeholders</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.teamsInvolved.map((team, i) => (
                  <span key={i} className="px-2 py-1 bg-red-900/20 text-red-300 text-[10px] font-bold rounded border border-red-900/40 uppercase tracking-tight">
                    {team}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded-full"></span>
              NIST Response Playbook
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="p-3">Phase</th>
                    <th className="p-3">Required Action</th>
                    <th className="p-3">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analysis.playbookSteps.map((step, i) => (
                    <tr key={i} className="bg-slate-900/30">
                      <td className="p-3 font-bold text-blue-400">{step.phase}</td>
                      <td className="p-3 text-slate-300">{step.action}</td>
                      <td className="p-3 text-[11px] text-slate-500 font-mono">{step.responsibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section className="p-4 bg-orange-900/10 border border-orange-900/20 rounded-xl">
              <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Missing Intelligence (Commander Inquiries)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 italic opacity-80">
                {analysis.followUpQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
