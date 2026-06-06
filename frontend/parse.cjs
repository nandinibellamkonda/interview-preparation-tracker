const fs = require("fs");
const parser = require("@babel/parser");
const files = [
  "src/pages/JavaTracker.jsx",
  "src/pages/DSATracker.jsx",
  "src/pages/SQLTracker.jsx",
  "src/pages/Profile.jsx",
];
for (const file of files) {
  const code = fs.readFileSync(file, "utf8");
  try {
    parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
    console.log(file + ": OK");
  } catch (err) {
    console.error(file + ": ERROR");
    console.error(err.message);
    console.error("Location", err.loc);
    process.exit(1);
  }
}
