<#
.SYNOPSIS
Installs Three.js Game Skills for AI coding agents.

.DESCRIPTION
Claude Code / Codex / OpenCode -> native plugin commands (preferred) or file copy fallback
Reasonix                       -> file copy (no plugin marketplace)
Cursor                         -> file copy (rules to ~/.cursor/rules/)
Agents                         -> file copy (generic agent skills dir)

.PARAMETER Claude
Install for Claude Code

.PARAMETER Codex
Install for Codex

.PARAMETER OpenCode
Install for OpenCode

.PARAMETER Reasonix
Install skills into Reasonix directory

.PARAMETER Cursor
Install rules into Cursor directory

.PARAMETER Agents
Install into $HOME\.agents\skills

.PARAMETER All
Install for Claude Code, Codex, OpenCode, and Reasonix

.PARAMETER Force
Replace same-named skills / force plugin reinstall

.PARAMETER PruneManaged
Remove stale skills recorded in this repo's managed manifest (file-copy targets only)

.PARAMETER FileCopy
Force file-copy install even when plugin CLI is available

.EXAMPLE
.\install.ps1 -Claude
.\install.ps1 -Codex
.\install.ps1 -Reasonix
.\install.ps1 -All -Force
.\install.ps1 -Claude -FileCopy
#>

