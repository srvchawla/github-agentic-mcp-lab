# Instructor Guide

## Agenda (60 min)
| Min | Segment |
|-----|---------|
| 0-5 | Intro: Actions vs agentic workflows; MCP as "USB-C for AI tools" |
| 5-10 | **Demo** (you): compile + run `daily-status`, show lock file |
| 10-30 | Labs 1-2 (gh-aw) |
| 30-35 | **Demo**: GitHub MCP creating an issue from chat |
| 35-50 | Lab 3 (existing MCP servers) |
| 50-60 | Lab 4 stretch or wrap-up / Q&A |

If time is tight, Lab 4 becomes an instructor demo using `solutions/server.ts`.

## Demo flow tips
- Demo gh-aw first: the lock file reveal ("it's just Actions") builds trust.
- Show the safe-outputs guardrail failing live - it's the memorable moment.
- Link the two topics: gh-aw `tools:` can use MCP servers; the same protocol powers Lab 3-4.

## Before class
- Do Lab 0 yourself the day before; gh-aw is fast moving, so check
  https://github.github.com/gh-aw/ for syntax changes and run `gh extension upgrade gh-aw`.
- Confirm which authentication path attendees can use: org-centralized Copilot billing
  with `copilot-requests: write`, or a fine-grained `COPILOT_GITHUB_TOKEN` PAT. A local
  VS Code Copilot sign-in alone does not authenticate GitHub Actions.
- Verify attendees' Copilot licences and org policy permit MCP and Actions.
- Have a pre-made "working" repo as a fallback.

## Troubleshooting
- Workflow fails with a Copilot auth error: confirm the selected Lab 0 method. The
  org-billed path requires centralized billing and `copilot-requests: write` in each
  workflow; the PAT path requires an active Copilot license and a valid
  `COPILOT_GITHUB_TOKEN` secret. The PAT is ignored for inference if that permission
  is present.
- Lock file out of date: rerun `gh aw compile`.
- MCP server won't start in VS Code: org may disable MCP; use the Inspector instead.
- Stdio server garbled: something printed to stdout.
