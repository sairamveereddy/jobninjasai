import os

replacements = {
    'bg-white': 'bg-card',
    'text-slate-900': 'text-foreground',
    'text-slate-800': 'text-foreground',
    'text-slate-700': 'text-foreground',
    'text-slate-600': 'text-muted-foreground',
    'text-slate-500': 'text-muted-foreground',
    'text-slate-400': 'text-muted-foreground',
    'border-slate-200': 'border-border',
    'border-slate-100': 'border-border',
    'bg-slate-50': 'bg-muted',
    'bg-slate-100': 'bg-muted/50',
    'hover:bg-slate-50': 'hover:bg-muted',
    'hover:bg-slate-100': 'hover:bg-muted/80',
    'hover:text-slate-900': 'hover:text-foreground',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        # Avoid double replacing if we run it multiple times, though some overlap might happen.
        # But this is a simple one-off script.
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))
            
print("Done!")
