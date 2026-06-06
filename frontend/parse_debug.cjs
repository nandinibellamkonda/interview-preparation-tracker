const fs = require("fs");
const parser = require("@babel/parser");
const code = fs.readFileSync("src/pages/SQLTracker.jsx", "utf8");
try {
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"], errorRecovery: true });
  console.log('Parsed');
  if (ast.errors && ast.errors.length) {
    ast.errors.forEach((err, idx) => {
      console.error(`ERROR ${idx}: ${err.message}`);
      console.error(err.loc);
    });
  }
} catch (err) {
  console.error('Parse failed', err.message);
  console.error(err.loc);
  const snippetStart = Math.max(0, err.pos - 80);
  const snippetEnd = Math.min(code.length, err.pos + 80);
  console.error('code around error:');
  console.error(JSON.stringify(code.slice(snippetStart, snippetEnd)));
}
