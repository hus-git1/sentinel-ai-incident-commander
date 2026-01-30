
import React from 'react';
import { Severity } from '../types';

interface Props {
  severity: Severity;
}

export const SeverityBadge: React.FC<Props> = ({ severity }) => {
  const getColors = () => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${getColors()}`}>
      {severity}
    </span>
  );
};
