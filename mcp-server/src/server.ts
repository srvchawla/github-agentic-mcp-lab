import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import { TaskStore } from "../../src/tasks.ts";

const dataFile = fileURLToPath(new URL("../../data/tasks.json", import.meta.url));
const store = new TaskStore(dataFile);

const server = new McpServer({ name: "task-mcp-server", version: "1.0.0" });

// Starter: one tool is done for you.
server.registerTool(
  "list_tasks",
  {
    description: "List tasks, optionally only those that are not done",
    inputSchema: { onlyOpen: z.boolean().optional() },
  },
  async ({ onlyOpen }) => {
    const tasks = store.list().filter((t) => !onlyOpen || !t.done);
    return { content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }] };
  },
);

// TODO (Lab 4): register "add_task" (title: string, priority?: low|medium|high)
// TODO (Lab 4): register "complete_task" (id: number)
// Solution: solutions/server.ts

await server.connect(new StdioServerTransport());
