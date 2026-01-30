
import React from 'react';
import { MitreTechnique } from '../types';

export const MitreCard: React.FC<{ technique: MitreTechnique }> = ({ technique }) => (
  <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-lg hover:border-blue-500/50 transition-colors">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-bold text-blue-400 font-mono tracking-widest">{technique.id}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
    </div>
    <h4 className="text-sm font-bold text-slate-200 mb-1">{technique.name}</h4>
    <p className="text-[11px] text-slate-400 leading-relaxed">{technique.description}</p>
  </div>
);
