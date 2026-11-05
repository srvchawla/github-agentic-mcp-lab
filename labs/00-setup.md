# Lab 0 – Setup (10 min, do before class)

1. Create your own repo from this template (or fork) and clone it.
2. Install tools:
   ```bash
   gh auth login
   gh extension install github/gh-aw
   node -v   # 20+
   npm install && npm test
   ```
3. VS Code with GitHub Copilot (Agent mode). Open the repo; `.vscode/mcp.json` is preloaded.
4. Give Actions an AI token (needed for gh-aw's Copilot engine). Create a fine-grained
   PAT with the *Copilot Requests* permission, then:
   ```bash
   gh secret set COPILOT_GITHUB_TOKEN
   ```
   See https://github.github.com/gh-aw/reference/engines/ for the current auth steps.
5. Enable Actions and allow issues in your repo.

Check: `gh aw --help` works and `npm test` is green.
