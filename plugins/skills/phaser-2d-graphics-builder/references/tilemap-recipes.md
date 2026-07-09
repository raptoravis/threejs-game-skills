# Tilemap Recipes (Phaser 2D)

Use this reference when building or upgrading tilemaps, parallax backgrounds, or level environment visuals.

## Tilemap Design Process

1. Define tile size: 16x16 (retro), 32x32 (standard), 64x64 (detailed).
2. Create tileset with at least 3 terrain variants per zone.
3. Build map in Tiled editor (`.tmx`/`.json` export) or procedurally.
4. Layer organization (bottom to top): background color → far parallax → mid parallax → ground → decoration → collision → foreground.
5. Export and load in Phaser.

## Tileset Minimum Requirements

Per zone/biome:
- Ground/surface: 3+ variants (center, edge, corner) + transition tiles.
- Walls/borders: 3+ variants.
- Decoration: 5+ props (rocks, plants, crates, signs, etc.).
- Hazard surfaces: 1-2 types (spikes, lava, water edge).
- Platform/structural: 2-3 types (wood, stone, metal).

## Layer Types

| Layer | Purpose | Parallax Factor | Collision |
|---|---|---|---|
| Sky/Color | Solid color or gradient behind everything | 0 | No |
| Far background | Mountains, clouds, distant city | 0.1-0.2 | No |
| Mid background | Trees, hills, buildings | 0.3-0.5 | No |
| Ground | Walkable surfaces, floors | 1.0 | Yes (static) |
| Decoration | Props, plants, detail elements | 1.0 | Optional (decoration collision layer) |
| One-way platforms | Pass-through from below | 1.0 | Yes (one-way) |
| Hazards | Spikes, lava, traps | 1.0 | Yes (sensor) |
| Foreground | Elements in front of player (vines, arches) | 1.2-1.5 | No |

## Loading Tilemaps (Phaser 4)

```ts
// In preload
this.load.image('tileset', 'assets/tilesets/zone1.png');
this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');

// In create
const map = this.make.tilemap({ key: 'level1' });
const tileset = map.addTilesetImage('zone1', 'tileset');

// Layers
const groundLayer = map.createLayer('Ground', tileset, 0, 0);
const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
const hazardLayer = map.createLayer('Hazards', tileset, 0, 0);

// Collision
groundLayer.setCollisionByExclusion([-1]); // collide all non-empty tiles
hazardLayer.setCollisionByExclusion([-1]);
```

## Parallax Background

```ts
// Far background - slow scroll
const bgFar = this.add.tileSprite(0, 0, width, height, 'bg-far');
bgFar.setOrigin(0, 0);
bgFar.setScrollFactor(0);
bgFar.setDepth(-20);

// Mid background
const bgMid = this.add.tileSprite(0, 0, width, height, 'bg-mid');
bgMid.setOrigin(0, 0);
bgMid.setScrollFactor(0);
bgMid.setDepth(-10);

// In update
bgFar.tilePositionX = this.cameras.main.scrollX * 0.1;
bgMid.tilePositionX = this.cameras.main.scrollX * 0.3;
```

## Procedural Tilemap Generation

For procedurally generated levels:
```ts
// Generate tile indices into a 2D array
const level: number[][] = [];
for (let y = 0; y < height; y++) {
  level[y] = [];
  for (let x = 0; x < width; x++) {
    level[y][x] = getTile(x, y); // Your generation logic
  }
}

// Apply to tilemap
const map = this.make.tilemap({
  data: level,
  tileWidth: 32,
  tileHeight: 32,
});
```

## Tilemap Quality Checklist

- [ ] No visible tile seams or gaps at any zoom level.
- [ ] Edge/corner transition tiles exist at biome boundaries.
- [ ] All collision tiles have `setCollision` applied.
- [ ] Decoration tiles do not block movement unintentionally.
- [ ] Hazard tiles have distinct visual from safe tiles.
- [ ] Tile culling enabled (cull padding = 1-2 tiles beyond camera).
- [ ] Tileset texture is power-of-two dimensions (e.g., 256, 512, 1024).
- [ ] Parallax layers tested at min and max camera zoom.
- [ ] No single repeated tile pattern visible across >30% of screen width.
