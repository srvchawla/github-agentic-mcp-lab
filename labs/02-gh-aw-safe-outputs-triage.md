# Lab 2 – Safe outputs: issue triage (15 min)

The sample uses the lightweight `haiku` model and `gh-proxy` for GitHub reads;
it reads only the triggering issue and does not install the app's npm packages.

1. Copy the solution into place (or write it yourself from the hints):
   ```bash
   cp solutions/issue-triage.md .github/workflows/issue-triage.md
   ```
2. If you chose organization-billed authentication in [Lab 0](00-setup.md), add
   `copilot-requests: write` to the `permissions` block in the copied workflow:
   ```yaml
   permissions:
     contents: read
     issues: read
     copilot-requests: write
   ```
   If you chose the PAT option, leave that permission out; the repository secret
   configured in Lab 0 is used for Copilot inference.
3. Compile and push the workflow:
   ```bash
   gh aw compile
   git add .github && git commit -m "Add triage" && git push
   ```
4. Open an issue, e.g. "Completing a task that does not exist crashes the app".
5. Watch the workflow in the Actions tab. After the agent finishes, the safe-output
   job adds an 👀 reaction to acknowledge the triage, then posts its labels and comment.
   The reaction means the workflow processed the issue; it is not an immediate
   "workflow started" signal.
6. **Experiment (guardrails):** In a new issue, ask the agent in the body to *close the issue*.
   It can't - `close-issue` is not in `safe-outputs`. This is where least privilege matters.
   
7. **Stretch:** add `network:` or `tools:` restrictions; try a `pull_request` trigger
   that comments a review summary.

Further reading: https://github.github.com/gh-aw/

### Checkpoint Q/A
/ **Q:** Why can't the agent close an issue in this lab?
/ **A:** The `close-issue` operation is not included in the `safe-outputs` allowlist, demonstrating least privilege.

/ **Q:** How do safe-output allowlists contribute to security?
/ **A:** They limit the agent's write capabilities to only approved operations, reducing the risk of unintended changes.

## What you learned
- Trigger issue triage by opening a new issue, without an `@copilot` mention.
- Use a lightweight model and scoped GitHub reads for a focused triage task.
- Recognize the acknowledgment reaction, classification labels, and triage comment.
- Limit permitted writes with safe-output allowlists and operation counts.
- Explain least privilege: an issue's instructions cannot grant permission to close it.
