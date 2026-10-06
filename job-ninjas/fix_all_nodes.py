import os
import re

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
with open(canvas_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Modify the <g> tag in renderLayer to include "group" class
target_g = """      <g 
        key={layerId} 
        transform={`translate(${layer.x}, ${layer.y})`} 
        className={canvasState.mode === CanvasMode.None ? "cursor-move" : ""}"""

replacement_g = """      <g 
        key={layerId} 
        transform={`translate(${layer.x}, ${layer.y})`} 
        className={`group ${canvasState.mode === CanvasMode.None ? "cursor-move" : ""}`}"""

target_g_crlf = target_g.replace('\n', '\r\n')
if target_g in content:
    content = content.replace(target_g, replacement_g)
elif target_g_crlf in content:
    content = content.replace(target_g_crlf, replacement_g)


# 2. Add the Quick Add button at the end of renderLayer
target_end_render = """          >
            {layer.value}
          </text>
        )}
      </g>
    );
  };"""

quick_add_html = """          >
            {layer.value}
          </text>
        )}

        {/* Quick Add Button on Hover */}
        <g className={`transition-opacity ${quickAddMenuFor === layerId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <path 
            d={`M ${layer.width || 100} ${(layer.height || 100) / 2} L ${(layer.width || 100) + 24} ${(layer.height || 100) / 2}`}
            stroke="#3b82f6" 
            strokeWidth="3" 
            markerEnd="url(#arrowhead)"
          />
          <foreignObject
            x={(layer.width || 100) + 16}
            y={(layer.height || 100) / 2 - 250}
            width={400}
            height={500}
            className="overflow-visible"
            style={{ pointerEvents: 'none' }}
          >
            <div className="relative w-full h-full pointer-events-none">
              <div className="absolute top-1/2 left-0 pointer-events-auto" style={{ transform: 'translateY(-50%)' }}>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQuickAddMenuFor(quickAddMenuFor === layerId ? null : layerId);
                  }}
                  className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all hover:scale-110 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {quickAddMenuFor === layerId && (
                  <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 bg-white shadow-2xl border border-slate-200 rounded-xl p-2 flex flex-col gap-1 w-64 animate-in fade-in zoom-in-95 pointer-events-auto">
                    <div className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mb-1 flex justify-between items-center">
                      <span>Add Connected Node</span>
                      <button onClick={(e) => { e.stopPropagation(); setQuickAddMenuFor(null); }} className="hover:text-slate-800"><X className="w-3 h-3" /></button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                      {AGENTS.map((agent) => (
                        <button
                          key={agent.role}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newId = insertLayer(
                              LayerType.Agent,
                              { x: layer.x + (layer.width || 100) + 100, y: layer.y },
                              { r: 255, g: 255, b: 255 },
                              undefined,
                              agent.role
                            );
                            insertEdge(layerId, newId);
                            setSelection([newId]);
                            setQuickAddMenuFor(null);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group/agent text-left"
                        >
                          <div className={`p-1.5 rounded-md ${agent.bg} ${agent.color}`}>
                            <agent.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover/agent:text-slate-900">
                            {agent.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </foreignObject>
        </g>
      </g>
    );
  };"""

target_end_crlf = target_end_render.replace('\n', '\r\n')
if target_end_render in content:
    content = content.replace(target_end_render, quick_add_html)
elif target_end_crlf in content:
    content = content.replace(target_end_crlf, quick_add_html)


# 3. Remove the Quick Add Button from the selections block at the bottom
target_selection_quick_add = """                  <SelectionBox
                    bounds={bounds}
                    zoom={camera.zoom}
                    onResizeHandlePointerDown={onResizeHandlePointerDown}
                  />
                  {/* Quick Add Button */}
                  <foreignObject
                    x={bounds.x + bounds.width + 16}
                    y={bounds.y + bounds.height / 2 - 250}
                    width={400}
                    height={500}
                    className="overflow-visible"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="relative w-full h-full pointer-events-none">
                      <div className="absolute top-1/2 left-0 pointer-events-auto" style={{ transform: 'translateY(-50%)' }}>
                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === layerId ? null : layerId);
                          }}
                          className="w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all hover:scale-110 active:scale-95"
                        >
                          <Plus className="w-5 h-5" />
                        </button>

                        {quickAddMenuFor === layerId && (
                          <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 bg-white shadow-2xl border border-slate-200 rounded-xl p-2 flex flex-col gap-1 w-64 animate-in fade-in zoom-in-95 pointer-events-auto">
                            <div className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mb-1 flex justify-between items-center">
                              <span>Add Connected Node</span>
                              <button onClick={(e) => { e.stopPropagation(); setQuickAddMenuFor(null); }} className="hover:text-slate-800"><X className="w-3 h-3" /></button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto pr-1">
                              {AGENTS.map((agent) => (
                                <button
                                  key={agent.role}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const newId = insertLayer(
                                      LayerType.Agent,
                                      { x: bounds.x + bounds.width + 150, y: bounds.y },
                                      { r: 255, g: 255, b: 255 },
                                      undefined,
                                      agent.role
                                    );
                                    insertEdge(layerId, newId);
                                    setSelection([newId]);
                                    setQuickAddMenuFor(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group text-left"
                                >
                                  <div className={`p-1.5 rounded-md ${agent.bg} ${agent.color}`}>
                                    <agent.icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                    {agent.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </foreignObject>
                </g>"""

replacement_selection_quick_add = """                  <SelectionBox
                    bounds={bounds}
                    zoom={camera.zoom}
                    onResizeHandlePointerDown={onResizeHandlePointerDown}
                  />
                </g>"""

target_sel_crlf = target_selection_quick_add.replace('\n', '\r\n')
if target_selection_quick_add in content:
    content = content.replace(target_selection_quick_add, replacement_selection_quick_add)
elif target_sel_crlf in content:
    content = content.replace(target_sel_crlf, replacement_selection_quick_add)


with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Canvas quick add button attached to all nodes")