[CmdletBinding()]
param(
    [switch]$Claude,
    [switch]$Codex,
    [switch]$OpenCode,
    [switch]$Reasonix,
    [switch]$Cursor,
    [switch]$Agents,
    [switch]$All,
    [switch]$Force,
    [switch]$PruneManaged,
    [switch]$FileCopy
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = Join-Path $scriptDir "plugins/skills"

if ($All) {
    $Claude = $true
    $Codex = $true
    $OpenCode = $true
    $Reasonix = $true
    $Cursor = $true
}

if (-not ($Claude -or $Codex -or $OpenCode -or $Reasonix -or $Cursor -or $Agents)) {
    Write-Host "Usage: .\install.ps1 [-Claude] [-Codex] [-OpenCode] [-Reasonix] [-Cursor] [-Agents] [-All] [-Force] [-PruneManaged] [-FileCopy]"
    Write-Host ""
    Write-Host "Targets:"
    Write-Host "  -Claude       Install for Claude Code (plugin preferred, file copy fallback)"
    Write-Host "  -Codex        Install for Codex (plugin preferred, file copy fallback)"
    Write-Host "  -OpenCode     Install for OpenCode (plugin preferred, file copy fallback)"
    Write-Host "  -Reasonix     Install skills into Reasonix directory (file copy only)"
    Write-Host "  -Cursor       Install rules into Cursor directory (file copy only)"
    Write-Host "  -Agents       Install into `$HOME\.agents\skills (file copy only)"
    Write-Host "  -All          Install for Claude Code, Codex, OpenCode, Reasonix, and Cursor"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Force        Replace same-named skills / force plugin reinstall"
    Write-Host "  -FileCopy     Force file-copy install even when plugin CLI is available"
    Write-Host "  -PruneManaged Remove stale skills (file-copy targets only)"
    exit 1
}

if (-not (Test-Path $sourceDir)) {
    Write-Error "Source skills directory not found: $sourceDir"
    exit 1
}

$homeDir = if ($env:USERPROFILE) { $env:USERPROFILE } elseif ($env:HOME) { $env:HOME } else { [Environment]::GetFolderPath("UserProfile") }
if (-not $homeDir) {
    Write-Error "Cannot determine user home directory. Set USERPROFILE or HOME environment variable."
    exit 1
}
$repoUrl = "https://github.com/raptoravis/threejs-game-skills"
$repoSpec = "raptoravis/threejs-game-skills"
$pluginSpec = "threejs-game-skills@threejs-game-skills"
$openCodePluginSpec = "threejs-game-skills@git+${repoUrl}.git"

$excludeDirs = @('.DS_Store', '__pycache__', 'node_modules', 'dist', 'artifacts', 'test-results', 'playwright-report', 'coverage')

function Copy-SkillDir {
    param([string]$Source, [string]$Dest)
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    Get-ChildItem -Path $Source -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($Source.Length).TrimStart('\', '/')
        $destPath = Join-Path $Dest $relativePath
        if ($_.PSIsContainer) {
            $leaf = Split-Path $_.FullName -Leaf
            if ($leaf -notin $excludeDirs) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
        } else {
            $parent = Split-Path $_.FullName -Parent
            $parentLeaf = Split-Path $parent -Leaf
            if ($parentLeaf -notin $excludeDirs -and $parent -notmatch '(\\|/)__pycache__') {
                Copy-Item -Path $_.FullName -Destination $destPath -Force
            }
        }
    }
}

function Install-SkillsFileCopy {
    param(
        [string]$TargetDir,
        [string]$Label,
        [string]$ManifestName = ".threejs-game-skills-managed"
    )

    $manifest = Join-Path $TargetDir $ManifestName
    $sourceNames = " "
    $existingManifest = @()

    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "Installing Three.js game skills for $Label -> $TargetDir"

    if ($PruneManaged -and (Test-Path $manifest)) {
        $existingManifest = @(Get-Content $manifest | Where-Object { $_ -and $_.Trim() })
    }

    Get-ChildItem -Path $sourceDir -Directory | ForEach-Object {
        $skillDir = $_.FullName
        $skillMd = Join-Path $skillDir "SKILL.md"
        if (-not (Test-Path $skillMd)) { return }
        $skillName = $_.Name
        $sourceNames = "$sourceNames$skillName "
        $dest = Join-Path $TargetDir $skillName
        if ((Test-Path $dest) -and (-not $Force)) {
            return
        }
        Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        Copy-SkillDir -Source $skillDir -Dest $dest
        Write-Host "  Installed $skillName -> $dest"
    }

    if ($PruneManaged) {
        foreach ($name in $existingManifest) {
            if ($sourceNames -notmatch " $name " -and (Test-Path (Join-Path $TargetDir $name))) {
                Remove-Item -Recurse -Force (Join-Path $TargetDir $name)
                Write-Host "  Pruned stale managed skill: $TargetDir\$name"
            }
        }
    }

    Get-ChildItem -Path $sourceDir -Directory | ForEach-Object {
        $skillMd = Join-Path $_.FullName "SKILL.md"
        if (Test-Path $skillMd) { $_.Name }
    } | Sort-Object | Set-Content $manifest -Encoding UTF8
}

function Install-NativePlugin {
    param(
        [string]$AgentName,
        [string]$ClrName,
        [scriptblock]$InstallBlock,
        [scriptblock]$FileCopyBlock
    )

    if (-not $FileCopy) {
        $cli = Get-Command $AgentName -ErrorAction SilentlyContinue
        if ($cli) {
            Write-Host "Installing Three.js Game Skills for $ClrName (native plugin)..."
            try {
                & $InstallBlock
                Write-Host "$ClrName : plugin installed. Restart $ClrName afterward."
                return
            } catch {
                Write-Host "$ClrName : plugin install failed, falling back to file copy..."
            }
        } else {
            Write-Host "$ClrName CLI not found, using file copy fallback..."
        }
    }
    & $FileCopyBlock
}

# ── Claude Code ──

if ($Claude) {
    $claudeSkills = Join-Path $homeDir ".claude\skills"
    Install-NativePlugin -AgentName "claude" -ClrName "Claude Code" -InstallBlock {
        claude plugin marketplace remove $repoSpec 2>$null; claude plugin marketplace add $repoSpec 2>$null
        if ($Force) {
            claude plugin update $pluginSpec
            if ($LASTEXITCODE -ne 0) { claude plugin install $pluginSpec }
        } else {
            claude plugin install $pluginSpec
        }
    } -FileCopyBlock {
        Install-SkillsFileCopy -TargetDir $claudeSkills -Label "Claude Code"
    }
}

# ── Codex ──

if ($Codex) {
    $codexSkills = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $homeDir ".codex\skills" }
    Install-NativePlugin -AgentName "codex" -ClrName "Codex" -InstallBlock {
        codex plugin marketplace add $repoSpec 2>$null
        codex plugin add "threejs-game-skills@threejs-game-skills"
    } -FileCopyBlock {
        Install-SkillsFileCopy -TargetDir $codexSkills -Label "Codex"
    }
}

