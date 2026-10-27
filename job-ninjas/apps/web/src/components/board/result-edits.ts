import { useBoardStore } from "@/store/board";
import { activityLine, isSharedStep, outputForCandidate } from "@/lib/agents/contracts";

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
  const scoped = who ? outputForCandidate(layer as { agentRole?: string; status?: string; outputData?: unknown; config?: Record<string, any> }, who) : undefined;
  const baseResult = scoped && typeof scoped === "object" ? scoped : {};
  if (who) {
    map[who] = { ...(map[who] || {}), ...patch };
    const results = { ...(config.resultsByCandidate || {}) };
    results[who] = { ...baseResult, ...patch };
    config.resultsByCandidate = results;
    state.pushActivity(who, editActivity(kind, patch));
  }
  config[key] = map;
  const update: Record<string, unknown> = { config };
  if (!who || who === active) {
    update.outputData = { ...baseResult, ...patch };
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
  const scoped = outputForCandidate(node, candidateId) || (!candidateId && activeId ? outputForCandidate(node, activeId) : undefined);
  if (scoped && typeof scoped === "object") return scoped;
  return null;
}

function editActivity(kind: ResultKind, patch: Record<string, unknown>) {
  if (kind === "shortlist") {
    const label = typeof patch.rankLabel === "string"
      ? patch.rankLabel
      : patch.advance === true
        ? "Advance"
        : patch.advance === false
          ? "Pass"
          : "";
    if (label) return `Shortlist set to ${label}`;
    if (typeof patch.reason === "string") return "Shortlist reason saved";
    return "Shortlist updated";
  }
  if (kind === "outreach") return "Outreach draft updated";
  if ("preferredSlot" in patch) return "Preferred time saved";
  return "Interview times updated";
}

export function markCandidateRun(layerId: string, candidateId: string) {
  const state = useBoardStore.getState();
  const layer = state.layers[layerId] as { config?: Record<string, any>; agentRole?: string } | undefined;
  if (!layer || isSharedStep(layer.agentRole)) {
    state.updateLayer(layerId, { status: "running", errorDetails: undefined } as any);
    return;
  }
  const previous = layer.config?.lastRunCandidateId;
  state.updateLayer(layerId, {
    status: "running",
    errorDetails: undefined,
    config: {
      ...(layer.config || {}),
      lastRunCandidateId: candidateId,
      previousLastRunCandidateId: previous === candidateId ? layer.config?.previousLastRunCandidateId : previous,
    },
  } as any);
}

export function settleStoppedRun(layerId: string, candidateId: string) {
  const state = useBoardStore.getState();
  const layer = state.layers[layerId] as { config?: Record<string, any>; agentRole?: string; outputData?: unknown } | undefined;
  if (!layer) return;
  if (isSharedStep(layer.agentRole) || !candidateId) {
    const had = layer.outputData != null && layer.outputData !== "";
    state.updateLayer(layerId, { status: had ? "success" : "idle", errorDetails: undefined } as any);
    return;
  }
  const config = { ...(layer.config || {}) };
  const saved = config.resultsByCandidate?.[candidateId];
  if (saved !== undefined) {
    config.lastRunCandidateId = candidateId;
    delete config.previousLastRunCandidateId;
    state.updateLayer(layerId, { status: "success", outputData: saved, errorDetails: undefined, config } as any);
    return;
  }
  if (config.lastRunCandidateId === candidateId) {
    config.lastRunCandidateId = config.previousLastRunCandidateId;
  }
  delete config.previousLastRunCandidateId;
  state.updateLayer(layerId, { status: "idle", errorDetails: undefined, config } as any);
}

export function recordCandidateRun(
  layerId: string,
  candidateId: string,
  result: { ok: true; output: unknown; executionTimeMs?: number; input?: unknown; runId?: string } | { ok: false; error: string; executionTimeMs?: number; input?: unknown },
) {
  const state = useBoardStore.getState();
  const layer = state.layers[layerId] as { config?: Record<string, any>; agentRole?: string; outputData?: unknown } | undefined;
  if (!layer) return;
  const failedBecauseUpstream = !result.ok && result.error.startsWith("Stopped because");
  if (candidateId && !failedBecauseUpstream) {
    state.pushActivity(candidateId, activityLine(layer.agentRole, result.ok ? result.output : undefined, result.ok));
  }
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
  delete config.previousLastRunCandidateId;
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
