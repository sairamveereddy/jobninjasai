const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/roles/page.tsx', 'utf8');

const regex = /<button[^>]*onClick=\{[^}]*localStorage\.removeItem\('job-ninjas-demo-storage'\)[^}]*\}[^>]*>[\s\S]*?Reset Demo Data[\s\S]*?<\/button>/;

code = code.replace(regex, '');

fs.writeFileSync('src/app/(dashboard)/roles/page.tsx', code);
console.log('Removed button!');