# ── OpenCode ──

if ($OpenCode) {
    $openCodeSkills = if ($env:XDG_CONFIG_HOME) { Join-Path $env:XDG_CONFIG_HOME "opencode\skills" } else { Join-Path $homeDir ".config\opencode\skills" }
    Install-NativePlugin -AgentName "opencode" -ClrName "OpenCode" -InstallBlock {
        # Always use --force so the cached package is updated to latest;
        # without it, opencode plugin -g skips the update when a cached
        # version already exists, leaving stale plugin code in place.
        opencode plugin -g $openCodePluginSpec --force
    } -FileCopyBlock {
        Install-SkillsFileCopy -TargetDir $openCodeSkills -Label "OpenCode"
    }
}

# ── Cursor (file copy: rules to ~/.cursor/rules/) ──

if ($Cursor) {
    $cursorRulesTarget = Join-Path $homeDir ".cursor\rules"
    $cursorMcpTarget = Join-Path $homeDir ".cursor"
    $cursorSourceRules = Join-Path $scriptDir "plugins\.cursor\rules"
    $cursorSourceMcp = Join-Path $scriptDir "plugins\.cursor\mcp.json"

    if (Test-Path $cursorSourceRules) {
        Write-Host "Installing Cursor rules to $cursorRulesTarget"
        New-Item -ItemType Directory -Path $cursorRulesTarget -Force | Out-Null
        Get-ChildItem -Path $cursorSourceRules -Filter "*.mdc" | ForEach-Object {
            $dest = Join-Path $cursorRulesTarget $_.Name
            if ((Test-Path $dest) -and (-not $Force)) {
                Write-Host "  Skipped $($_.Name) (already exists, use -Force to overwrite)"
                return
            }
            Copy-Item -Path $_.FullName -Destination $dest -Force
            Write-Host "  Installed $($_.Name) -> $dest"
        }
    } else {
        Write-Warning "Cursor rules source not found: $cursorSourceRules"
    }

    if (Test-Path $cursorSourceMcp) {
        $mcpDest = Join-Path $cursorMcpTarget "mcp.json"
        Write-Host "Installing Cursor MCP config"
        if ((Test-Path $mcpDest) -and (-not $Force)) {
            Write-Host "  Skipped mcp.json (already exists at $mcpDest, use -Force to overwrite or merge manually)"
        } else {
            New-Item -ItemType Directory -Path $cursorMcpTarget -Force | Out-Null
            Copy-Item -Path $cursorSourceMcp -Destination $mcpDest -Force
            Write-Host "  Installed mcp.json -> $mcpDest"
        }
    }
}

# ── Reasonix (file copy) ──

if ($Reasonix) {
    $reasonixTarget = if ($env:REASONIX_SKILLS_DIR) { $env:REASONIX_SKILLS_DIR } else { Join-Path $homeDir ".reasonix\skills" }
    Install-SkillsFileCopy -TargetDir $reasonixTarget -Label "Reasonix" -ManifestName ".threejs-game-skills-managed"
}

# ── Agents (file copy) ──

if ($Agents) {
    Write-Warning "-Agents can duplicate skills in Codex if Codex also reads ~/.agents/skills."
    $agentsTarget = if ($env:AGENTS_SKILLS_DIR) { $env:AGENTS_SKILLS_DIR } else { Join-Path $homeDir ".agents\skills" }
    Install-SkillsFileCopy -TargetDir $agentsTarget -Label ".agents"
}

Write-Host ""
Write-Host "Done. Restart your agent and run your first skill prompt, e.g.:"
Write-Host "  Use threejs-game-director to build a premium game from scratch."
