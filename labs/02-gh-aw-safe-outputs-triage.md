# Lab 2 – Safe outputs: issue triage (15 min)

1. Copy the solution into place (or write it yourself from the hints):
   ```bash
   cp solutions/issue-triage.md .github/workflows/issue-triage.md
   gh aw compile
   git add .github && git commit -m "Add triage" && git push
   ```
2. Open an issue, e.g. "Completing a task that does not exist crashes the app".
3. Watch the workflow in the Actions tab. Confirm labels and a comment appear.
4. **Experiment (guardrails):** ask the agent in the body to *close the issue*.
   It can't - `close-issue` is not in `safe-outputs`. Discuss why least privilege matters.
5. **Stretch:** add `network:` or `tools:` restrictions; try a `pull_request` trigger
   that comments a review summary.

Further reading: https://github.github.com/gh-aw/
