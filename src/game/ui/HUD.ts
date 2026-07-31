import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { DungeonGrid, TileType } from '../dungeon/DungeonGenerator';
import { Monster } from '../entities/Monster';

export class HUD {
    public readonly scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private topBarGfx: Phaser.GameObjects.Graphics;

    // Badges & Status Displays
    private floorBadge: Phaser.GameObjects.Container;
    private floorText: Phaser.GameObjects.Text;

    private levelBadge: Phaser.GameObjects.Container;
    private levelText: Phaser.GameObjects.Text;

    private hpBarGfx: Phaser.GameObjects.Graphics;
    private hpText: Phaser.GameObjects.Text;

    private mpBarGfx: Phaser.GameObjects.Graphics;
    private mpText: Phaser.GameObjects.Text;

    private expBarGfx: Phaser.GameObjects.Graphics;
    private expText: Phaser.GameObjects.Text;

    private atkBadge: Phaser.GameObjects.Container;
    private atkText: Phaser.GameObjects.Text;

    private defBadge: Phaser.GameObjects.Container;
    private defText: Phaser.GameObjects.Text;

    private exploreBadge: Phaser.GameObjects.Container;
    private exploreText: Phaser.GameObjects.Text;

    // Minimap Container
    private minimapContainer: Phaser.GameObjects.Container;
    private minimapGfx: Phaser.GameObjects.Graphics;
    private minimapTitle: Phaser.GameObjects.Text;
    private showMinimap: boolean = true;

    // Action Buttons
    private btnInv: Phaser.GameObjects.Container;
    private btnMagic: Phaser.GameObjects.Container;
    private btnWait: Phaser.GameObjects.Container;
    private btnStats: Phaser.GameObjects.Container;
    private btnPause: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.container = scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(150);

        this.topBarGfx = scene.add.graphics();
        this.container.add(this.topBarGfx);

