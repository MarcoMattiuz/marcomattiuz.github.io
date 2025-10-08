const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'assets/backgrounds'); // cartella relativa al file JS
const files = fs.readdirSync(folderPath); // restituisce array di nomi di file e cartelle

const jsContent = `const photos = ${JSON.stringify(files, null, 2)};`;
fs.writeFile('scripts/photos.js', jsContent, err => {
  if (err) throw err;
  console.log("File photos.js creato con successo!");
});
console.log(files);