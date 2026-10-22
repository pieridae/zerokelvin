const fs = require("node:fs");
const path = require("node:path");
const {
  peerReviewed, manuscripts, publicationsByYear, publicationMarkup
} = require("../assets/publications-v3.js");

// Build the same list into HTML so readers and crawlers do not need JavaScript.
const content = path.join(__dirname, "..", "content");
fs.mkdirSync(content, { recursive: true });
for (const [name, html] of [
  ["publications-peer.html", publicationsByYear(peerReviewed)],
  ["publications-progress.html", manuscripts.map((item) => publicationMarkup(item, true)).join("")]
]) {
  fs.writeFileSync(path.join(content, name), "```{=html}\n" + html + "\n```\n");
}
