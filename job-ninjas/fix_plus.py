import os

canvas_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\board\canvas.tsx'
with open(canvas_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix edge Plus button
target_edge = """                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === edgeId ? null : edgeId);
                          }}"""

replacement_edge = """                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === edgeId ? null : edgeId);
                          }}"""

target_edge_crlf = target_edge.replace('\n', '\r\n')
if target_edge in content:
    content = content.replace(target_edge, replacement_edge)
elif target_edge_crlf in content:
    content = content.replace(target_edge_crlf, replacement_edge)

# Fix node Plus button
target_node = """                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === layerId ? null : layerId);
                          }}"""

replacement_node = """                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQuickAddMenuFor(quickAddMenuFor === layerId ? null : layerId);
                          }}"""

target_node_crlf = target_node.replace('\n', '\r\n')
if target_node in content:
    content = content.replace(target_node, replacement_node)
elif target_node_crlf in content:
    content = content.replace(target_node_crlf, replacement_node)

with open(canvas_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Plus buttons fixed")
