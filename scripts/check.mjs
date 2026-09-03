#!/usr/bin/env node
// Repo sanity checks. Run locally (`node scripts/check.mjs`) and in CI
// (.github/workflows/ci.yml).

import { existsSync, readdirSync, readFileSync } from "node:fs";

const MAX_DESCRIPTION = 200;

let failed = false;
const fail = (msg) => {
  console.error(`check: ${msg}`);
  failed = true;
};

// --- package.json ---

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

if (!pkg.name || !pkg.version) fail("package.json: missing name or version");
if (!pkg.files?.includes("skills"))
  fail('package.json: files must include "skills"');
if (!pkg.pi?.skills?.includes("./skills"))
  fail('package.json: pi.skills must include "./skills"');
if (!pkg.keywords?.includes("pi-package"))
  fail('package.json: keywords must include "pi-package"');
if (!pkg.keywords?.includes("opencode"))
  fail('package.json: keywords must include "opencode"');
if (pkg.type !== "module") fail('package.json: type must be "module"');
if (pkg.exports?.["."] !== "./opencode/index.ts")
  fail('package.json: exports["."] must be "./opencode/index.ts"');
if (!pkg.files?.includes("opencode"))
  fail('package.json: files must include "opencode"');
if (!pkg.dependencies?.["@opencode-ai/plugin"])
  fail('package.json: dependencies must include "@opencode-ai/plugin"');

// --- skills ---

for (const dir of readdirSync("skills", { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;

  const path = `skills/${dir.name}/SKILL.md`;
  if (!existsSync(path)) {
    fail(`${path}: not found`);
    continue;
  }
  const skill = readFileSync(path, "utf8");

  if (/https?:\/\//.test(skill))
    fail(`${path}: hard-coded URL (skill must stay instance-agnostic)`);

  const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    fail(`${path}: missing frontmatter block`);
    continue;
  }

  const name = fm[1].match(/^name:\s*(\S+)\s*$/m)?.[1];
  const description = fm[1].match(/^description:\s*(.+)\s*$/m)?.[1]?.trim();

  if (name !== dir.name)
    fail(
      `${path}: frontmatter name "${name}" must match directory "${dir.name}"`,
    );
  if (!description) {
    fail(`${path}: frontmatter has no description`);
  } else if (description.length > MAX_DESCRIPTION) {
    fail(
      `${path}: description is ${description.length} chars, keep it under ${MAX_DESCRIPTION}`,
    );
  }
}

// --- opencode ---

if (!existsSync("opencode/index.ts")) {
  fail("opencode/index.ts: not found");
} else {
  const plugin = readFileSync("opencode/index.ts", "utf8");
  if (!plugin.includes("Plugin.define"))
    fail("opencode/index.ts: must use Plugin.define");
  if (!plugin.includes("skills/tea/SKILL.md"))
    fail("opencode/index.ts: must reference skills/tea/SKILL.md");
}

if (failed) process.exit(1);
console.log("check: OK");
