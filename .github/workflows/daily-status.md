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
