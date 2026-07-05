/**
 * threejs-game-skills plugin for OpenCode.ai — MAIN ENTRY (npm package)
 *
 * Factory returns a flat Hooks object (no {name,version,hooks} wrapper).
 */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve paths from the package root (2 levels up from .opencode/plugins/)
const packageRoot = path.resolve(__dirname, '../..');
const skillsDir = path.resolve(packageRoot, 'skills');
const instructionsFile = path.resolve(packageRoot, 'AGENTS.md');

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
      instructionsBody = fs.readFileSync(instructionsFile, 'utf8');
    } catch (e) {
      console.error('[threejs-game-skills] failed to read instructions file:', e.message);
    }
  }

  const toolMapping = [
    '**Tool mapping for OpenCode:**',
    'When threejs-game-skills request actions, use these OpenCode equivalents:',
    '- Read files → `read`',
    '- Create, edit, or delete files → `apply_patch`',
    '- Run shell commands → `bash`',
    '- Search file contents / find files → `grep`, `glob`',
    '- Fetch a URL → `webfetch`',
    '- Invoke another skill → native `skill` tool',
    '- Dispatch a subagent → `task` with `subagent_type: "general"`',
    '- Create or update tasks → `todowrite`',
    '',
    "Use OpenCode's native `skill` tool to list and load any threejs-game-skills skill.",
  ].join('\n');

  const parts = [
    '<EXTREMELY_IMPORTANT>',
    'threejs-game-skills is loaded and active — you have access to the full Three.js game development skill library.',
    '',
    'Use the `skill` tool to list available skills, or type `/3js:<name>` to invoke one directly',
    '(e.g. `/3js:game-director`, `/3js:gameplay-systems`, `/3js:aaa-graphics-builder`).',
    '',
  ];

  if (instructionsBody) {
    parts.push('## Instructions', '', instructionsBody, '');
  }

  parts.push(toolMapping, '</EXTREMELY_IMPORTANT>');
  _bootstrapCache = parts.join('\n');
  return _bootstrapCache;
}

/**
 * Factory function — the plugin entry.
 * OpenCode v1 Plugin API: (input, options) => Promise<Hooks>
 */
const createPlugin = async () => {
  const skills = scanSkills();

  return {
    config: async (config) => {
      try {
        config.skills = config.skills || {};
        config.skills.paths = config.skills.paths || [];
        if (!config.skills.paths.includes(skillsDir)) {
          config.skills.paths.push(skillsDir);
        }

        // Register each skill as a slash command
        config.command = config.command || {};
        for (const skill of skills) {
          const cmdName = `3js-${skill.name.replace('threejs-', '')}`;
          if (!config.command[cmdName]) {
            config.command[cmdName] = {
              template: `# ${skill.name}\n\n${skill.description}\n\nUse the \`skill\` tool to load the ${skill.name} skill and follow its instructions.\n\n$ARGUMENTS`,
              description: skill.description.slice(0, 100),
            };
          }
        }
        console.log(`[threejs-game-skills] registered ${skills.length} skills + ${Object.keys(config.command).filter(k => k.startsWith('3js-')).length} slash commands`);
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
      console.log(`🎮 Three.js Game Skills session started. ${skills.length} skills loaded. Use /3js:<name> (e.g. /3js:game-director, /3js:gameplay-systems).`);
    },
  };
};

export default createPlugin;
export { createPlugin as server };
