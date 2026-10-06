import os

toolbar_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\toolbar.tsx'
with open(toolbar_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                  // Insert directly at 100,100
                  insertLayer(LayerType.Image, { x: 100, y: 100 }, { r: 255, g: 255, b: 255 }, undefined, undefined, base64);
                  setCanvasState({ mode: CanvasMode.None });"""

replacement = """                  setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Image, src: base64 } as any);"""

target_crlf = target.replace('\n', '\r\n')
if target in content:
    content = content.replace(target, replacement)
elif target_crlf in content:
    content = content.replace(target_crlf, replacement)

with open(toolbar_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Toolbar image fix applied")
