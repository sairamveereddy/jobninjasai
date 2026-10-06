import os

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
with open(canvas_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import Bot, LayoutTemplate if not present. Wait, they are probably from lucide-react.
# Let's check imports. We already have Play, Loader2, Plus, X. Let's add Bot, LayoutTemplate if missing.
if "Bot" not in content[:1000]:
    content = content.replace("import { Play, Loader2, Plus, X } from 'lucide-react';", "import { Play, Loader2, Plus, X, Bot, LayoutTemplate } from 'lucide-react';")

# 2. Add insertTemplate and isWelcomeOpen
store_hooks = """  const deleteEdge = useBoardStore(state => state.deleteEdge);
  const setInspectedNodeId = useBoardStore(state => state.setInspectedNodeId);"""
  
store_hooks_new = """  const deleteEdge = useBoardStore(state => state.deleteEdge);
  const setInspectedNodeId = useBoardStore(state => state.setInspectedNodeId);
  const insertTemplate = useBoardStore(state => state.insertTemplate);"""

if store_hooks in content:
    content = content.replace(store_hooks, store_hooks_new)
else:
    content = content.replace(store_hooks.replace('\n', '\r\n'), store_hooks_new)


state_hooks = """  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [quickAddMenuFor, setQuickAddMenuFor] = useState<string | null>(null);"""

state_hooks_new = """  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [quickAddMenuFor, setQuickAddMenuFor] = useState<string | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  useEffect(() => {
    // Only show the welcome popup on initial load if the canvas is empty
    if (layerIds.length === 0) {
      setIsWelcomeOpen(true);
    }
  }, []);"""

if state_hooks in content:
    content = content.replace(state_hooks, state_hooks_new)
else:
    content = content.replace(state_hooks.replace('\n', '\r\n'), state_hooks_new)


# 3. Add the Welcome Modal markup at the end of the return statement.
modal_html = """
      <LibraryModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)}
        camera={camera}
      />
"""

modal_html_new = """
      <LibraryModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)}
        camera={camera}
      />

      {isWelcomeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-slate-800 text-center">Start your workflow</h2>
            <p className="text-slate-500 text-center text-sm">Choose a starting template or build from scratch.</p>
            
            <div className="flex flex-col gap-3 mt-2">
              <button 
                onClick={() => {
                  // Using 'standard' template from LibraryModal
                  insertTemplate("standard", { x: (-camera.x + window.innerWidth / 2) / camera.zoom - 300, y: (-camera.y + window.innerHeight / 2) / camera.zoom });
                  setIsWelcomeOpen(false);
                }}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Default Hiring Agent</div>
                  <div className="text-xs text-slate-500 mt-0.5">Standard end-to-end recruiter flow</div>
                </div>
              </button>

              <button 
                onClick={() => {
                  setIsWelcomeOpen(false);
                  setIsTemplatesOpen(true);
                }}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Browse more templates</div>
                  <div className="text-xs text-slate-500 mt-0.5">View all available agent workflows</div>
                </div>
              </button>
            </div>

            <button 
              onClick={() => setIsWelcomeOpen(false)}
              className="mt-2 text-slate-500 hover:text-slate-800 text-sm font-medium py-2 transition-colors"
            >
              Skip and start from scratch
            </button>
          </div>
        </div>
      )}
"""

if modal_html in content:
    content = content.replace(modal_html, modal_html_new)
else:
    content = content.replace(modal_html.replace('\n', '\r\n'), modal_html_new)


with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Welcome modal implemented")
