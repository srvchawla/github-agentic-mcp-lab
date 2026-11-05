import { readFileSync, writeFileSync } from "node:fs";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: "low" | "medium" | "high";
}

export class TaskStore {
  constructor(private file: string) {}

  list(): Task[] {
    return JSON.parse(readFileSync(this.file, "utf8")) as Task[];
  }

  add(title: string, priority: Task["priority"] = "medium"): Task {
    const tasks = this.list();
    const task: Task = {
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      title,
      done: false,
      priority,
    };
    writeFileSync(this.file, JSON.stringify([...tasks, task], null, 2));
    return task;
  }

  complete(id: number): Task | undefined {
    const tasks = this.list();
    const task = tasks.find((t) => t.id === id);
    if (!task) return undefined;
    task.done = true;
    writeFileSync(this.file, JSON.stringify(tasks, null, 2));
    return task;
  }
}