        // 1. Floor & Level Badges
        this.floorBadge = this.createBadge(15, 12, 110, 32, 0x7c3aed, 0xa78bfa);
        this.floorText = scene.add.text(70, 28, 'FLOOR 1/30', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.floorBadge.add(this.floorText);

        this.levelBadge = this.createBadge(135, 12, 90, 32, 0x059669, 0x34d399);
        this.levelText = scene.add.text(180, 28, 'LVL 1', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.levelBadge.add(this.levelText);

        // 2. Health, Mana & EXP Bar Containers
        this.hpBarGfx = scene.add.graphics();
        this.hpText = scene.add.text(315, 28, 'HP 100/100', {
            fontFamily: 'monospace', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.mpBarGfx = scene.add.graphics();
        this.mpText = scene.add.text(475, 28, 'MP 50/50', {
            fontFamily: 'monospace', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.expBarGfx = scene.add.graphics();
        this.expText = scene.add.text(625, 28, 'EXP 0/50', {
            fontFamily: 'monospace', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 3. ATK, DEF & MAP EXPLORATION Badges
        this.atkBadge = this.createBadge(700, 12, 85, 32, 0x9a3412, 0xf97316);
        this.atkText = scene.add.text(742, 28, 'ATK 18', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.atkBadge.add(this.atkText);

        this.defBadge = this.createBadge(793, 12, 85, 32, 0x0f766e, 0x14b8a6);
        this.defText = scene.add.text(835, 28, 'DEF 5', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.defBadge.add(this.defText);

        // Map Exploration Stat Badge
        this.exploreBadge = this.createBadge(886, 12, 110, 32, 0x0369a1, 0x38bdf8);
        this.exploreText = scene.add.text(941, 28, 'MAP 0%', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.exploreBadge.add(this.exploreText);

        this.container.add([
            this.floorBadge, this.levelBadge,
            this.hpBarGfx, this.hpText,
            this.mpBarGfx, this.mpText,
            this.expBarGfx, this.expText,
            this.atkBadge, this.defBadge, this.exploreBadge
        ]);

        // 4. Action Pill Buttons
        this.btnInv = this.createActionButton(15, 52, 'Inventory', '[E]', 0x0284c7, 0x38bdf8);
        this.btnMagic = this.createActionButton(155, 52, 'Magic Spells', '[Q]', 0x7c3aed, 0xc084fc);
        this.btnWait = this.createActionButton(305, 52, 'Wait Turn', '[Space]', 0x059669, 0x34d399);
        this.btnStats = this.createActionButton(455, 52, 'Hero Stats', '[Z]', 0x0369a1, 0x38bdf8);
        this.btnPause = this.createActionButton(605, 52, 'Pause Menu', '[Enter]', 0xd97706, 0xfacc15);

        this.container.add([this.btnInv, this.btnMagic, this.btnWait, this.btnStats, this.btnPause]);

        // 5. Minimap Setup
        this.minimapContainer = scene.add.container(0, 0);
        this.minimapContainer.setScrollFactor(0);
        this.minimapContainer.setDepth(160);

        this.minimapGfx = scene.add.graphics();
        this.minimapTitle = scene.add.text(70, -14, 'MINIMAP (0%)', {
            fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#38bdf8', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.minimapContainer.add([this.minimapGfx, this.minimapTitle]);

        this.resize(scene.scale.width, scene.scale.height);
    }

    private createBadge(x: number, y: number, w: number, h: number, fillColor: number, borderColor: number): Phaser.GameObjects.Container {
        const c = this.scene.add.container(0, 0);
        const gfx = this.scene.add.graphics();
        gfx.fillStyle(fillColor, 0.95);
        gfx.fillRoundedRect(x, y, w, h, 6);
        gfx.lineStyle(2, borderColor, 1.0);
        gfx.strokeRoundedRect(x, y, w, h, 6);
        c.add(gfx);
        return c;
    }

    private createActionButton(x: number, y: number, label: string, shortcut: string, color: number, strokeColor: number): Phaser.GameObjects.Container {
        const c = this.scene.add.container(x, y);
        const w = 135;
        const h = 32;

        const bg = this.scene.add.graphics();
        bg.fillStyle(color, 0.9);
        bg.fillRoundedRect(0, 0, w, h, 8);
        bg.lineStyle(2, strokeColor, 1.0);
        bg.strokeRoundedRect(0, 0, w, h, 8);

        const txt = this.scene.add.text(w / 2, h / 2, `${label} ${shortcut}`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        c.add([bg, txt]);

        // Interactive hit area
        const hitArea = this.scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.0001).setInteractive({ useHandCursor: true });
        hitArea.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(strokeColor, 1.0);
            bg.fillRoundedRect(0, 0, w, h, 8);
            bg.lineStyle(2, 0xffffff, 1.0);
            bg.strokeRoundedRect(0, 0, w, h, 8);
        });
        hitArea.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(color, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 8);
            bg.lineStyle(2, strokeColor, 1.0);
            bg.strokeRoundedRect(0, 0, w, h, 8);
        });
        c.add(hitArea);

        return c;
    }

    public resize(screenWidth: number, _screenHeight: number) {
        this.topBarGfx.clear();
        this.topBarGfx.fillStyle(0x090d16, 0.92);
        this.topBarGfx.fillRect(0, 0, screenWidth, 90);
        this.topBarGfx.lineStyle(2, 0x38bdf8, 0.5);
        this.topBarGfx.strokeLineShape(new Phaser.Geom.Line(0, 90, screenWidth, 90));

        this.minimapContainer.setPosition(screenWidth - 155, 125);
    }

    public updatePlayerStatus(player: Player, floor: number, grid?: DungeonGrid) {
        const effMaxHp = player.getEffectiveMaxHp();
        const effMaxMp = player.getEffectiveMaxMp();

        this.levelText.setText(`LVL ${player.level}`);
        this.floorText.setText(`FLOOR ${floor}/30`);

        // Draw Health Bar
        this.hpBarGfx.clear();
        this.drawStatBar(this.hpBarGfx, 240, 12, 150, 32, player.currentHp, effMaxHp, 0xef4444, 0xfca5a5);
        this.hpText.setText(`HP ${player.currentHp}/${effMaxHp}`);

        // Draw Mana Bar
        this.mpBarGfx.clear();
        this.drawStatBar(this.mpBarGfx, 400, 12, 150, 32, player.currentMp, effMaxMp, 0x3b82f6, 0x93c5fd);
        this.mpText.setText(`MP ${player.currentMp}/${effMaxMp}`);

        // Draw EXP Bar
        this.expBarGfx.clear();
        this.drawStatBar(this.expBarGfx, 560, 12, 130, 32, player.exp, player.expToNextLevel, 0xeab308, 0xfef08a);
        this.expText.setText(`EXP ${player.exp}/${player.expToNextLevel}`);

        this.atkText.setText(`ATK ${player.getEffectiveAtk()}`);
        this.defText.setText(`DEF ${player.getEffectiveDef()}`);

        if (grid) {
            const pct = this.calculateExplorationPercentage(grid);
            this.exploreText.setText(`MAP ${pct}%`);
            this.minimapTitle.setText(`MINIMAP (${pct}%)`);
        }
    }

    public calculateExplorationPercentage(grid: DungeonGrid): number {
        let totalFloor = 0;
        let exploredFloor = 0;

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                if (grid.tiles[y][x] !== TileType.WALL) {
                    totalFloor++;
                    if (grid.explored[y][x]) exploredFloor++;
                }
            }
        }

        return totalFloor > 0 ? Math.round((exploredFloor / totalFloor) * 100) : 0;
    }

    private drawStatBar(
        gfx: Phaser.GameObjects.Graphics,
        x: number, y: number, w: number, h: number,
        val: number, maxVal: number,
        fillCol: number, borderCol: number
    ) {
        gfx.fillStyle(0x0f172a, 0.95);
        gfx.fillRoundedRect(x, y, w, h, 6);

        const pct = Math.max(0, Math.min(1, val / Math.max(1, maxVal)));
        if (pct > 0) {
            gfx.fillStyle(fillCol, 0.95);
            gfx.fillRoundedRect(x + 2, y + 2, Math.max(8, (w - 4) * pct), h - 4, 4);
        }

        gfx.lineStyle(2, borderCol, 0.9);
        gfx.strokeRoundedRect(x, y, w, h, 6);
    }

    public renderMinimap(grid: DungeonGrid, player: Player, monsters: Monster[]) {
        if (!this.showMinimap) {
            this.minimapGfx.clear();
            return;
        }

        this.minimapGfx.clear();

        const mapSize = 140;
        const scale = mapSize / Math.max(grid.width, grid.height);

        // Minimap panel card
        this.minimapGfx.fillStyle(0x090d16, 0.92);
        this.minimapGfx.fillRoundedRect(0, 0, mapSize, mapSize, 8);
        this.minimapGfx.lineStyle(2, 0x38bdf8, 0.8);
        this.minimapGfx.strokeRoundedRect(0, 0, mapSize, mapSize, 8);

        // Draw ALL explored tiles without skipping rows or columns!
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                if (grid.explored[y][x]) {
                    if (grid.tiles[y][x] === TileType.FLOOR) {
                        this.minimapGfx.fillStyle(0x38bdf8, 0.45);
                        this.minimapGfx.fillRect(x * scale, y * scale, Math.max(1, scale), Math.max(1, scale));
                    } else if (grid.tiles[y][x] === TileType.STAIR) {
                        this.minimapGfx.fillStyle(0xf59e0b, 1.0);
                        this.minimapGfx.fillRect(x * scale - 0.5, y * scale - 0.5, Math.max(2.5, scale * 1.5), Math.max(2.5, scale * 1.5));
                    }
                }
            }
        }

        // Draw active monsters in FOV
        monsters.filter(m => m.isAlive() && grid.visible[m.y][m.x]).forEach(m => {
            this.minimapGfx.fillStyle(0xef4444, 1.0);
            this.minimapGfx.fillRect(m.x * scale - 1, m.y * scale - 1, Math.max(3, scale * 2.5), Math.max(3, scale * 2.5));
        });

        // Draw player icon on minimap
        this.minimapGfx.fillStyle(0xfacc15, 1.0);
        this.minimapGfx.fillRect(player.x * scale - 1.5, player.y * scale - 1.5, Math.max(4, scale * 3.5), Math.max(4, scale * 3.5));

        const pct = this.calculateExplorationPercentage(grid);
        this.minimapTitle.setText(`MINIMAP (${pct}%)`);
    }

    public getInventoryBtn(): Phaser.GameObjects.GameObject { return this.btnInv.list[2]; }
    public getMagicBtn(): Phaser.GameObjects.GameObject { return this.btnMagic.list[2]; }
    public getWaitBtn(): Phaser.GameObjects.GameObject { return this.btnWait.list[2]; }
    public getStatsBtn(): Phaser.GameObjects.GameObject { return this.btnStats.list[2]; }
    public getPauseBtn(): Phaser.GameObjects.GameObject { return this.btnPause.list[2]; }
}
