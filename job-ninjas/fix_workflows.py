import os

file_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\(dashboard)\workflows\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """<button className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Create New Workflow
          </button>"""

replacement = """<Link href="/workflows/new" className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Create New Workflow
          </Link>"""

target_crlf = target.replace('\n', '\r\n')

if target in content:
    content = content.replace(target, replacement)
elif target_crlf in content:
    content = content.replace(target_crlf, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Workflows replaced successfully')
