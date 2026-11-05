# GitHub Agentic Workflows + MCP – Hands-on Lab

A 1-hour class. Sample app: a tiny TypeScript task store (`src/tasks.ts`).

| Lab | Topic | Time |
|-----|-------|------|
| [0](labs/00-setup.md) | Setup (before class) | - |
| [1](labs/01-gh-aw-first-workflow.md) | First agentic workflow | 15 |
| [2](labs/02-gh-aw-safe-outputs-triage.md) | Safe outputs & triage | 15 |
| [3](labs/03-mcp-github-and-playwright.md) | Existing MCP servers | 20 |
| [4](labs/04-stretch-custom-mcp-server.md) | Build an MCP server (stretch) | 20 |

Prerequisites: GitHub account with Copilot, `gh` CLI, Node 20+, VS Code.
Instructors: see [docs/instructor-guide.md](docs/instructor-guide.md).

## Workshop website

The website includes all five labs, light/dark themes, copyable code examples,
browser-saved completion checkboxes, and a safe-output playground. Lab content
is generated directly from [labs/](labs/) so the site and Markdown stay in sync.

```bash
npm ci
npm run build:site
npm run preview:site
```

Open http://127.0.0.1:4173. Progress and theme preferences are stored only in your
browser; the playground does not call GitHub or change issues.

To publish, select **Settings > Pages > Source > GitHub Actions** in your repository,
then push the site to `main` or run **Deploy workshop site** in Actions. The
[Pages workflow](.github/workflows/pages.yml) builds and deploys `_site/`.
The expected URL is https://srvchawla.github.io/github-agentic-mcp-lab/.
Fork builds automatically link source files to their own GitHub repository.
