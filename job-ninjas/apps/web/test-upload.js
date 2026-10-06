const fs = require('fs');
async function test() {
  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync('package.json')]), 'package.json');
  const res = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  console.log(data);
}
test();
