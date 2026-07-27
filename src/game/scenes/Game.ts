import { Scene } from 'phaser';
import { Difficulty, DIFFICULTY_SETTINGS, getZoneForFloor, ZONE_PALETTES, TILE_SIZE } from '../config/GameConfig';
import { DungeonGrid, DungeonGenerator, TileType } from '../dungeon/DungeonGenerator';
import { Player } from '../entities/Player';
import { Monster } from '../entities/Monster';
import { Bestiary } from '../entities/Bestiary';
import { ItemData } from '../items/ItemSystem';
import { ShapeRenderer } from '../graphics/ShapeRenderer';
import { CombatManager } from '../combat/CombatManager';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager, PlayerSaveData, LevelSaveData } from '../save/SaveManager';
import { EventLog } from '../ui/EventLog';
import { HUD } from '../ui/HUD';

export class Game extends Scene {
    private difficulty: Difficulty = Difficulty.NORMAL;
    private currentFloor: number = 1;
    private grid!: DungeonGrid;

    private player!: Player;
    private monsters: Monster[] = [];
    private droppedItems: { item: ItemData; x: number; y: number }[] = [];

    // Rendering Graphics Layers
    private dungeonGfx!: Phaser.GameObjects.Graphics;
    private itemsGfx!: Phaser.GameObjects.Graphics;
    private monstersGfx!: Phaser.GameObjects.Graphics;
    private playerGfx!: Phaser.GameObjects.Graphics;

    // UI Overlays
    private hud!: HUD;
    private eventLog!: EventLog;

    private isProcessingTurn: boolean = false;
    private spellCastingMode: boolean = false;
    private activeSpellId: string | null = null;
    private pendingSaveData: PlayerSaveData | null = null;
    private pendingLevelSaveData: LevelSaveData | null = null;

    constructor() {
        super('Game');
    }

    public init(data: { difficulty?: Difficulty; floor?: number; saveData?: PlayerSaveData; levelSaveData?: LevelSaveData }) {
        this.difficulty = data.difficulty || Difficulty.NORMAL;
        this.currentFloor = data.floor || 1;
        this.isProcessingTurn = false;
        this.spellCastingMode = false;
        this.activeSpellId = null;
        this.pendingSaveData = data.saveData || null;
        this.pendingLevelSaveData = data.levelSaveData || null;

        // If starting a new run on Floor 1 without save data, reset player instance
        if (this.currentFloor === 1 && !this.pendingSaveData) {
            // @ts-ignore
            this.player = null;
        }
    }

