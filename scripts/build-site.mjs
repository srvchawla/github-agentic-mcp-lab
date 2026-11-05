import { mkdir, readFile, readdir, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { marked } from "marked";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.env.SITE_OUTPUT_DIR ? path.resolve(process.env.SITE_OUTPUT_DIR) : path.join(root, "_site");
const repository = process.env.GITHUB_REPOSITORY || "srvchawla/github-agentic-mcp-lab";
if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) {
  throw new Error("GITHUB_REPOSITORY must be an owner/repository name.");
}
const repoUrl = `https://github.com/${repository}`;
const files = (await readdir(path.join(root, "labs")))
  .filter((file) => /^\d{2}-.+\.md$/.test(file))
  .sort();
const labRoutes = new Map(files.map((file, index) => [file, `#lab-${index}`]));
const descriptions = [
  "Get your tools ready and connect Copilot to GitHub Actions.",
  "Turn a Markdown prompt into your first automated repository report.",
  "Classify issues and explore what your agent is allowed to change.",
  "Connect GitHub and Playwright tools to your coding agent.",
  "Build a task-powered MCP server and make it your own.",
];
const escape = (text) => text.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const renderer = new marked.Renderer();
renderer.link = function (token) {
  const text = this.parser.parseInline(token.tokens);
  let href = token.href;
  if (!/^(https?:|mailto:|#)/i.test(href)) {
    const [target, fragment] = href.split("#");
    const lab = path.posix.basename(target);
    href = labRoutes.get(lab) ||
      `${repoUrl}/blob/main/${path.posix.normalize(path.posix.join("labs", target))}${fragment ? `#${fragment}` : ""}`;
  }
  if (!/^(https?:|mailto:|#)/i.test(href)) {
    throw new Error(`Unsupported link in lab content: ${href}`);
  }
  return `<a href="${escape(href)}">${text}</a>`;
};
marked.use({ renderer, gfm: true });

await mkdir(output, { recursive: true });
const labs = await Promise.all(files.map(async (file, index) => {
  const source = await readFile(path.join(root, "labs", file), "utf8");
  const [heading] = source.split("\n");
  const title = heading.replace(/^# Lab \d+(?: \(Stretch\))? [–-] /, "").replace(/ \([^)]*\)$/, "");
  const time = heading.match(/\((\d+) min\)/)?.[1];
  return {
    index, file, title,
    duration: index === 0 ? "Before class" : `${time || "20"} min${index === files.length - 1 ? " · stretch" : ""}`,
    description: descriptions[index] || title,
    html: await marked.parse(source.replace(/^# .+\r?\n/, "")),
  };
}));
const navigation = labs.map((lab) => `
  <a class="lab-nav" href="#lab-${lab.index}" data-lab-nav="${lab.index}">
    <span class="nav-number">${lab.index.toString().padStart(2, "0")}</span>
    <span>${escape(lab.title)}<small>${escape(lab.duration)}</small></span>
    <span class="nav-completion" aria-hidden="true"></span>
  </a>`).join("");
const cards = labs.map((lab) => `
  <a class="lab-card" href="#lab-${lab.index}">
    <div class="card-top"><span class="lab-index">LAB ${lab.index.toString().padStart(2, "0")}</span><span>${escape(lab.duration)}</span></div>
    <h3>${escape(lab.title)}</h3>
    <p>${escape(lab.description)}</p>
    <div class="card-bottom"><span data-card-status="${lab.index}">Not started</span><span aria-hidden="true">↗</span></div>
  </a>`).join("");
const sections = labs.map((lab) => `
  <section id="lab-${lab.index}" class="lab-page view" data-view="lab-${lab.index}" hidden aria-labelledby="lab-heading-${lab.index}">
    <div class="lab-heading-meta"><span class="eyebrow">LAB ${lab.index.toString().padStart(2, "0")}</span><span class="pill">${escape(lab.duration)}</span></div>
    <h1 id="lab-heading-${lab.index}" tabindex="-1">${escape(lab.title)}</h1>
    <p class="page-description">${escape(lab.description)}</p>
    <div class="lab-toolbar">
      <label class="completion-control"><input type="checkbox" data-complete="${lab.index}"> <span>Mark lab complete</span></label>
      <a href="${repoUrl}/blob/main/labs/${lab.file}">View Markdown <span aria-hidden="true">↗</span></a>
    </div>
    <article class="markdown-body">${lab.html}</article>
    <div class="lab-footer">
      <a class="button secondary" href="${lab.index === 0 ? "#overview" : `#lab-${lab.index - 1}`}">← ${lab.index === 0 ? "Overview" : "Previous lab"}</a>
      <a class="button primary" href="${lab.index === labs.length - 1 ? "#overview" : `#lab-${lab.index + 1}`}">${lab.index === labs.length - 1 ? "Back to overview" : "Next lab"} →</a>
    </div>
  </section>`).join("");
let template = await readFile(path.join(root, "site/index.html"), "utf8");
template = template.replaceAll("{{REPO_URL}}", repoUrl)
  .replace("{{LAB_NAVIGATION}}", navigation)
  .replace("{{LAB_CARDS}}", cards)
  .replace("{{LAB_SECTIONS}}", sections);
await writeFile(path.join(output, "index.html"), template);
await Promise.all(["styles.css", "app.js"].map((file) => copyFile(
  path.join(root, "site", file), path.join(output, file),
)));
await writeFile(path.join(output, ".nojekyll"), "");
console.log(`Built ${labs.length} labs into ${path.relative(root, output)}/`);
