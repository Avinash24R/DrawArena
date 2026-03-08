const fs = require("fs");
const path = require("path")

const filePath = path.join(__dirname, "word.txt");

const data = fs.readFileSync(filePath, "utf8");

const words = data.split(/\r?\n/).map(w => w.trim()).filter(Boolean);


