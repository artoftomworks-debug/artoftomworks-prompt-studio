import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const folder = new URL("./workflows/comfyui/", import.meta.url);
const expected = [
  "DaSiWa_H3_Pro_GLOBAL.json",
  "DaSiWa_H3_Simple_GLOBAL.json",
  "Eros_H3_Pro_GLOBAL.json",
  "Eros_H3_Simple_GLOBAL.json",
  "LTX_2.5_Gym_Simple_GLOBAL.json",
];

test("companion workflows are parseable, connected and free of personal inputs", async () => {
  const names = (await readdir(folder)).filter((name) => name.endsWith(".json")).sort();
  assert.deepEqual(names, expected);
  for (const name of names) {
    const source = await readFile(new URL(name, folder), "utf8");
    assert.doesNotMatch(source, /(?:[A-Za-z]:[\\/](?:Users|AIWorks|SwarmUI_stuffs)|[\w.+-]+@(?:gmail|outlook)\.com|data:image\/|0512001-|0654001-)/iu, name);
    const workflow = JSON.parse(source);
    assert.ok(Array.isArray(workflow.nodes) && workflow.nodes.length >= 20, name);
    assert.ok(Array.isArray(workflow.links) && workflow.links.length >= 20, name);
    const nodeIds = new Set(workflow.nodes.map((node) => node.id));
    assert.equal(nodeIds.size, workflow.nodes.length, `${name}: duplicate node ID`);
    for (const link of workflow.links) {
      assert.ok(nodeIds.has(link[1]) && nodeIds.has(link[3]), `${name}: dangling link ${link[0]}`);
    }
    const imageNodes = workflow.nodes.filter((node) => /^LoadImage(?:WithSwitch)?$/u.test(node.type));
    assert.ok(imageNodes.length > 0, `${name}: no starting image node`);
    for (const node of imageNodes) {
      assert.equal(node.widgets_values?.[0], "example.png", `${name}: personal image filename`);
    }
  }
});
