// OpenCode plugin wrapper: registers the shared tea skill
// (skills/tea/SKILL.md) so OpenCode can use it too.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Plugin } from "@opencode-ai/plugin";
import type { Skill } from "@opencode-ai/plugin";

const skillPath = fileURLToPath(
  new URL("../skills/tea/SKILL.md", import.meta.url),
);

export default Plugin.define({
  id: "tea",
  async setup(ctx) {
    await ctx.skill.transform((editor) => {
      const source = readFileSync(skillPath, "utf8");

      const match = source.match(/^---\n([\s\S]*?)\n---\n/);
      if (!match) throw new Error(`tea skill: no frontmatter in ${skillPath}`);

      const frontmatter = match[1];
      const name =
        frontmatter.match(/^name:\s*(.+)\s*$/m)?.[1]?.trim() ?? "tea";
      const description =
        frontmatter.match(/^description:\s*(.+)\s*$/m)?.[1]?.trim() ?? "";
      const content = source.slice(match[0].length);

      // Skill.Info uses branded strings (Skill.ID, Skill.Name, AbsolutePath)
      // that cannot be constructed from the public API — assert the shape.
      editor.add({
        id: "tea",
        name,
        description,
        location: skillPath,
        content,
      } as Skill.Info);
    });

    await ctx.skill.reload();
  },
});
