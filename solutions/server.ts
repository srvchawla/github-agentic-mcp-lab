import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import { TaskStore } from "../../src/tasks.ts";

const dataFile = fileURLToPath(new URL("../../data/tasks.json", import.meta.url));
const store = new TaskStore(dataFile);

const server = new McpServer({ name: "task-mcp-server", version: "1.0.0" });

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

server.registerTool(
  "add_task",
  {
    description: "Add a new task",
    inputSchema: {
      title: z.string().min(1),
      priority: z.enum(["low", "medium", "high"]).optional(),
    },
  },
  async ({ title, priority }) => {
    const task = store.add(title, priority);
    return { content: [{ type: "text", text: `Added: ${JSON.stringify(task)}` }] };
  },
);

server.registerTool(
  "complete_task",
  {
    description: "Mark a task as done by id",
    inputSchema: { id: z.number().int() },
  },
  async ({ id }) => {
    const task = store.complete(id);
    return task
      ? { content: [{ type: "text", text: `Completed: ${JSON.stringify(task)}` }] }
      : { isError: true, content: [{ type: "text", text: `No task with id ${id}` }] };
  },
);

await server.connect(new StdioServerTransport());
