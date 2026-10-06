import os

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
with open(canvas_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the text rendering block with foreignObject textarea
old_text_block = """        {/* If the layer has a value and it's not a Text or Agent layer, render it as text inside */}
        {layer.value && layer.type !== LayerType.Text && layer.type !== LayerType.Agent && (
          <text 
            x={(layer.width || 100) / 2} 
            y={(layer.height || 100) / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={16}
            fontWeight="500"
            fill="#334155"
          >
            {layer.value}
          </text>
        )}"""

new_text_block = """        {/* Inline editable text for Shapes and Notes */}
        {layer.type !== LayerType.Text && layer.type !== LayerType.Agent && layer.type !== LayerType.Image && layer.type !== LayerType.Path && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 100}
            height={layer.height || 100}
          >
            <div className="w-full h-full flex items-center justify-center p-2">
              <textarea
                value={layer.value || ""}
                onChange={(e) => updateLayer(layerId, { value: e.target.value })}
                placeholder={isSelected ? "Type here..." : ""}
                className={`w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-slate-500/50 flex items-center justify-center ${!isSelected && 'pointer-events-none'}`}
                style={{
                  textAlign: 'center',
                  fontFamily: (layer as any).fontFamily || 'inherit',
                  fontSize: `${(layer as any).fontSize || 16}px`,
                  color: (layer as any).color || '#334155',
                  paddingTop: ((layer.height || 100) / 2) - ((layer as any).fontSize || 16) - 10,
                }}
                onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </foreignObject>
        )}"""

if old_text_block in content:
    content = content.replace(old_text_block, new_text_block)
else:
    content = content.replace(old_text_block.replace('\n', '\r\n'), new_text_block)


# Fix Text layer to also be inline editable
old_text_layer = """        {layer.type === LayerType.Text && (
          <text 
            x={0} 
            y={24}
            fontSize={24}
            fontWeight="500"
            fill="#334155"
          >
            {layer.value || "Text Layer"}
          </text>
        )}"""

new_text_layer = """        {layer.type === LayerType.Text && (
          <foreignObject
            x={0}
            y={0}
            width={layer.width || 300}
            height={layer.height || 100}
          >
            <textarea
              value={layer.value || ""}
              onChange={(e) => updateLayer(layerId, { value: e.target.value })}
              placeholder={isSelected ? "Type text..." : "Text Layer"}
              className={`w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-slate-400 ${!isSelected && 'pointer-events-none'}`}
              style={{
                fontFamily: (layer as any).fontFamily || 'inherit',
                fontSize: `${(layer as any).fontSize || 24}px`,
                color: (layer as any).color || '#334155',
                fontWeight: 500
              }}
              onPointerDown={(e) => isSelected ? e.stopPropagation() : undefined}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </foreignObject>
        )}"""

if old_text_layer in content:
    content = content.replace(old_text_layer, new_text_layer)
else:
    content = content.replace(old_text_layer.replace('\n', '\r\n'), new_text_layer)


with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(content)

inspector_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\inspector-panel.tsx'
with open(inspector_path, 'r', encoding='utf-8') as f:
    inspector_content = f.read()

# Add typography controls for Note and Text
old_inspector_note = """        {isNote && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Note Content</label>
            <textarea 
              value={layer.value || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-32 p-3 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all shadow-sm"
              placeholder="Type your note here..."
            />
          </div>
        )}"""

new_inspector_note = """        {(isNote || isText || layer.type === LayerType.Rectangle || layer.type === LayerType.Ellipse) && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</label>
              <textarea 
                value={layer.value || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-24 p-3 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all shadow-sm"
                placeholder="Type here..."
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-slate-400 mb-1 block">Font Size</label>
                  <input 
                    type="number" 
                    value={(layer as any).fontSize || (isText ? 24 : 16)}
                    onChange={(e) => updateLayer(layerId, { fontSize: parseInt(e.target.value) || 16 })}
                    className="w-full p-2 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-400 mb-1 block">Font Family</label>
                  <select 
                    value={(layer as any).fontFamily || 'inherit'}
                    onChange={(e) => updateLayer(layerId, { fontFamily: e.target.value })}
                    className="w-full p-2 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 outline-none"
                  >
                    <option value="inherit">Default</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="Comic Sans MS">Comic Sans</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}"""

if old_inspector_note in inspector_content:
    inspector_content = inspector_content.replace(old_inspector_note, new_inspector_note)
else:
    inspector_content = inspector_content.replace(old_inspector_note.replace('\n', '\r\n'), new_inspector_note)

with open(inspector_path, 'w', encoding='utf-8') as f:
    f.write(inspector_content)

print("Canvas and Inspector updated for sticky notes")
