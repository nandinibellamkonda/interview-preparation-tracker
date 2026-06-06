const fs = require("fs");
const parser = require("@babel/parser");
const code = fs.readFileSync("src/pages/JavaTracker.jsx", "utf8");
try {
  const result = parser.parse(code, { sourceType: 'module', plugins: ['jsx'], tokens: true });
  console.log('parsed OK');
} catch (err) {
  console.error(err.message);
  console.error('loc', err.loc);
  const snippetStart = Math.max(0, err.pos - 40);
  const snippetEnd = Math.min(code.length, err.pos + 40);
  console.error('code around error:', JSON.stringify(code.slice(snippetStart, snippetEnd)));
}
