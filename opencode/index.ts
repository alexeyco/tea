// OpenCode plugin wrapper: registers the shared tea skill
// (skills/tea/SKILL.md) so OpenCode can use it too.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Plugin, Skill } from "@opencode/plugin";

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

      const frontmatter = match[1]!;
      const name =
        frontmatter.match(/^name:\s*(.+)\s*$/m)?.[1]?.trim() ?? "tea";
      const description =
        frontmatter.match(/^description:\s*(.+)\s*$/m)?.[1]?.trim() ?? "";
      const content = source.slice(match[0].length);

      // Skill.ID and Skill.Name are constructed via their Schema.make
      // constructors; AbsolutePath has no public constructor so we assert
      // the brand on the known-absolute path string.
      editor.add(
        Skill.Info.make({
          id: Skill.ID.make("tea"),
          name: Skill.Name.make(name),
          description,
          path: skillPath as Skill.Info["path"],
          content,
        }),
      );
    });

    await ctx.skill.reload();
  },
});
