# Lab 1 – Your first agentic workflow (15 min)

Concept: an agentic workflow is **Markdown + YAML frontmatter**. `gh aw compile`
turns it into a normal Actions `.lock.yml`.

1. Open `.github/workflows/daily-status.md`. Identify: trigger (`on`), `permissions`,
   `engine`, `tools`, `safe-outputs`, and the natural-language body.
2. Compile:
   ```bash
   gh aw compile
   ```
   Look at the generated `daily-status.lock.yml`. Notice the agent job is read-only and
   issue creation happens in a separate job (safe outputs).
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
