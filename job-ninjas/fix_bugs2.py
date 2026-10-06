import os

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
with open(canvas_path, 'r', encoding='utf-8') as f:
    canvas_content = f.read()

target_path = """                <path
                  d={`M ${p1.x} ${p1.y} L ${canvasState.currentPoint.x} ${canvasState.currentPoint.y}`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />"""

replacement_path = """                <path
                  d={`M ${p1.x} ${p1.y} L ${canvasState.currentPoint.x} ${canvasState.currentPoint.y}`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  pointerEvents="none"
                />"""

target_path_crlf = target_path.replace('\n', '\r\n')
if target_path in canvas_content:
    canvas_content = canvas_content.replace(target_path, replacement_path)
elif target_path_crlf in canvas_content:
    canvas_content = canvas_content.replace(target_path_crlf, replacement_path)

with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(canvas_content)


dash_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\(dashboard)\dashboard\page.tsx'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash_content = f.read()

target_btn = """        <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Create Role
        </button>"""

replacement_btn = """        <Link href="/roles" className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Create Role
        </Link>"""

target_btn_crlf = target_btn.replace('\n', '\r\n')
if target_btn in dash_content:
    dash_content = dash_content.replace(target_btn, replacement_btn)
elif target_btn_crlf in dash_content:
    dash_content = dash_content.replace(target_btn_crlf, replacement_btn)

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash_content)

print("Fixes applied")
