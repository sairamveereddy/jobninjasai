const fs = require('fs');
async function test() {
  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync('package.json')]), 'package.json');
  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData
  });
  const data = await res.text();
  console.log("RESPONSE:", res.status, data);
}
test();