    public create() {
        this.isProcessingTurn = false;
        this.spellCastingMode = false;

        const audio = AudioManager.getInstance();
        const zone = getZoneForFloor(this.currentFloor);
        audio.playZoneTrack(zone);

        // Setup Graphics Container & Layers
        this.dungeonGfx = this.add.graphics();
        this.itemsGfx = this.add.graphics();
        this.monstersGfx = this.add.graphics();
        this.playerGfx = this.add.graphics();

        // Generate or Restore Dungeon Grid, Monsters, and Dropped Items
        if (this.pendingLevelSaveData) {
            const ld = this.pendingLevelSaveData;
            this.grid = {
                floor: this.currentFloor,
                width: ld.width,
                height: ld.height,
                tiles: ld.tiles,
                explored: ld.explored,
                visible: ld.visible,
                rooms: [],
                playerStart: ld.playerStart,
                stairPos: ld.stairPos,
                monsterSpawns: [],
                itemSpawns: []
            };

            this.monsters = ld.monsters.map(m => {
                const tmpl = Bestiary.getMonsterTemplateById(m.templateId);
                const monster = new Monster(tmpl, m.x, m.y, 1.0);
                monster.currentHp = m.currentHp;
                monster.maxHp = m.maxHp;
                monster.atk = m.atk;
                monster.def = m.def;
                monster.expReward = m.expReward;
                return monster;
            });

            this.droppedItems = ld.droppedItems || [];
            this.pendingLevelSaveData = null;
        } else {
            this.grid = DungeonGenerator.generateFloor(this.currentFloor);
            this.monsters = [];
            this.droppedItems = [];
            const monsterMult = DIFFICULTY_SETTINGS[this.difficulty].monsterStatMult;
            this.grid.monsterSpawns.forEach(spawn => {
                const template = Bestiary.getRandomMonsterForFloor(this.currentFloor);
                const m = new Monster(template, spawn.x, spawn.y, 1.0 + (this.currentFloor - 1) * 0.18 * monsterMult);
                this.monsters.push(m);
            });
        }

        // Spawn, Reposition or Load Player
        if (!this.player || !this.player.isAlive() || (this.currentFloor === 1 && !this.pendingSaveData)) {
            this.player = new Player(this.grid.playerStart.x, this.grid.playerStart.y);
            const mult = DIFFICULTY_SETTINGS[this.difficulty].playerStatMult;
            this.player.maxHp = Math.round(this.player.maxHp * mult);
            this.player.currentHp = this.player.maxHp;
        } else {
            this.player.x = this.grid.playerStart.x;
            this.player.y = this.grid.playerStart.y;
            // Replenish HP/MP on advancing floor
            this.player.currentHp = this.player.getEffectiveMaxHp();
            this.player.currentMp = this.player.getEffectiveMaxMp();
        }

        if (this.pendingSaveData) {
            SaveManager.restorePlayerFromSave(this.player, this.pendingSaveData);
            this.pendingSaveData = null;
        }

        // Initial Player Position for Camera Tracking
        const initialPx = this.player.x * TILE_SIZE + TILE_SIZE / 2;
        const initialPy = this.player.y * TILE_SIZE + TILE_SIZE / 2;
        this.playerGfx.setPosition(initialPx, initialPy);

        // Initial FOV calculate
        DungeonGenerator.updateVisibility(this.grid, this.player.x, this.player.y, 7);

        // Setup Camera Tracking WITHOUT strict screen edge clamping
        this.cameras.main.removeBounds();
        this.cameras.main.startFollow(this.playerGfx, true, 0.15, 0.15);

        // Setup UI Overlays
        this.hud = new HUD(this);
        this.eventLog = new EventLog(this, 15, this.scale.height - 175);

        // Wire HUD Action Buttons
        this.hud.getInventoryBtn().on('pointerdown', () => this.openInventory());
        this.hud.getMagicBtn().on('pointerdown', () => this.openMagic());
        this.hud.getWaitBtn().on('pointerdown', () => this.handleWait());
        this.hud.getPauseBtn().on('pointerdown', () => this.openPauseMenu());

        // Setup Keyboard Inputs
        this.setupInputs();

        // Scale & Resize Handler
        this.scale.on('resize', this.handleResize, this);

        this.eventLog.addMessage(`★ Floor ${this.currentFloor} [${ZONE_PALETTES[zone].name}] Ready!`);
        this.redrawAll();
    }

    private setupInputs() {
        const keyboard = this.input.keyboard;
        if (!keyboard) return;

        keyboard.removeAllListeners();
        this.input.removeAllListeners();

        // Directional Movement / Attack
        keyboard.on('keydown-W', () => this.handleMove(0, -1));
        keyboard.on('keydown-UP', () => this.handleMove(0, -1));

        keyboard.on('keydown-S', () => this.handleMove(0, 1));
        keyboard.on('keydown-DOWN', () => this.handleMove(0, 1));

        keyboard.on('keydown-A', () => this.handleMove(-1, 0));
        keyboard.on('keydown-LEFT', () => this.handleMove(-1, 0));

        keyboard.on('keydown-D', () => this.handleMove(1, 0));
        keyboard.on('keydown-RIGHT', () => this.handleMove(1, 0));

        // Action Keys
        keyboard.on('keydown-E', () => this.openInventory());
        keyboard.on('keydown-Q', () => this.openMagic());
        keyboard.on('keydown-SPACE', () => this.handleWait());
        keyboard.on('keydown-ENTER', () => this.openPauseMenu());
        keyboard.on('keydown-ESC', () => this.openPauseMenu());

        // Pointer click to cast target spell or walk
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.y < 90) return; // Skip clicks on HUD top bar

            const worldX = pointer.worldX;
            const worldY = pointer.worldY;
            const tileX = Math.floor(worldX / TILE_SIZE);
            const tileY = Math.floor(worldY / TILE_SIZE);

