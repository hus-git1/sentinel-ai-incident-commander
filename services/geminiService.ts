
import { GoogleGenAI, Type } from "@google/genai";
import { IncidentAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    severity: { type: Type.STRING },
    confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
    threatCause: { type: Type.STRING },
    killChainStage: { type: Type.STRING },
    mitreMapping: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'e.g. T1078' },
          name: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['id', 'name', 'description']
      }
    },
    immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
    reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
    teamsInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
    followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    playbookSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          action: { type: Type.STRING },
          responsibility: { type: Type.STRING }
        },
        required: ['phase', 'action', 'responsibility']
      }
    }
  },
  required: ['summary', 'severity', 'confidence', 'threatCause', 'killChainStage', 'mitreMapping', 'immediateActions', 'reasoning', 'teamsInvolved', 'followUpQuestions', 'playbookSteps'],
};

export const analyzeIncident = async (input: string, base64DataUrl?: string): Promise<IncidentAnalysis> => {
  let promptContext = "Analyze the provided security information as a professional SOC Incident Commander. ";
  
  if (input.trim() && base64DataUrl) {
    promptContext += "Analyze BOTH the provided telemetry logs AND the visual evidence (network diagram/screenshot). Cross-reference them for consistency.";
  } else if (input.trim()) {
    promptContext += "Analyze the provided telemetry logs. Focus on pattern detection and kill-chain reconstruction from text data.";
  } else if (base64DataUrl) {
    promptContext += "Analyze the provided visual evidence (network diagram/screenshot). Identify architectural risks, potential lateral movement paths, or misconfigurations shown.";
  }

  // Ensure prompt is never empty
  const parts: any[] = [{ text: `${promptContext}\n\nData Context:\n${input || "No text logs provided. Proceeding with visual analysis only."}` }];
  
  if (base64DataUrl) {
    try {
      // Strictly parse the Data URL to prevent invalid characters in the API payload
      const match = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/);
      
      if (match) {
        const mimeType = match[1];
        const data = match[2]; // Captured group 2 is the pure base64 string
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: data
          }
        });
      } else {
        console.warn("Invalid Data URL format detected. Skipping image attachment.");
      }
    } catch (e) {
      console.error("Error processing image data:", e);
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: `You are a high-level SOC Incident Commander. 
      Analyze provided data (logs and/or images). 
      Exhaustively map findings to MITRE ATT&CK techniques. 
      Determine the Kill Chain stage accurately. 
      Provide a structured NIST-aligned response in JSON.
      Classify Severity strictly as: Low, Medium, High, or Critical.`,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Empty response from AI engine.");
  }

  const result = JSON.parse(responseText);

  // NORMALIZATION LAYER: Ensure severity always matches 'Severity' type strictly
  const rawSeverity = (result.severity || '').toString().toLowerCase().trim();
  let normalizedSeverity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium'; // Fallback

  if (rawSeverity.includes('critical')) normalizedSeverity = 'Critical';
  else if (rawSeverity.includes('high')) normalizedSeverity = 'High';
  else if (rawSeverity.includes('medium')) normalizedSeverity = 'Medium';
  else if (rawSeverity.includes('low')) normalizedSeverity = 'Low';

  result.severity = normalizedSeverity;

  return result as IncidentAnalysis;
};
