const fs = require('fs');
const filePath = "c:/Users/vsair/Downloads/novasquar-main/novasquad-main/nova-ninjas/job-ninjas/apps/web/src/components/board/canvas.tsx";
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(/\)\s*:\s*layer\.fileName\?\.match\(\/\\\.([a-zA-Z0-9\|]+)\\\$\/i\)\s*&&\s*\(layer\s*as\s*any\)\.fileSrc\?\.startsWith\("http"\)\s*\?\s*\(\s*<iframe src=\{\https:\/\/view\.officeapps\.live\.com\/op\/embed\.aspx\?src=\\\$\{encodeURIComponent\(\(layer\s*as\s*any\)\.fileSrc\?\.trim\(\)\)\}\\}\s*className="w-full\s+h-full\s+border-none\s+bg-white"\s*title="Office\s+Document\s+Viewer"\s*\/>\s*\)\s*:\s*\(/g, ") : (");

fs.writeFileSync(filePath, c, 'utf8');
