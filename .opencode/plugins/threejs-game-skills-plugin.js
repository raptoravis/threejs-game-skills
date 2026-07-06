export default {
  name: "threejs-game-skills",
  version: "1.0.3",
  description: "Self-contained skills for building playable, polished Three.js browser games.",
  async load(api) {
    api.addInstructions("plugins/AGENTS.md");
    api.addSkills("plugins/skills");
  },
};
