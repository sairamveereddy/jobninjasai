import sys
import os

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
toolbar_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\toolbar.tsx'

with open(canvas_path, 'r', encoding='utf-8') as f:
    canvas_content = f.read()

target1 = """    if (canvasState.mode === CanvasMode.Connecting) {
      setCanvasState({ mode: CanvasMode.Connecting, fromNodeId: layerId, currentPoint: getPointerPos(e, camera) });
      return;
    }"""

replacement1 = """    if (canvasState.mode === CanvasMode.Connecting) {
      if (canvasState.fromNodeId) {
        if (canvasState.fromNodeId !== layerId) {
          insertEdge(canvasState.fromNodeId, layerId);
        }
        setCanvasState({ mode: CanvasMode.None });
      } else {
        setCanvasState({ mode: CanvasMode.Connecting, fromNodeId: layerId, currentPoint: getPointerPos(e, camera) });
      }
      return;
    }"""

target2 = """    setCanvasState({ mode: CanvasMode.Translating, current: getPointerPos(e, camera) });
  }, [canvasState.mode, selections, setSelection, camera]);"""

replacement2 = """    setCanvasState({ mode: CanvasMode.Translating, current: getPointerPos(e, camera) });
  }, [canvasState, selections, setSelection, camera, insertEdge]);"""

target1_crlf = target1.replace('\n', '\r\n')
target2_crlf = target2.replace('\n', '\r\n')

if target1 in canvas_content:
    canvas_content = canvas_content.replace(target1, replacement1)
elif target1_crlf in canvas_content:
    canvas_content = canvas_content.replace(target1_crlf, replacement1)

if target2 in canvas_content:
    canvas_content = canvas_content.replace(target2, replacement2)
elif target2_crlf in canvas_content:
    canvas_content = canvas_content.replace(target2_crlf, replacement2)

with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(canvas_content)


with open(toolbar_path, 'r', encoding='utf-8') as f:
    toolbar_content = f.read()

if 'useBoardStore' not in toolbar_content:
    toolbar_content = toolbar_content.replace('import { CanvasMode, LayerType } from "@/types/canvas";', 'import { CanvasMode, LayerType } from "@/types/canvas";\nimport { useBoardStore } from "@/store/board";')

if 'const insertLayer =' not in toolbar_content:
    toolbar_content = toolbar_content.replace('const [activeMenu, setActiveMenu] = useState<string | null>(null);', 'const [activeMenu, setActiveMenu] = useState<string | null>(null);\n  const insertLayer = useBoardStore(state => state.insertLayer);')

target_image = """                  // Set mode to Insert Image, with src
                  setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Image, src: base64 });"""
replacement_image = """                  // Insert directly at 100,100
                  insertLayer(LayerType.Image, { x: 100, y: 100 }, { r: 255, g: 255, b: 255 }, undefined, undefined, base64);
                  setCanvasState({ mode: CanvasMode.None });"""

target_image_crlf = target_image.replace('\n', '\r\n')
if target_image in toolbar_content:
    toolbar_content = toolbar_content.replace(target_image, replacement_image)
elif target_image_crlf in toolbar_content:
    toolbar_content = toolbar_content.replace(target_image_crlf, replacement_image)

target_image_reset = """              }
            }} 
          />"""
replacement_image_reset = """              }
              e.target.value = '';
            }} 
          />"""
target_image_reset_crlf = target_image_reset.replace('\n', '\r\n')
if target_image_reset in toolbar_content:
    toolbar_content = toolbar_content.replace(target_image_reset, replacement_image_reset)
elif target_image_reset_crlf in toolbar_content:
    toolbar_content = toolbar_content.replace(target_image_reset_crlf, replacement_image_reset)

target_agent_btn = """            <button
              onClick={() => setActiveMenu(activeMenu === 'agents' ? null : 'agents')}
              className={`
                p-2 rounded-xl transition-all relative flex items-center justify-center
                ${activeMenu === 'agents' || (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Agent) 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 text-indigo-600'}
              `}
              title="AI Agents"
            >
              <Bot className="w-5 h-5" />
              <SparklesIcon />
            </button>"""

replacement_agent_btn = """            <button
              onClick={() => setActiveMenu(activeMenu === 'agents' ? null : 'agents')}
              className={`
                p-2 rounded-xl transition-all relative flex items-center justify-center gap-1
                ${activeMenu === 'agents' || (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Agent) 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'}
              `}
              title="Add AI Agent"
            >
              <Bot className="w-5 h-5" />
              <ChevronRight className={`w-3 h-3 transition-transform ${activeMenu === 'agents' ? 'rotate-90' : ''}`} />
            </button>"""
target_agent_btn_crlf = target_agent_btn.replace('\n', '\r\n')

if target_agent_btn in toolbar_content:
    toolbar_content = toolbar_content.replace(target_agent_btn, replacement_agent_btn)
elif target_agent_btn_crlf in toolbar_content:
    toolbar_content = toolbar_content.replace(target_agent_btn_crlf, replacement_agent_btn)

with open(toolbar_path, 'w', encoding='utf-8') as f:
    f.write(toolbar_content)

print("Files modified successfully.")
