---
description: Triage new issues - label and leave a helpful comment
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: read
engine: copilot
tools:
  github:
    toolsets: [default]
jobs:
  safe_outputs:
    pre-steps:
      - name: React to acknowledge triage
        uses: actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0
        with:
          script: |
            await github.rest.reactions.createForIssue({
              ...context.repo,
              issue_number: context.payload.issue.number,
              content: "eyes"
            });
safe-outputs:
  add-labels:
    allowed: [bug, enhancement, question, documentation]
    max: 2
  add-comment:
    max: 1
---

# Issue Triage

Read the newly opened issue `${{ github.event.issue.number }}` in this repository.

1. Decide which of the allowed labels fit (bug, enhancement, question, documentation) and apply them.
2. Add one friendly comment that summarizes the issue in one sentence and
   suggests the next step. If it is a bug, point to the most likely file under `src/`.

Never claim a fix is done. Be concise.
