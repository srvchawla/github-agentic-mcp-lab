# Lab 1 – Your first agentic workflow (10 min)

Concept: an agentic workflow is **Markdown + YAML frontmatter**. `gh aw compile`
turns it into a normal Actions `.lock.yml`.

The starter repository includes [sample issues](../docs/sample-issues.md) with
TODO tasks, a bug, a documentation request, and a discussion question. Use them
to give the daily report sample activity; run the workflow soon after opening
the issues so they fall within its 24-hour window. Forks do not copy issues, so
create equivalent sample issues in your fork if needed.

1. Open `.github/workflows/daily-status.md`. Identify: trigger (`on`), `permissions`,
   `engine`, `tools`, `safe-outputs`, and the natural-language body.
2. Compile:
   ```bash
   gh aw compile
   ```
   Look at the generated `daily-status.lock.yml`. Notice the agent job is read-only and
   issue creation happens in a separate job (safe outputs).
   That job also creates the `report` label if it is missing, using the GitHub Actions
   token. It leaves an existing label unchanged.
3. Commit and push both files, then run it:
   ```bash
   git add .github && git commit -m "Add daily status workflow" && git push
   gh aw run daily-status
   gh run watch
   ```
4. Find the issue titled `[daily-status] ...`.
5. **Tweak:** edit the markdown body (e.g. add "mention open TODOs in src/"), recompile, re-run.
   Note: changing the body needs no YAML knowledge.

Discussion: why can't the agent just create the issue itself?

## What you learned

- Define an agentic workflow using YAML configuration and natural-language instructions.
- Compile Markdown into an executable GitHub Actions lock file.
- Keep the agent read-only and publish changes through a separate safe-output job.
- Run a workflow, inspect its report, and refine its instructions.
