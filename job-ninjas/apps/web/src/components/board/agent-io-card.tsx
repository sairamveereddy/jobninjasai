"use client";

import { getNodeSpec } from "@/lib/agents/node-specs";
import {
  RESUME_INPUT_HELP,
  dataTypeLabel,
  explainAgent,
  plainLanguage,
  portLabel,
  portsCompatible,
  type FlowEdge,
} from "@/lib/agents/contracts";
import { useBoardStore } from "@/store/board";

export function AgentIoCard({
  agentRole,
  layerId,
  mode,
}: {
  agentRole?: string;
  layerId: string;
  mode: "input" | "output";
}) {
  const spec = getNodeSpec(agentRole);
  const edges = useBoardStore((state) => state.edges);
  const layers = useBoardStore((state) => state.layers);

  const incoming = Object.values(edges).filter((edge) => edge.toNodeId === layerId);

  if (mode === "output") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold text-slate-800">What this step produces</p>
        <p className="mt-1 text-[11px] text-slate-600">{plainLanguage(agentRole)}</p>
        <p className="mt-1 text-[11px] text-slate-500">{explainAgent(agentRole)}</p>
        <ul className="mt-3 space-y-2">
          {spec.outputs.map((port) => (
            <li key={port.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800">{port.name}</span>
                <TypePill label={dataTypeLabel(port.type)} />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{port.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const wantsResume = spec.inputs.some((port) => port.type === "Resume" || port.source === "candidate" && port.type === "Resume");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-800">What this step needs</p>
      <p className="mt-1 text-[11px] text-slate-600">{plainLanguage(agentRole)}</p>
      <p className="mt-1 text-[11px] text-slate-500">{explainAgent(agentRole)}</p>
      <ul className="mt-3 space-y-2">
        {spec.inputs.length === 0 && (
          <li className="text-[11px] text-slate-500">This step starts the pipeline. It does not need another agent in front of it.</li>
        )}
        {spec.inputs.map((port) => {
          const providers = incoming.flatMap((edge) => {
            const source = layers[edge.fromNodeId] as { agentRole?: string; value?: string } | undefined;
            if (!source) return [];
            const sourceSpec = getNodeSpec(source.agentRole);
            const hit = sourceSpec.outputs.some((output) => portsCompatible(output.type, port.type));
            if (!hit) return [];
            return [source.value || sourceSpec.displayName];
          });
          return (
            <li key={port.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-800">{port.name}</span>
                <TypePill label={dataTypeLabel(port.type)} />
                <span className="text-[10px] font-semibold uppercase text-slate-400">{port.required ? "Required" : "Optional"}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{port.description}</p>
              <p className={`mt-1 text-[11px] font-medium ${providers.length ? "text-emerald-700" : "text-slate-500"}`}>
                {providers.length
                  ? `Wired from ${providers.join(", ")}. This line carries ${portLabel(port)}.`
                  : port.source === "board"
                    ? "Taken from the job description on this role."
                    : port.source === "candidate"
                      ? "Taken from the candidate you pick on this role."
                      : `Connect a previous step that sends ${portLabel(port)}.`}
              </p>
            </li>
          );
        })}
      </ul>
      {(wantsResume || agentRole === "input-resume" || agentRole === "agent-resume" || agentRole === "agent-resume-parser" || agentRole === "agent-screen") && (
        <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
          <p className="text-xs font-bold text-indigo-900">How to give this step a resume</p>
          <ol className="mt-2 space-y-1.5">
            {RESUME_INPUT_HELP.map((item, index) => (
              <li key={item.id} className="text-[11px] text-indigo-950">
                <span className="font-semibold">{index + 1}. {item.title}. </span>
                {item.detail}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function TypePill({ label }: { label: string }) {
  return <span className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-[10px] font-bold text-indigo-700">{label}</span>;
}

export function edgeCarriesLabel(edge: FlowEdge): string {
  return edge.carries?.length ? edge.carries.join(" · ") : edge.label || "";
}
