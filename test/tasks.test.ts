import { test } from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TaskStore } from "../src/tasks.ts";

function freshStore() {
  const file = join(mkdtempSync(join(tmpdir(), "lab-")), "tasks.json");
  copyFileSync("data/tasks.json", file);
  return new TaskStore(file);
}

test("add creates a task with next id", () => {
  const store = freshStore();
  const t = store.add("New task", "low");
  assert.equal(t.id, 4);
  assert.equal(store.list().length, 4);
});

test("complete marks a task done", () => {
  const store = freshStore();
  assert.equal(store.complete(2)?.done, true);
});

test("complete returns undefined for unknown id", () => {
  assert.equal(freshStore().complete(99), undefined);
});
