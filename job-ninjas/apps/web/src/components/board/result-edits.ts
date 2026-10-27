import { useBoardStore } from "@/store/board";

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
  if (who) map[who] = { ...(map[who] || {}), ...patch };
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
  if (candidateId && candidateId === activeId && node?.outputData && typeof node.outputData === "object") return node.outputData;
  return null;
}
