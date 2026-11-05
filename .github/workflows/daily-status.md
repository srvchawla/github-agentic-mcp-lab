---
description: Daily summary of repository activity, posted as an issue
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
engine: copilot
tools:
  github:
    toolsets: [default]
jobs:
  safe_outputs:
    pre-steps:
      - name: Ensure report label exists
        uses: actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0
        with:
          github-token: ${{ github.token }}
          script: |
            const label = { ...context.repo, name: "report" };
            try {
              await github.rest.issues.getLabel(label);
              core.info("The report label already exists.");
            } catch (error) {
              if (error.status !== 404) throw error;
              try {
                await github.rest.issues.createLabel({
                  ...label,
                  color: "1d76db",
                  description: "Reports created by the daily status workflow"
                });
                core.info("Created the report label.");
              } catch (createError) {
                const duplicate = createError.status === 422 &&
                  createError.response?.data?.errors?.some(
                    (item) => item.code === "already_exists" && item.field === "name"
                  );
                if (!duplicate) throw createError;
                await github.rest.issues.getLabel(label);
                core.info("The report label was created by another run.");
              }
            }
safe-outputs:
  create-issue:
    title-prefix: "[daily-status] "
    labels: [report]
    max: 1
---

# Daily Repo Status

Create a short status report for this repository covering the last 24 hours:

- Issues opened and closed
- Pull requests opened, merged, and awaiting review
- One suggestion for what the team should focus on next

Keep it under 200 words and use bullet points. If there was no activity, say so.
