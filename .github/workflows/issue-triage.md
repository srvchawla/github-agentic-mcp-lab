---
description: Triage new and reopened issues - label and leave a helpful comment
on:
  issues:
    types: [opened, reopened]
permissions:
  contents: read
  issues: read
engine: copilot
model: haiku
tools:
  github:
    mode: gh-proxy
    toolsets: [issues]
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

This runs when an issue is opened or reopened. For a reopened issue, mention in
the comment that it was reopened and what seems to still need attention.

Read only the issue that triggered this workflow using
`gh issue view ${{ github.event.issue.number }} --repo ${{ github.repository }} --json title,body,labels`.
Do not search repositories, list issues, or reread the issue.

Choose at most two labels from bug, enhancement, question, and documentation.
Add one friendly comment with a one-sentence summary and next step. If it is a
bug, mention the most likely file under `src/`.

Never claim a fix is done. Keep the comment concise.
