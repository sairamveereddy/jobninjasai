import os

floating_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\floating-ui.tsx'
with open(floating_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """          <div className="w-10 h-10 relative flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority unoptimized />
          </div>"""

replacement = """          <div className="w-10 h-10 relative flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>"""

if target in content:
    content = content.replace(target, replacement)
else:
    content = content.replace(target.replace('\n', '\r\n'), replacement)

with open(floating_path, 'w', encoding='utf-8') as f:
    f.write(content)

loading_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\loading-screen.tsx'
with open(loading_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_loading = """      <div className="relative w-32 h-32 mb-8 animate-vibrate-3d">
        <Image 
          src="/logo.png" 
          alt="Job Ninjas Logo" 
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>"""

replacement_loading = """      <div className="relative w-32 h-32 mb-8 animate-vibrate-3d">
        <img 
          src="/logo.png" 
          alt="Job Ninjas Logo" 
          className="w-full h-full object-contain"
        />
      </div>"""

if target_loading in content:
    content = content.replace(target_loading, replacement_loading)
else:
    content = content.replace(target_loading.replace('\n', '\r\n'), replacement_loading)

with open(loading_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Images replaced with <img> tags")
