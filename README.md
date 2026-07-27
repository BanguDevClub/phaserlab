# PhaserLab - 2D Turn-Based Rogue-like Labyrinth RPG

[![Phaser 4](https://img.shields.io/badge/Engine-Phaser%204-0284c7.svg)](https://github.com/phaserjs/phaser)
[![TypeScript 5.7](https://img.shields.io/badge/Language-TypeScript%205.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Bundler-Vite%206-646cff.svg)](https://vitejs.dev/)

**PhaserLab** is an expansive, turn-based 2D Rogue-like RPG featuring 30 procedurally generated labyrinth floors, a 50-monster Bestiary with 5 rarity tiers, item/spell mastery systems, local save management, and responsive fullscreen gameplay.

---

## 🎮 Game Features

### 🏰 Procedural Labyrinth & 3 Zones
- **30 Floors of Labyrinth**: Procedurally generated room layouts, corridors, stairs, items, and monster spawns.
- **Dynamic Floor Dimensions**:
  - **Floors 1–9**: 50×50 Ancient Stone Dungeon *(Palette: Blue/Slate)*
  - **Floors 10–19**: 100×100 Crystal Caverns *(Palette: Purple/Amethyst)*
  - **Floors 20–30**: 200×200 Infernal Abyssal Depths *(Palette: Dark Crimson/Obsidian)*
- **3 Synthesized Zone Soundtracks**: Unique procedural retro synth tracks that automatically switch per zone.

---

### 👹 Bestiary & Rarity Tiers (50 Monsters)
Monsters scale with floor depth and are categorized into 5 explicit rarity tiers:
1. 🟢 **COMMON** (Min stats: 50 HP / 10 ATK / 10 DEF) — *Goblin Scout, Giant Cave Rat, Acid Slime, Orc Warrior*
2. 🟢 **UNCOMMON** (Min stats: 100 HP / 15 ATK / 15 DEF) — *Orc Shaman, Stone Gargoyle, Lich Initiate, Fire Elemental*
3. 🔵 **RARE** (Min stats: 150 HP / 20 ATK / 20 DEF) — *Minotaur Berserker, Gorgon Medusa, Elder Beholder, Fenrir*
4. 🟣 **EPIC** (Min stats: 500 HP / 50 ATK / 50 DEF) — *Dragon Fafnir, Arch-Demon Baal, Kraken Abyssal, Mephistopheles*
5. 🟡 **LEGENDARY** (Min stats: 1000 HP / 100 ATK / 100 DEF) — *Lucifer Morningstar, Tiamat, Cronos, Satan, Demogorgon*

---

### ⭐ Item & Spell Mastery Systems
- **Item Mastery**: Collect duplicate equipment to manually upgrade item ranks (+20% stat bonus per rank).
- **Spell Mastery**: Collect duplicate scrolls to manually upgrade spell ranks (-15% MP cost, +25% Power per rank).
- **Inventory Filters**: Filter inventory by Item Type (*Weapons, Armor, Rings, Scrolls*) and Rarity (*Common, Uncommon, Rare, Epic, Legendary*).

---

### 💾 Unlimited Save Manager & Pause Menu
- **LocalStorage Save Engine**: Save and load your complete game state anytime (hero stats, equipment, inventory, map layout, explored tiles, living monsters, dropped items).
- **Pause Menu (`ENTER` / `ESC`)**: Quick pause menu to resume game, access saves, adjust settings, or return to the main menu.
- **Map Exploration Statistic**: Live percentage calculation of floor tiles explored (`MAP X%`).

---

## 🕹️ Controls & Key Bindings

| Action | Key / Input |
| :--- | :--- |
| **Move North / Attack** | `W` or `Up Arrow` |
| **Move South / Attack** | `S` or `Down Arrow` |
| **Move West / Attack** | `A` or `Left Arrow` |
| **Move East / Attack** | `D` or `Right Arrow` |
| **Open Inventory** | `E` |
| **Open Spellbook** | `Q` |
| **Wait Turn (Restore HP/MP)** | `Space` |
| **Pause Menu & Save/Load** | `ENTER` or `ESC` |
| **Target Spell Casting** | Left Pointer Click on visible tile |

---

## 💻 Tech Stack & Architecture

- **Engine**: Phaser 4 (2D Canvas / WebGL rendering via OOP Scene architecture)
- **Language**: TypeScript 5.7+ with strict type checking
- **Bundler & Server**: Vite 6.3+
- **Audio Engine**: Web Audio API Procedural Synthesizer (`AudioManager`)
- **Persistence**: HTML5 `localStorage` JSON Serialization Engine (`SaveManager`)

---

## 🚀 Getting Started

### Requirements
- [Node.js](https://nodejs.org) (v18+ recommended)
- [pnpm](https://pnpm.io/) or `npm`

### Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Start local development server
pnpm dev

# 3. Type check code
pnpm check

# 4. Build production bundle
pnpm build-nolog
```

The dev server will run at `http://localhost:8080/`.

---

Developed with passion for classic rogue-like games. Powered by Phaser 4, TypeScript, and Vite.
