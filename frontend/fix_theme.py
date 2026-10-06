"""
Definitive text-white cleanup for JobNinjas light theme.

Strategy:
- Replace ALL occurrences of 'text-white' with 'text-[#1a1a2e]' 
- THEN restore text-white ONLY in specific button/badge contexts where
  the element has a colored/dark background (bg-[#5e6ad2], bg-emerald, etc.)
"""
import os, re

base_dir = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\jobninjas\frontend\src\components'

# Skip these shadcn UI primitives — they have their own theming
SKIP_FILES = {'alert-dialog.jsx', 'dialog.jsx', 'drawer.jsx', 'sheet.jsx', 
              'button.jsx', 'badge.jsx', 'select.jsx', 'dropdown-menu.jsx',
              'toast.jsx', 'toaster.jsx', 'tooltip.jsx', 'popover.jsx'}

count = 0
details = []

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if not fname.endswith('.jsx'):
            continue
        if fname in SKIP_FILES:
            continue
            
        fpath = os.path.join(root, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        changed = False
        new_lines = []
        
        for i, line in enumerate(lines):
            if 'text-white' not in line:
                new_lines.append(line)
                continue
            
            original_line = line
            
            # PRESERVE text-white in these contexts (buttons on colored backgrounds):
            preserve = False
            
            # 1. Lines with colored button backgrounds (purple, emerald, etc.)
            colored_bg_patterns = [
                'bg-[#5e6ad2]', 'bg-[#4c5abd]', 'bg-[#6e7be2]',
                'btn-premium-primary', 'btn-premium',
                'bg-emerald', 'bg-green', 'bg-red', 'bg-rose',
                'bg-gradient-to-br from-[#5e6ad2]', 'bg-gradient-to-r from-[#5e6ad2]',
                'bg-orange', 'bg-amber', 'bg-blue',
                'bg-slate-900', 'bg-gray-900',  # intentional dark buttons
                'bg-indigo',
                'rotate-180',  # icon in active state on colored bg
            ]
            for pattern in colored_bg_patterns:
                if pattern in line:
                    preserve = True
                    break
            
            # 2. Lines that are SVG icon fills or very small icon contexts on colored bg
            if 'ShieldCheck' in line or 'border-[3px]' in line:
                preserve = True
            
            # 3. Lines inside a known button element
            if '<Button' in line and ('bg-[#5e6ad2]' in line or 'btn-premium' in line):
                preserve = True
                
            if not preserve:
                line = line.replace('text-white', 'text-[#1a1a2e]')
                if line != original_line:
                    changed = True
                    details.append(f'  L{i+1}: {fname}')
            
            new_lines.append(line)
        
        if changed:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            count += 1
            print(f'Updated: {fname}')

print(f'\nTotal files updated: {count}')
print(f'Total lines changed: {len(details)}')
for d in details[:30]:
    print(d)
if len(details) > 30:
    print(f'  ... and {len(details)-30} more')
