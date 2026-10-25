// Re-run the controller checks with an old all-stages-complete record.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const harness = path.join(__dirname, "check-light-align-controls.cjs");
const original = fs.readFileSync(harness, "utf8");
const seeded = original.replace("const frames = new Map(), storage = new Map();", 'const frames = new Map(), storage = new Map([["light-align-sample-stages-v2", "[0,1,2,3,4]"]]);');
if (seeded === original) throw Error("Saved-progress fixture was not injected");
vm.runInNewContext(seeded, { require: createRequire(harness), __dirname, __filename: harness, console });
console.log("Saved progress: previous victories do not trigger fireworks after stage 1; this run must finish every stage.");
