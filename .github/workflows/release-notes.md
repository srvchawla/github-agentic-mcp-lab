---
on:
  release:
    types: [published]

permissions:
  contents: read
  pull-requests: read
  issues: read

safe-outputs:
  create-issue:
    title-prefix: "[release-notes] "
    labels: [release-notes]
    close-older-issues: true
---

# Release Notes Generator

Generate release notes for the published release.

Summarize the most important merged pull requests, user-visible fixes, documentation updates, and any upgrade or rollback notes. Create one issue containing the draft release notes and a short follow-up checklist for human review before publication elsewhere.