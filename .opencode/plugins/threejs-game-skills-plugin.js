/**
 * threejs-game-skills plugin for OpenCode.ai — MAIN ENTRY (npm package)
 *
 * Factory returns {config, hooks...} using the v1 plugin API.
 * Scans SKILL.md files in plugins/skills/, registers skill paths
 * and slash commands, and injects bootstrap context on session start.
 */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve paths from the package root (2 levels up from .opencode/plugins/)
const packageRoot = path.resolve(__dirname, '../..');
const skillsDir = path.resolve(packageRoot, 'plugins/skills');
const instructionsFile = path.resolve(packageRoot, 'plugins/AGENTS.md');

// Module-level cache for bootstrap content
let _bootstrapCache = undefined;

/**
 * Generate bootstrap content that tells the model about threejs-game-skills.
 */
function getBootstrapContent() {
  if (_bootstrapCache !== undefined) return _bootstrapCache;

  let instructionsBody = '';
  if (fs.existsSync(instructionsFile)) {
    try {
      const fullContent = fs.readFileSync(instructionsFile, 'utf8');
      // AGENTS.md has no frontmatter — use the first meaningful section
      const lines = fullContent.split('\n');
      // Skip leading blank lines and the top-level heading
      let start = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('# ') && start === 0) {
          start = i + 1;
          break;
        }
      }
      instructionsBody = lines.slice(start).join('\n').trim();
    } catch (e) {
      console.error('[threejs-game-skills] failed to read instructions file:', e.message);
    }
  }

  const parts = [
    '<EXTREMELY_IMPORTANT>',
    'threejs-game-skills is loaded — you have access to the Three.js Game Skills library.',
    '',
    'Use the `skill` tool to list available skills, or type `/threejs-<name>` to invoke one directly',
    '(e.g. `/threejs-game-director`, `/threejs-gameplay-systems`, `/threejs-aaa-graphics-builder`).',
    '',
    '**Key skills available:**',
    '- `threejs-game-director` — Primary entrypoint for complete Three.js browser game creation',
    '- `threejs-gameplay-systems` — Gameplay mechanics, physics, input, collisions',
    '- `threejs-aaa-graphics-builder` — AAA-quality visuals, materials, post-processing',
    '- `threejs-game-ui-designer` — HUD, menus, UI components',
    '- `threejs-debug-profiler` — Debugging and performance profiling',
    '- `threejs-qa-release` — Quality assurance and release readiness',
    '- `threejs-3d-generator` — AI-generated 3D assets',
    '- `threejs-image-generator` — AI-generated 2D images and textures',
    '- `threejs-audio-generator` — AI-generated SFX, ambience, and audio',
  ];

  if (instructionsBody) {
    parts.push('', '## Project Guidelines', '', instructionsBody);
  }

  parts.push('</EXTREMELY_IMPORTANT>');
  _bootstrapCache = parts.join('\n');
  return _bootstrapCache;
}

/**
 * Scan skill directories and read name/description from SKILL.md frontmatter.
 */
function scanSkills() {
  const skills = [];
  if (!fs.existsSync(skillsDir)) return skills;

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let skillName = entry.name;
    let skillDesc = '';
    if (fmMatch) {
      const fm = fmMatch[1];
      const nameMatch = fm.match(/^name:\s*(.+)$/m);
      if (nameMatch) skillName = nameMatch[1].trim();
      const descMatch = fm.match(/^description:\s*(.+)$/m);
      if (descMatch) {
        let d = descMatch[1].trim();
        if ((d.startsWith("'") && d.endsWith("'")) || (d.startsWith('"') && d.endsWith('"'))) {
          d = d.slice(1, -1);
        }
        skillDesc = d;
      }
    }
    skills.push({ name: skillName, description: skillDesc });
  }
  return skills;
}

/**
 * Factory function — the plugin entry.
 * OpenCode v1 Plugin API: () => Promise<Hooks>
 */
const createPlugin = async () => {
  const skills = scanSkills();

  return {
    config: async (config) => {
      try {
        // Register skill paths so OpenCode can discover and load SKILL.md files
        config.skills = config.skills || {};
        config.skills.paths = config.skills.paths || [];
        if (!config.skills.paths.includes(skillsDir)) {
          config.skills.paths.push(skillsDir);
        }

        // Register each skill as a slash command
        config.command = config.command || {};
        for (const skill of skills) {
          if (!config.command[skill.name]) {
            config.command[skill.name] = {
              template: `# ${skill.name}\n\n${skill.description}\n\nUse the \`skill\` tool to load the threejs-game-skills:${skill.name} skill and follow its instructions.\n\n$ARGUMENTS`,
              description: skill.description.slice(0, 100),
            };
          }
        }
        console.error(`[threejs-game-skills] registered ${skills.length} skills + ${Object.keys(config.command).filter(k => k.startsWith('threejs-')).length} slash commands`);
      } catch (e) {
        console.error('[threejs-game-skills] config hook error:', e.message);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      try {
        const bootstrap = getBootstrapContent();
        if (!bootstrap) return;

        const messages = output?.messages;
        if (!messages || !Array.isArray(messages) || messages.length === 0) return;

        const firstUser = messages.find(m => {
          if (!m) return false;
          const role = m.info?.role || m.role;
          return role === 'user';
        });
        if (!firstUser || !firstUser.parts || !Array.isArray(firstUser.parts) || firstUser.parts.length === 0) return;

        if (firstUser.parts.some(p => p?.type === 'text' && typeof p.text === 'string' && p.text.includes('EXTREMELY_IMPORTANT'))) return;

        firstUser.parts.unshift({ type: 'text', text: bootstrap });
      } catch (e) {
        console.error('[threejs-game-skills] messages.transform error:', e.message, e.stack);
      }
    },

    'session.created': async () => {
      console.log(`🎮 Three.js Game Skills session started. ${skills.length} skills loaded. Use /threejs-game-director to build a premium game.`);
    },
  };
};

// OpenCode expects the module to export a factory function as default or "server"
export default createPlugin;
export { createPlugin as server };
