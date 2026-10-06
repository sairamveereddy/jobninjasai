import os

# 1. Update globals.css with 3D vibrating animation
css_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\globals.css'
with open(css_path, 'a', encoding='utf-8') as f:
    f.write("""
@keyframes vibrate3d {
  0% { transform: translate3d(0, 0, 0) scale(1); filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5)); }
  25% { transform: translate3d(3px, -3px, 10px) scale(1.05) rotateZ(3deg) rotateY(10deg); filter: drop-shadow(5px 5px 15px rgba(59, 130, 246, 0.7)); }
  50% { transform: translate3d(-3px, 3px, -10px) scale(0.95) rotateZ(-3deg) rotateY(-10deg); filter: drop-shadow(-5px -5px 10px rgba(59, 130, 246, 0.4)); }
  75% { transform: translate3d(3px, 3px, 10px) scale(1.02) rotateZ(1deg) rotateX(10deg); filter: drop-shadow(0 5px 12px rgba(59, 130, 246, 0.6)); }
  100% { transform: translate3d(0, 0, 0) scale(1); filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5)); }
}

.animate-vibrate-3d {
  animation: vibrate3d 0.4s ease-in-out infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
}
""")

# 2. Update loading-screen.tsx
loading_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\loading-screen.tsx'
with open(loading_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('className="relative w-32 h-32 animate-pulse mb-8"', 'className="relative w-32 h-32 mb-8 animate-vibrate-3d"')
content = content.replace('className="object-contain drop-shadow-xl"', 'className="object-contain"')
with open(loading_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update floating-ui.tsx
floating_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\components\floating-ui.tsx'
with open(floating_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_branding = """        <Link href="/" className="flex items-center gap-3 border-r border-slate-200 pr-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            N
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-lg">Job Ninjas</span>
        </Link>"""

replacement_branding = """        <Link href="/" className="flex items-center gap-3 border-r border-slate-200 pr-4">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority unoptimized />
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-lg">Job Ninjas</span>
        </Link>"""

if target_branding in content:
    content = content.replace(target_branding, replacement_branding)
else:
    content = content.replace(target_branding.replace('\n', '\r\n'), replacement_branding)

with open(floating_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 4. Update login/page.tsx
login_path = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\nova-ninjas\job-ninjas\apps\web\src\app\login\page.tsx'
with open(login_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_login = """        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Job Ninjas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A spatial recruiting operating system
          </p>
        </div>"""

replacement_login = """        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 relative mb-4">
            <img src="/logo.png" alt="Logo" className="object-contain w-full h-full drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Job Ninjas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A spatial recruiting operating system
          </p>
        </div>"""

if target_login in content:
    content = content.replace(target_login, replacement_login)
else:
    content = content.replace(target_login.replace('\n', '\r\n'), replacement_login)

with open(login_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates completed successfully")
