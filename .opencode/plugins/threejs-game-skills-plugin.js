/**
 * threejs-game-skills plugin for OpenCode — V2 Plugin API
 *
 * Registers custom tools for Three.js game development and injects
 * bootstrap context so agents know how to use the bundled skills.
 */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { tool } from "@opencode-ai/plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "../..");
const skillsDir = path.resolve(packageRoot, "plugins/skills");
const scaffoldDir = path.resolve(
  packageRoot,
  "plugins/skills/threejs-gameplay-systems/assets/threejs-vite-game",
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scanSkills() {
  const skills = [];
  if (!fs.existsSync(skillsDir)) return skills;

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, "utf8");
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let skillName = entry.name;
    let skillDesc = "";
    if (fmMatch) {
      const fm = fmMatch[1];
      const nameMatch = fm.match(/^name:\s*(.+)$/m);
      if (nameMatch) skillName = nameMatch[1].trim();
      const descMatch = fm.match(/^description:\s*(.+)$/m);
      if (descMatch) {
        let d = descMatch[1].trim();
        if (
          (d.startsWith("'") && d.endsWith("'")) ||
          (d.startsWith('"') && d.endsWith('"'))
        ) {
          d = d.slice(1, -1);
        }
        skillDesc = d;
      }
    }
    skills.push({ name: skillName, description: skillDesc });
  }
  return skills;
}

// ---------------------------------------------------------------------------
// V2 Plugin entry
// ---------------------------------------------------------------------------

/** @type {import("@opencode-ai/plugin").Plugin} */
export const ThreeJSGameSkills = async (ctx) => {
  const { $ } = ctx;
  const skills = scanSkills();

  // ------------------------------------------------------------------
  // Custom tools
  // ------------------------------------------------------------------

  const listSkillsTool = tool({
    description: "List all available Three.js Game Skills with descriptions",
    args: {},
    async execute(_args, _context) {
      const lines = skills.map(
        (s) => `- **${s.name}** — ${s.description.slice(0, 120)}`,
      );
      return `Three.js Game Skills (${skills.length} available):\n\n${lines.join("\n")}\n\nUse the \`skill\` tool to load any skill by name.`;
    },
  });

  const scaffoldGameTool = tool({
    description:
      "Scaffold a new Three.js browser game project using the Vite + TypeScript starter template",
    args: {
      target: tool.schema
        .string()
        .describe("Target directory path (relative or absolute)"),
    },
    async execute(args, context) {
      if (!fs.existsSync(scaffoldDir)) {
        return `Error: scaffold template not found at ${scaffoldDir}`;
      }
      const targetDir = path.resolve(context.directory, args.target);
      if (fs.existsSync(targetDir)) {
        return `Error: target directory already exists — ${targetDir}`;
      }
      fs.cpSync(scaffoldDir, targetDir, { recursive: true });
      return `Scaffolded new Three.js game project at ${targetDir}.\n\nNext steps:\n  cd ${args.target}\n  npm install\n  npm run dev`;
    },
  });

  const verifyVisualTool = tool({
    description:
      "Inspect a running Three.js game for visual correctness — canvas state, WebGL context, console errors",
    args: {
      url: tool.schema
        .string()
        .describe(
          "URL of the running game (defaults to http://localhost:5173)",
        ),
    },
    async execute(args, context) {
      const url = args.url || "http://localhost:5173";
      const inspectScript = path.resolve(
        packageRoot,
        "plugins/skills/threejs-qa-release/scripts/inspect-threejs-canvas.mjs",
      );
      if (!fs.existsSync(inspectScript)) {
        return `Error: inspect script not found at ${inspectScript}`;
      }
      try {
        const result =
          await $`node ${inspectScript} --url ${url}`;
        return `Visual verification completed on ${url}.\n\n${result.text()}`;
      } catch (err) {
        return `Visual verification failed: ${err.message || err}`;
      }
    },
  });

  // ------------------------------------------------------------------
  // Return hooks
  // ------------------------------------------------------------------

  return {
    tool: {
      threejs_list_skills: listSkillsTool,
      threejs_scaffold_game: scaffoldGameTool,
      threejs_verify_visual: verifyVisualTool,
    },

    "session.created": async () => {
      console.log(
        `🎮 Three.js Game Skills loaded — ${skills.length} skills, 3 tools`,
      );
    },
  };
};

export { ThreeJSGameSkills as server };
export default ThreeJSGameSkills;
