const fs = require("fs");
const parser = require("@babel/parser");
let code = fs.readFileSync("src/pages/JavaTracker.jsx", "utf8");
code = code.replace(/…/g, '...');
try {
  parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log('Parsed sanitized file successfully');
} catch (err) {
  console.error(err.message);
  console.error(err.loc);
}
