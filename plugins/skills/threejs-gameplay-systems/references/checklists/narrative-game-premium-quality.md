# Narrative Game Premium Quality Checklist

## Story & Choice Architecture
- Story delivered through at least 2 modes: dialogue with choices, environmental storytelling, scripted events, or collectible lore entries.
- Branching dialogue: at least 2-4 options per decision point with tracked consequences (flags/variables affecting later scenes, character reactions, endings). TRUE branching (choices fork into genuinely different content, not just flavor text converging to same outcome).
- Choice-and-consequence engine: every meaningful decision tracked; consequences surface visibly later. "X will remember that" must deliver later scenes where X's behavior actually changes.
- Choice transparency: players see evidence their choices matter — Life is Strange' butterfly animation, Disco Elysium's skill check notifications, Telltale's "[Character] will remember that." Without feedback, players stop believing in agency.
- At least 2 major story branches or endings based on accumulated choices. Intermediate consequences visible within the same scene or chapter.
- Choice consequence mapping spreadsheet: every choice → downstream effects → which scenes/flags it touches. Without this, the team ships broken branches (characters referencing events that didn't happen, or forgetting events that did).
- No "right answer" design: moral choices present genuinely difficult trade-offs where reasonable people disagree. If 95% choose option A, it wasn't a real choice.

## Dialogue System
- Dialogue tree architecture: node-based authoring tool (Twine, Ink, Yarn Spinner, Articy:Draft), not raw JSON hand-editing. Localization pipeline handles branching text. Variable/flag system for choice tracking. Validation: can this node actually be reached? Are all conditions satisfiable?
- Dialogue UI: speaker name, portrait/character model with expression changes, dialogue text (typewriter or scroll reveal), choice buttons with readable text. Speaker identification for off-screen characters.
- Dialogue history/log: scrollable, reviewable. Player misses a line or wants to recall what an NPC said three scenes ago — without a log, they alt-tab to a wiki, killing immersion.
- Every line of dialogue accomplishes at least two of: character development, plot advancement, world-building, or player guidance. Flavor text is earned, not filler.
- Dialogue choices that all say the same thing ("Yes, enthusiastically" / "Yes, reluctantly" / "Yes, sarcastically" → identical NPC response) are the fastest way to teach players their choices don't matter.

## Characters
- At least 4 named characters with distinct visual design, voice/text personality, and narrative arc. Characters are fully realized people first; identity is one facet of their humanity.
- Player character has at least 2 distinct dialogue tones (diplomatic, aggressive, cunning, empathetic) that affect NPC responses and story branches.
- Character relationship system: tracked affinity scores influencing dialogue options, story paths, endings. Graduated scales with visible feedback.
- Memory/callback system: characters reference past shared events naturally. Technical system tracks shared-memory events and surfaces appropriate callbacks without forcing or contradicting.

## Environmental Storytelling
- Environment tells story without dialogue: readable props, posters, signs, environmental damage, lighting/mood shifts, audio cues.
- Non-verbal narrative systems: body language, facial expression, character positioning, lighting changes, camera framing, environmental state changes — all carry story information without dialogue.
- Level composition as narrative: a room that gets darker as a character's mood worsens is narrative design, not just lighting design.

## Pacing & Interaction
- Pacing alternates between high-intensity (action, revelation, chase) and low-intensity (exploration, dialogue, reflection) sequences.
- Walk-and-talk/dynamic conversation: dialogue happens DURING gameplay, not pausing it. Spatial audio follows speaker. Subtitle positioning doesn't obstruct gameplay. Dialogue paced to match traversal distance.
- Smooth transition between gameplay and narrative: no hard cuts from "walking around" to "now a cutscene is happening." Dialogue while walking, UI transforms during key moments, environment reacts during conversation.
- No emotional whiplash: character devastated by story event does not immediately do cheerful side-quest activities. Gameplay loop and narrative pacing designed together.

## Failure as Narrative
- Failure absorbed into story rather than "game over" screen. Disco Elysium doesn't stop when you fail a check — the failure IS the story. Every interaction needs a failure branch.
- Death/retry teaches something: death screen shows what happened, why, and ideally the narrative context. A death that teaches nothing is wasted frustration.
- No forced replay of 20 minutes of unskippable content to get back to a choice point. Autosave before every major decision.

## Journal & Quest System
- Journal/log/codex: active quests, completed events, character relationships, discovered lore. Readable navigation.
- Quest/objective system distinguishes main story, side story, optional discovery with distinct visual markers.
- Interaction prompts: context-sensitive (examine, talk, pick up, use, open). Consistent button mapping. Prompt appears only when actionable.

## Cutscenes & Presentation
- Scripted sequences/cutscenes: camera direction (close-up, wide, pan, track) to guide attention. Cutscenes are skippable.
- Lighting, color grade, and audio ambience shift to match narrative mood per scene/chapter.
- Voice acting conveys subtext: hesitation, deflection, suppressed anger, warmth — emotional information not in the text. Flat line readings kill immersion faster than no voice acting.
- Character animation: idle, talk/gesture, walk, and at least one emotional state (happy, sad, angry, scared) readable from gameplay camera.

## Save System
- Save/load: at least 3 manual slots + auto-save at chapter/major choice points.
- Chapter select after completion allows revisiting choice points without full replay.
- Save preserves all narrative flags, relationship scores, and world state.

## Accessibility
- Subtitle toggle, subtitle size options, speaker labels, background opacity for readability.
- Dyslexic font option. Colorblind-friendly choice indicators (shape + icon, not color alone).
- Text-speed control. Auto-advance optional and configurable.
- Voice-over or text-advance pacing lets player read at comfortable speed.

## HUD
- Minimal during exploration and dialogue: interaction prompt, objective hint, journal shortcut. Full HUD only during active gameplay segments.
- The HUD philosophy: "show nothing unless the player needs it right now."

## Audio
- Environmental soundscapes: wind, distant traffic, room tone, weather. Changes with emotional beats.
- Character-specific themes/motifs. Reactive soundtrack shifting with scene emotion and dialogue choice. Dynamic music with layered stems, not static loops.
- Audio logs/recordings play while player continues to explore. Must not overlap with main dialogue.
- Spatial audio for off-screen speakers during walk-and-talk sequences.

## Mobile
- Dialogue text at phone distance: significantly larger fonts, higher-contrast text backgrounds, wider line spacing than console/PC.
- Touch interaction for dialogue: scrollable options, tap-to-select, swipe-to-advance. Long text passages need pagination, not scrolling walls of text.
- Subtitles ON by default on mobile (many play without sound in public/commuting).
- Natural stopping points (chapter ends, major revelations) trigger autosave + gentle "take a break?" prompt. Mobile sessions are shorter and more interrupted.
- Portrait mode for reading-heavy sections; landscape for exploration. Or design entire experience for portrait-first mobile.
- Touch zones for environmental interaction: larger radii than desktop mouse clicks. Gyroscope-based look disorienting for narrative exploration — stick to touch-drag camera.

## Performance
- Memory and disposal clean across scene transitions, chapter loads, dialogue-system teardown. Verify no leaks after 10+ scene transitions.
- Renderer diagnostics checked across all major environments and during dialogue close-up camera modes.
- Save file size monitored; saves must not grow unboundedly with accumulated narrative flags.

## Playtest
- Game loop tested through: exploration → NPC interaction → dialogue choice → consequence observation → puzzle/action sequence → chapter transition.
- Choice consequence mapping validated: every tracked choice verified to produce its documented downstream effect.
- Pacing tested: playtesters report emotional rhythm; identify sections where they felt bored (too much exposition) or rushed (too little breathing room).
