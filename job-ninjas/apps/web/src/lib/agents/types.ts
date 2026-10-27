export interface AgentContext {
  runId: string;
  roleId: string;
  candidateId: string;
  organizationId: string;
  nodeId?: string;
  upstreamOutputs: Record<string, any>; // outputs from connected nodes
  // Pre-loaded for convenience
  role: any;
  candidate: any;
}

export interface AgentResult {
  outputPayload: any;
  artifacts?: Array<{ type: string; data: any }>;
  events?: Array<{ type: string; payload: any }>;
  nextActions?: string[];
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  
  // Required upstream artifact types
  requiredInputs: string[];

  // JD parsing can run before any candidate exists. Defaults to true.
  needsCandidate?: boolean;
  
  execute: (context: AgentContext) => Promise<AgentResult>;
}
