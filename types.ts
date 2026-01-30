
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
}

export interface IncidentAnalysis {
  summary: string;
  severity: Severity;
  confidence: number;
  threatCause: string;
  killChainStage: 'Reconnaissance' | 'Weaponization' | 'Delivery' | 'Exploitation' | 'Installation' | 'Command and Control' | 'Actions on Objectives';
  mitreMapping: MitreTechnique[];
  immediateActions: string[];
  reasoning: string[];
  teamsInvolved: string[];
  followUpQuestions: string[];
  playbookSteps: {
    phase: string;
    action: string;
    responsibility: string;
  }[];
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  rawInput: string;
  imagePreview?: string;
  analysis?: IncidentAnalysis;
  status: 'pending' | 'analyzed' | 'error';
}

export enum AnalysisState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
