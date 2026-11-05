# Lab 3 – Using existing MCP servers (20 min)

MCP = a standard protocol that lets an AI client call **tools** exposed by servers.

1. Open `.vscode/mcp.json`. Click **Start** above `github` (sign in) and `playwright`.
2. In Copilot Chat → Agent mode, click the tools icon and see the tool list.
3. Try prompts:
   - "List open issues in this repo and summarize them." (GitHub MCP)
   - "Create an issue titled 'Add delete_task function' describing what's needed in src/tasks.ts."
   - "Open https://github.github.com/gh-aw/ and tell me the three engines it lists." (Playwright MCP)
4. Observe the tool-call approval prompts. Discuss: what could go wrong with write tools?
5. Combine: "Read src/tasks.ts, then file one issue per missing feature."

Checkpoint: you can explain client vs server vs tool, and where credentials live.