            if (this.spellCastingMode && this.activeSpellId) {
                this.castSpellTarget(this.activeSpellId, tileX, tileY);
            }
        });
    }

    private handleMove(dx: number, dy: number) {
        if (this.isProcessingTurn || !this.player.isAlive()) return;
        this.isProcessingTurn = true;

        const diffSettings = DIFFICULTY_SETTINGS[this.difficulty];
        const result = CombatManager.executePlayerMoveOrAttack(
            this.player, dx, dy, this.grid, this.monsters, diffSettings.expMult
        );

        result.logMessages.forEach(msg => this.eventLog.addMessage(msg));
        result.droppedItems.forEach(drop => this.droppedItems.push(drop));

        // Handle item pickup if standing on item tile
        this.checkItemPickup();

        if (result.levelTransition) {
            this.advanceFloor();
            return;
        }

        if (result.turnPassed) {
            this.finalizeTurn();
        } else {
            this.isProcessingTurn = false;
        }

        this.redrawAll();
    }

    private handleWait() {
        if (this.isProcessingTurn || !this.player.isAlive()) return;
        this.isProcessingTurn = true;

        const result = CombatManager.executePlayerWait(this.player);
        result.logMessages.forEach(msg => this.eventLog.addMessage(msg));

        this.finalizeTurn();
        this.redrawAll();
    }

    private openInventory() {
        if (this.scene.isActive('InventoryOverlay') || this.scene.isActive('PauseOverlay')) return;
        this.scene.pause();
        this.scene.launch('InventoryOverlay', {
            player: this.player,
            onClose: () => {
                this.scene.resume();
                this.redrawAll();
            }
        });
    }

    private openMagic() {
        if (this.scene.isActive('MagicOverlay') || this.scene.isActive('PauseOverlay')) return;
        this.scene.pause();
        this.scene.launch('MagicOverlay', {
            player: this.player,
            onSelectSpell: (spellId: string) => {
                this.spellCastingMode = true;
                this.activeSpellId = spellId;
                this.eventLog.addMessage(`✨ Select a target tile to cast ${spellId}!`);
            },
            onClose: () => {
                this.scene.resume();
                this.redrawAll();
            }
        });
    }

    private openPauseMenu() {
        if (this.scene.isActive('PauseOverlay') || this.scene.isActive('SaveOverlay') || this.scene.isActive('InventoryOverlay') || this.scene.isActive('MagicOverlay')) return;
        this.scene.pause();
        this.scene.launch('PauseOverlay', {
            player: this.player,
            floor: this.currentFloor,
            difficulty: this.difficulty,
            grid: this.grid,
            monsters: this.monsters,
            droppedItems: this.droppedItems,
            onClose: () => {
                this.scene.resume();
                this.redrawAll();
            }
        });
    }

    private castSpellTarget(spellId: string, tx: number, ty: number) {
        if (this.isProcessingTurn || !this.player.isAlive()) return;
        this.isProcessingTurn = true;
        this.spellCastingMode = false;

        const diffSettings = DIFFICULTY_SETTINGS[this.difficulty];
        const result = CombatManager.executePlayerSpell(
            this.player, spellId, tx, ty, this.grid, this.monsters, diffSettings.expMult
        );

        result.logMessages.forEach(msg => this.eventLog.addMessage(msg));
        result.droppedItems.forEach(drop => this.droppedItems.push(drop));

        if (result.turnPassed) {
            this.finalizeTurn();
        } else {
            this.isProcessingTurn = false;
        }

        this.redrawAll();
    }

    private checkItemPickup() {
        const foundIdx = this.droppedItems.findIndex(i => i.x === this.player.x && i.y === this.player.y);
        if (foundIdx !== -1) {
            const drop = this.droppedItems[foundIdx];
            this.player.inventory.push(drop.item);
            this.droppedItems.splice(foundIdx, 1);
            AudioManager.getInstance().playItemPickup();
            this.eventLog.addMessage(`🎒 Picked up [${drop.item.name}]!`);
        }
    }

    private finalizeTurn() {
        const diffSettings = DIFFICULTY_SETTINGS[this.difficulty];
        const turnLogs = CombatManager.processTurnEnd(
            this.player, this.monsters, this.grid, diffSettings.expMult
        );
        turnLogs.forEach(msg => this.eventLog.addMessage(msg));

        // Check Player Death
        if (!this.player.isAlive()) {
            AudioManager.getInstance().stopMusic();
            const exploredPct = this.hud.calculateExplorationPercentage(this.grid);
            this.scene.start('GameOver', {
                floor: this.currentFloor,
                level: this.player.level,
                killedBy: 'Dungeon Monsters',
                exploredPct
            });
            return;
        }

        this.isProcessingTurn = false;
    }

    private advanceFloor() {
        this.currentFloor++;
        if (this.currentFloor > 30) {
            const exploredPct = this.hud.calculateExplorationPercentage(this.grid);
            this.scene.start('Victory', { level: this.player.level, exploredPct });
            return;
        }

        this.isProcessingTurn = false;
        // Restart Game scene with next floor
        this.scene.restart({ difficulty: this.difficulty, floor: this.currentFloor });
    }

    private redrawAll() {
        const zone = getZoneForFloor(this.currentFloor);
        const palette = ZONE_PALETTES[zone];

        // 1. Draw Dungeon Tiles Layer
        this.dungeonGfx.clear();

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;
                const isVisible = this.grid.visible[y][x];
                const isExplored = this.grid.explored[y][x];

                if (!isExplored) {
                    // Fog of War / Unexplored
                    this.dungeonGfx.fillStyle(palette.fog, 1.0);
                    this.dungeonGfx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                    continue;
                }

                const alpha = isVisible ? 1.0 : 0.45;
                const tile = this.grid.tiles[y][x];

                if (tile === TileType.WALL) {
                    this.dungeonGfx.fillStyle(palette.wall, alpha);
                    this.dungeonGfx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                    this.dungeonGfx.lineStyle(1, palette.wallBorder, alpha);
                    this.dungeonGfx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
                } else if (tile === TileType.FLOOR) {
                    this.dungeonGfx.fillStyle(palette.floor, alpha);
                    this.dungeonGfx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                    this.dungeonGfx.lineStyle(1, palette.floorGrid, alpha * 0.5);
                    this.dungeonGfx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
                } else if (tile === TileType.STAIR) {
                    this.dungeonGfx.fillStyle(palette.floor, alpha);
                    this.dungeonGfx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                    this.dungeonGfx.fillStyle(palette.stair, alpha);
                    this.dungeonGfx.fillCircle(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE * 0.35);
                    this.dungeonGfx.lineStyle(2, 0xffffff, alpha);
                    this.dungeonGfx.strokeCircle(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE * 0.35);
                }
            }
        }

        // 2. Draw Floor Items
        this.itemsGfx.clear();
        this.droppedItems.forEach(drop => {
            if (this.grid.visible[drop.y][drop.x]) {
                const px = drop.x * TILE_SIZE + TILE_SIZE / 2;
                const py = drop.y * TILE_SIZE + TILE_SIZE / 2;
                ShapeRenderer.renderItemIcon(this.itemsGfx, px, py, drop.item.type, drop.item.rarityColor);
            }
        });

        // 3. Draw Monsters
        this.monstersGfx.clear();
        this.monsters.filter(m => m.isAlive()).forEach(m => {
            if (this.grid.visible[m.y][m.x]) {
                const px = m.x * TILE_SIZE + TILE_SIZE / 2;
                const py = m.y * TILE_SIZE + TILE_SIZE / 2;
                ShapeRenderer.renderMonster(this.monstersGfx, px, py, {
                    shape: m.template.shape,
                    fillColor: m.template.fillColor,
                    borderColor: m.template.borderColor
                });
            }
        });

        // 4. Draw Player & Update Position for Smooth Camera Follow
        const playerPx = this.player.x * TILE_SIZE + TILE_SIZE / 2;
        const playerPy = this.player.y * TILE_SIZE + TILE_SIZE / 2;
        this.playerGfx.setPosition(playerPx, playerPy);
        ShapeRenderer.renderPlayer(this.playerGfx, 0, 0);

        // 5. Update HUD, Map Exploration & Minimap
        this.hud.updatePlayerStatus(this.player, this.currentFloor, this.grid);
        this.hud.renderMinimap(this.grid, this.player, this.monsters);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        this.hud.resize(gameSize.width, gameSize.height);
        this.eventLog.resize(15, gameSize.height - 175, Math.min(440, gameSize.width - 180));
    }

    public shutdown() {
        if (this.input.keyboard) {
            this.input.keyboard.removeAllListeners();
        }
        this.input.removeAllListeners();
        this.scale.off('resize', this.handleResize, this);
    }
}
