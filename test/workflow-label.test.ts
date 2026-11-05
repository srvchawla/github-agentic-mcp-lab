import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

type LabelRequest = { owner: string; repo: string; name: string };
type CreateLabelRequest = LabelRequest & { color: string; description: string };
type IssuesApi = {
  getLabel: (label: LabelRequest) => Promise<unknown>;
  createLabel: (label: CreateLabelRequest) => Promise<unknown>;
};

const workflow = readFileSync(new URL("../.github/workflows/daily-status.md", import.meta.url), "utf8");
const match = workflow.match(
  /      - name: Ensure report label exists\n(?: {8}[^\n]*\n)+?          script: \|\n((?: {12}.*\n)+)/,
);
assert.ok(match, "Could not find the report label setup step");
const script = match[1].replace(/^ {12}/gm, "");
const runLabelStep = runInNewContext(`(async (github, context, core) => {\n${script}\n})`) as (
  github: { rest: { issues: IssuesApi } },
  context: { repo: { owner: string; repo: string } },
  core: { info: (message: string) => void },
) => Promise<void>;

function run(issues: IssuesApi) {
  return runLabelStep(
    { rest: { issues } },
    { repo: { owner: "example", repo: "lab" } },
    { info: () => {} },
  );
}

test("keeps an existing report label unchanged", async () => {
  let created = false;
  await run({
    getLabel: async (label) => {
      assert.equal(label.owner, "example");
      assert.equal(label.repo, "lab");
      assert.equal(label.name, "report");
    },
    createLabel: async () => { created = true; },
  });
  assert.equal(created, false);
});

test("creates the report label when missing", async () => {
  let created: CreateLabelRequest | undefined;
  await run({
    getLabel: async () => { throw { status: 404 }; },
    createLabel: async (label) => { created = label; },
  });
  assert.equal(created?.owner, "example");
  assert.equal(created?.repo, "lab");
  assert.equal(created?.name, "report");
  assert.equal(created?.color, "1d76db");
  assert.equal(created?.description, "Reports created by the daily status workflow");
});

test("surfaces errors checking the report label", async () => {
  const failure = { status: 403 };
  await assert.rejects(run({
    getLabel: async () => { throw failure; },
    createLabel: async () => { assert.fail("Should not create a label after a 403"); },
  }), (error) => error === failure);
});

test("accepts a duplicate only when another run created the label", async () => {
  let checks = 0;
  await run({
    getLabel: async () => {
      checks++;
      if (checks === 1) throw { status: 404 };
    },
    createLabel: async () => {
      throw { status: 422, response: { data: { errors: [{ code: "already_exists", field: "name" }] } } };
    },
  });
  assert.equal(checks, 2);
});

test("surfaces other label creation failures", async () => {
  const failure = { status: 422, response: { data: { errors: [{ code: "invalid", field: "name" }] } } };
  await assert.rejects(run({
    getLabel: async () => { throw { status: 404 }; },
    createLabel: async () => { throw failure; },
  }), (error) => error === failure);
});

test("surfaces an error when rechecking a duplicate label", async () => {
  let checks = 0;
  const failure = { status: 403 };
  await assert.rejects(run({
    getLabel: async () => {
      checks++;
      if (checks === 1) throw { status: 404 };
      throw failure;
    },
    createLabel: async () => {
      throw { status: 422, response: { data: { errors: [{ code: "already_exists", field: "name" }] } } };
    },
  }), (error) => error === failure);
});
