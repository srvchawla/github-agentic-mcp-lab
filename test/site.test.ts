import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const root = new URL("../", import.meta.url);
const output = mkdtempSync(path.join(tmpdir(), "agentic-lab-site-"));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(process.execPath, ["scripts/build-site.mjs"], {
  cwd: root,
  env: { ...process.env, GITHUB_REPOSITORY: "workshop-example/fork", SITE_OUTPUT_DIR: output },
});
const html = readFileSync(path.join(output, "index.html"), "utf8");
const files = readdirSync(new URL("../labs/", import.meta.url)).filter((file) => /^\d{2}-.+\.md$/.test(file)).sort();

test("builds every Markdown lab with navigation, a card, and a completion checkbox", () => {
  assert.equal(files.length, 5);
  files.forEach((file, index) => {
    assert.ok(html.includes(`data-lab-nav="${index}"`));
    assert.ok(html.includes(`data-card-status="${index}"`));
    assert.ok(html.includes(`type="checkbox" data-complete="${index}"`));
    assert.ok(html.includes(`data-view="lab-${index}" hidden`));
    assert.ok(html.includes(`/blob/main/labs/${file}`));
  });
  assert.equal(html.match(/<h2>What you learned<\/h2>/g)?.length, files.length);
  assert.ok(!html.includes("{{"));
});

test("renders code blocks and resolves lab and repository links for a fork", () => {
  assert.ok(html.includes("<pre><code"));
  assert.ok(html.includes("gh aw compile"));
  assert.ok(html.includes('href="#lab-0">Lab 0</a>'));
  assert.ok(html.includes('href="https://github.com/workshop-example/fork/blob/main/docs/sample-issues.md"'));
  assert.ok(html.includes('href="https://github.com/workshop-example/fork"'));
  assert.ok(!html.includes('href="../'));
});

test("emits relative assets that work under a GitHub Pages repository path", () => {
  assert.ok(html.includes('href="./styles.css"'));
  assert.ok(html.includes('src="./app.js"'));
  for (const asset of ["styles.css", "app.js"]) {
    assert.ok(readFileSync(path.join(output, asset), "utf8").length > 0);
  }
});
