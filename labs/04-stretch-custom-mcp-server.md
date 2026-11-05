# Lab 4 (Stretch) – Build your own MCP server (20 min)

The server in `mcp-server/` exposes the sample app's tasks over MCP (stdio).

1. Install:
   ```bash
   cd mcp-server && npm install
   ```
2. Open `mcp-server/src/server.ts`. `list_tasks` exists. Implement `add_task` and
   `complete_task` (stuck? copy from `solutions/server.ts` into `mcp-server/src/server.ts`).
3. Test with the Inspector:
   ```bash
   npm run inspect
   ```
   Connect, open **Tools**, run `list_tasks`, then `add_task`.
4. Register with VS Code by adding to `.vscode/mcp.json` under `servers`:
   ```json
   "tasks": { "type": "stdio", "command": "npx", "args": ["tsx", "mcp-server/src/server.ts"] }
   ```
5. In Agent mode: "Add a high priority task to review PRs, then list open tasks."

Key points: tool name + description + zod schema are what the model sees; never write
to stdout except protocol messages (use `console.error` for logs).
