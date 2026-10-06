import os

css_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\globals.css'
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """animation: vibrate3d 0.4s ease-in-out infinite;"""
replacement = """animation: vibrate3d 4s ease-in-out infinite;"""

if target in content:
    content = content.replace(target, replacement)
else:
    content = content.replace(target.replace('\n', '\r\n'), replacement)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Animation timing updated")
