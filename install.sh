#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ./install.sh [--claude] [--codex] [--opencode] [--reasonix] [--agents] [--all] [--force] [--prune-managed] [--file-copy]

Installs the Three.js game skills from ./skills into local agent skill
directories. Prefers native plugin install when the agent CLI is available;
falls back to file copy otherwise.

Recommended:
  ./install.sh --claude
  ./install.sh --codex
  ./install.sh --all

Targets:
  --claude   Install for Claude Code (plugin preferred, file copy fallback)
  --codex    Install for Codex (plugin preferred, file copy fallback)
  --opencode Install for OpenCode (plugin preferred, file copy fallback)
  --reasonix Install skills into Reasonix directory (file copy only)
  --all      Install for Claude Code, Codex, OpenCode, and Reasonix

Advanced:
  --agents  Install into ${AGENTS_SKILLS_DIR:-$HOME/.agents/skills} (file copy only)
            Only use this for agent surfaces that read .agents/skills without
            also reading Codex or Claude skills, otherwise skills can duplicate.

Options:
  --force          Replace same-named skills in the target directory
  --prune-managed  Remove stale skills recorded in this repo's managed manifest
  --file-copy      Force file-copy install even when plugin CLI is available
USAGE
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_dir="$script_dir/plugins/skills"
claude="false"
codex="false"
opencode="false"
reasonix="false"
agents="false"
force="false"
prune="false"
file_copy="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --claude)
      claude="true"
      shift
      ;;
    --codex)
      codex="true"
      shift
      ;;
    --opencode)
      opencode="true"
      shift
      ;;
    --reasonix)
      reasonix="true"
      shift
      ;;
    --all)
      claude="true"
      codex="true"
      opencode="true"
      reasonix="true"
      shift
      ;;
    --agents)
      agents="true"
      shift
      ;;
    --force)
      force="true"
      shift
      ;;
    --prune-managed)
      prune="true"
      shift
      ;;
    --file-copy)
      file_copy="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

if [[ "$claude" != "true" && "$codex" != "true" && "$opencode" != "true" && "$reasonix" != "true" && "$agents" != "true" ]]; then
  usage
  exit 1
fi

if [[ ! -d "$source_dir" ]]; then
  echo "Source skills directory not found: $source_dir" >&2
  exit 1
fi

repo_spec="raptoravis/threejs-game-skills"
plugin_spec="threejs-game-skills@threejs-game-skills"
opencode_plugin_spec="threejs-game-skills@git+https://github.com/raptoravis/threejs-game-skills.git"

# ── helpers ──

copy_skill() {
  local source="$1"
  local dest="$2"

  if command -v rsync >/dev/null 2>&1; then
    rsync -a \
      --exclude '.DS_Store' \
      --exclude '__pycache__/' \
      --exclude 'node_modules/' \
      --exclude 'dist/' \
      --exclude 'artifacts/' \
      --exclude 'test-results/' \
      --exclude 'playwright-report/' \
      --exclude 'coverage/' \
      "$source"/ "$dest"/
  else
    cp -R "$source"/. "$dest"/
    find "$dest" \( \
      -name '.DS_Store' -o \
      -name '__pycache__' -o \
      -name 'node_modules' -o \
      -name 'dist' -o \
      -name 'artifacts' -o \
      -name 'test-results' -o \
      -name 'playwright-report' -o \
      -name 'coverage' \
      \) -prune -exec rm -rf {} +
  fi
}

install_skills() {
  local target="$1"
  local label="$2"
  local manifest="$target/.threejs-game-skills-managed"
  local source_names=" "

  mkdir -p "$target"
  echo "Installing Three.js game skills for $label -> $target"

  for skill in "$source_dir"/*; do
    [[ -d "$skill" && -f "$skill/SKILL.md" ]] || continue
    local skill_name
    skill_name="$(basename "$skill")"
    source_names="$source_names$skill_name "
    local dest="$target/$skill_name"

    if [[ -e "$dest" && "$force" != "true" ]]; then
      continue
    fi

    rm -rf "$dest"
    mkdir -p "$dest"
    copy_skill "$skill" "$dest"
    echo "  Installed $skill_name -> $dest"
  done

  if [[ "$prune" == "true" && -f "$manifest" ]]; then
    while IFS= read -r installed_name; do
      [[ -n "$installed_name" ]] || continue
      if [[ "$source_names" != *" $installed_name "* && -d "$target/$installed_name" ]]; then
        rm -rf "$target/$installed_name"
        echo "  Pruned stale managed skill: $target/$installed_name"
      fi
    done < "$manifest"
  fi

  for skill in "$source_dir"/*; do
    [[ -d "$skill" && -f "$skill/SKILL.md" ]] || continue
    basename "$skill"
  done | sort > "$manifest"
}

# Install via native plugin if CLI available, otherwise fall back to file copy
install_via_plugin() {
  local cli_name="$1"
  local label="$2"
  local target_dir="$3"
  local install_cmd="$4"

  if [[ "$file_copy" != "true" ]] && command -v "$cli_name" >/dev/null 2>&1; then
    echo "Installing Three.js Game Skills for $label (native plugin)..."
    if eval "$install_cmd"; then
      echo "$label: plugin installed. Restart $label afterward."
      return
    fi
    echo "$label: plugin install failed, falling back to file copy..."
  else
    if [[ "$file_copy" == "true" ]]; then
      echo "$label: --file-copy forced, using file copy..."
    else
      echo "$label CLI not found, using file copy fallback..."
    fi
  fi
  install_skills "$target_dir" "$label"
}

# ── Claude Code ──

if [[ "$claude" == "true" ]]; then
  claude_skills="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
  claude_install_cmd="claude plugin marketplace add $repo_spec 2>/dev/null; "
  if [[ "$force" == "true" ]]; then
    claude_install_cmd+="claude plugin update $plugin_spec || claude plugin install $plugin_spec"
  else
    claude_install_cmd+="claude plugin install $plugin_spec"
  fi
  install_via_plugin "claude" "Claude Code" "$claude_skills" "$claude_install_cmd"
fi

# ── Codex ──

if [[ "$codex" == "true" ]]; then
  codex_skills="${CODEX_HOME:-$HOME/.codex}/skills"
  codex_install_cmd="codex plugin marketplace add $repo_spec 2>/dev/null; codex plugin add threejs-game-skills@threejs-game-skills"
  install_via_plugin "codex" "Codex" "$codex_skills" "$codex_install_cmd"
fi

# ── OpenCode ──

if [[ "$opencode" == "true" ]]; then
  opencode_skills="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills"
  # Always use --force so the cached package is updated to latest;
  # without it, opencode plugin -g skips the update when a cached
  # version already exists, leaving stale plugin code in place.
  opencode_install_cmd="opencode plugin -g $opencode_plugin_spec --force"
  install_via_plugin "opencode" "OpenCode" "$opencode_skills" "$opencode_install_cmd"
fi

# ── Reasonix (file copy only) ──

if [[ "$reasonix" == "true" ]]; then
  reasonix_target="${REASONIX_SKILLS_DIR:-$HOME/.reasonix/skills}"
  install_skills "$reasonix_target" "Reasonix"
fi

# ── Agents (file copy only) ──

if [[ "$agents" == "true" ]]; then
  echo "Warning: --agents can duplicate skills in Codex if Codex also reads ~/.agents/skills." >&2
  agents_target="${AGENTS_SKILLS_DIR:-$HOME/.agents/skills}"
  install_skills "$agents_target" ".agents"
fi

echo ""
echo "Done. Restart your agent and run your first skill prompt, e.g.:"
echo "  Use threejs-game-director to build a premium game from scratch."
