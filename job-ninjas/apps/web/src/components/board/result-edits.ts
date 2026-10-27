import { useBoardStore } from "@/store/board";
import { isSharedStep } from "@/lib/agents/contracts";

type ResultKind = "shortlist" | "outreach" | "schedule";

const ROLE: Record<ResultKind, string> = {
  shortlist: "agent-shortlist",
  outreach: "agent-outreach",
  schedule: "agent-schedule",
};

const CONFIG_KEY: Record<ResultKind, string> = {
  shortlist: "shortlistByCandidate",
  outreach: "outreachByCandidate",
  schedule: "scheduleByCandidate",
};

export function saveResultEdit(kind: ResultKind, candidateId: string | null | undefined, patch: Record<string, unknown>) {
  const state = useBoardStore.getState();
  const layerId = state.layerIds.find((id) => (state.layers[id] as { agentRole?: string }).agentRole === ROLE[kind]);
  if (!layerId) return;
  const layer = state.layers[layerId] as { config?: Record<string, any>; outputData?: unknown };
  const config = { ...(layer.config || {}) };
  const key = CONFIG_KEY[kind];
  const map = { ...(config[key] || {}) };
  const active = typeof window !== "undefined" ? window.localStorage.getItem("activeCandidateId") : "";
  const who = candidateId || active || "";
  if (who) {
    map[who] = { ...(map[who] || {}), ...patch };
    const results = { ...(config.resultsByCandidate || {}) };
    const baseResult = results[who] && typeof results[who] === "object"
      ? results[who]
      : config.lastRunCandidateId === who && layer.outputData && typeof layer.outputData === "object"
        ? layer.outputData
        : {};
    results[who] = { ...baseResult, ...patch };
    config.resultsByCandidate = results;
  }
  config[key] = map;
  const update: Record<string, unknown> = { config };
  if (!who || who === active) {
    const base = layer.outputData && typeof layer.outputData === "object" ? layer.outputData : {};
    update.outputData = { ...(base as object), ...patch };
  }
  state.updateLayer(layerId, update as any);
}

export function personResult(
  layers: Record<string, any>,
  candidateId: string,
  activeId: string | null,
  role: string,
  artifact: any,
  configKey: string,
) {
  const node = Object.values(layers).find((layer) => layer?.agentRole === role);
  const saved = node?.config?.[configKey]?.[candidateId];
  if (saved) return { ...(artifact || {}), ...saved };
  if (artifact) return artifact;
  const scoped = node?.config?.resultsByCandidate?.[candidateId]
    ?? (node?.config?.lastRunCandidateId === candidateId ? node?.outputData : undefined);
  if (scoped && typeof scoped === "object") return scoped;
  if (!candidateId && activeId && node?.config?.lastRunCandidateId === activeId && node?.outputData && typeof node.outputData === "object") {
    return node.outputData;
  }
  return null;
}

export function markCandidateRun(layerId: string, candidateId: string) {
  const state = useBoardStore.getState();
  const layer = state.layers[layerId] as { config?: Record<string, any>; agentRole?: string } | undefined;
  if (!layer || isSharedStep(layer.agentRole)) {
    state.updateLayer(layerId, { status: "running", errorDetails: undefined } as any);
    return;
  }
  state.updateLayer(layerId, {
    status: "running",
    errorDetails: undefined,
    config: { ...(layer.config || {}), lastRunCandidateId: candidateId },
  } as any);
}

export function recordCandidateRun(
  layerId: string,
  candidateId: string,
  result: { ok: true; output: unknown; executionTimeMs?: number; input?: unknown; runId?: string } | { ok: false; error: string; executionTimeMs?: number; input?: unknown },
) {
  const state = useBoardStore.getState();
  const layer = state.layers[layerId] as { config?: Record<string, any>; agentRole?: string; outputData?: unknown } | undefined;
  if (!layer) return;
  if (isSharedStep(layer.agentRole) || !candidateId) {
    state.updateLayer(layerId, result.ok
      ? { status: "success", outputData: result.output, errorDetails: undefined, executionTimeMs: result.executionTimeMs, inputData: result.input, runId: result.runId }
      : { status: "error", errorDetails: result.error, executionTimeMs: result.executionTimeMs, inputData: result.input } as any);
    return;
  }
  const config = { ...(layer.config || {}) };
  const results = { ...(config.resultsByCandidate || {}) };
  const errors = { ...(config.errorsByCandidate || {}) };
  config.lastRunCandidateId = candidateId;
  if (result.ok) {
    results[candidateId] = result.output;
    delete errors[candidateId];
    config.resultsByCandidate = results;
    config.errorsByCandidate = errors;
    state.updateLayer(layerId, {
      status: "success",
      outputData: result.output,
      errorDetails: undefined,
      executionTimeMs: result.executionTimeMs,
      inputData: result.input,
      runId: result.runId,
      config,
    } as any);
    return;
  }
  errors[candidateId] = result.error;
  config.resultsByCandidate = results;
  config.errorsByCandidate = errors;
  state.updateLayer(layerId, {
    status: "error",
    errorDetails: result.error,
    executionTimeMs: result.executionTimeMs,
    inputData: result.input,
    config,
  } as any);
}
