# Lab 0 – Setup (Pre-requisite)

1. Create your own repo from this template (or fork) and clone it.
2. Install tools:
   ```bash
   gh auth login
   gh extension install github/gh-aw
   node -v   # 20+
   npm install && npm test
   ```
3. VS Code with GitHub Copilot (Agent mode). Open the repo; `.vscode/mcp.json` is preloaded.
4. Configure Copilot authentication for workflows running in GitHub Actions. Your
   local VS Code Copilot sign-in is not used by Actions. Choose **one** option:

   **Organization with Copilot centralized billing:** Each workflow needs
   `copilot-requests: write` in its `permissions` block. Start by adding it to
   `.github/workflows/daily-status.md`:
   ```yaml
   permissions:
     contents: read
     issues: read
     pull-requests: read
     copilot-requests: write
   ```
   No PAT or repository secret is needed. The workflow uses its short-lived
   `GITHUB_TOKEN` for Copilot inference. Compile the workflow after making this change.
   Lab 2 includes the same step for its issue-triage workflow.

   **Personal repository, or no centralized organization billing:** [Create a
   fine-grained PAT](https://github.com/settings/personal-access-tokens/new) with
   your user account as the resource owner and **Account permissions → Copilot
   Requests: Read**. Then save it as a repository Actions secret:
   ```bash
   gh secret set COPILOT_GITHUB_TOKEN
   ```
   Leave `copilot-requests: write` out of each workflow for this option. If you
   previously added it, remove it and recompile: gh-aw ignores the PAT for inference
   when that permission is present. Your account must have Copilot access.

   Use one method, not both. See
   https://github.github.com/gh-aw/reference/auth/ for current details.
5. Enable Actions and allow issues in your repo.

Check: `gh aw --help` works and `npm test` is green.

## What you learned

- Set up a personal lab repository, the GitHub CLI, and the gh-aw extension.
- Install the sample app's dependencies and verify it with tests.
- Distinguish local Copilot sign-in from authentication in GitHub Actions.
- Choose between organization-billed inference and a repository PAT secret.
