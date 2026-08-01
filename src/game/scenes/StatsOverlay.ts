import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Difficulty } from '../config/GameConfig';
import { AudioManager } from '../audio/AudioManager';

export class StatsOverlay extends Phaser.Scene {
    private player!: Player;
    private floor: number = 1;
    private difficulty: Difficulty = Difficulty.NORMAL;
    private onCloseCallback?: () => void;
    private container!: Phaser.GameObjects.Container;

    constructor() {
        super('StatsOverlay');
    }

    public init(data: { player: Player; floor?: number; difficulty?: Difficulty; onClose?: () => void }) {
        this.player = data.player;
        this.floor = data.floor || 1;
        this.difficulty = data.difficulty || Difficulty.NORMAL;
        this.onCloseCallback = data.onClose;
    }

    public create() {
        const { width, height } = this.scale;

        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.82).setOrigin(0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.close());

        this.container = this.add.container(width / 2, height / 2);
        this.renderStatsModal();

        this.input.keyboard?.on('keydown-Z', () => this.close());
        this.input.keyboard?.on('keydown-ESC', () => this.close());
        this.input.keyboard?.on('keydown-ENTER', () => this.close());

        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
    }

    private renderStatsModal() {
        this.container.removeAll(true);

        const w = 740;
        const h = 530;

        // Modal Frame Card
        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.98);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0x38bdf8, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
        this.container.add(panel);

        // Header Title
        const title = this.add.text(0, -h / 2 + 28, '📊 HERO CHARACTER & RUN STATISTICS [Z]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '22px', color: '#38bdf8', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.container.add(title);

        const subtext = this.add.text(0, -h / 2 + 52, `Floor ${this.floor} / 30 • ${this.difficulty} Difficulty • Level ${this.player.level} (${this.player.exp}/${this.player.expToNextLevel} EXP)`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(subtext);

        // ==========================================
        // LEFT COLUMN: ⚔️ HERO STATS & EQUIPMENT
        // ==========================================
        const leftX = -w / 2 + 25;
        const colWidth = 335;
        const colHeight = 405;
        const startY = -h / 2 + 72;

        const leftGfx = this.add.graphics();
        leftGfx.fillStyle(0x0f172a, 0.9);
        leftGfx.fillRoundedRect(leftX, startY, colWidth, colHeight, 10);
        leftGfx.lineStyle(2, 0x0284c7, 0.8);
        leftGfx.strokeRoundedRect(leftX, startY, colWidth, colHeight, 10);
        this.container.add(leftGfx);

        const leftHeader = this.add.text(leftX + colWidth / 2, startY + 18, '⚔️ BASE & TOTAL STATS', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#38bdf8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(leftHeader);

        // Stat Details
        const effAtk = this.player.getEffectiveAtk();
        const effDef = this.player.getEffectiveDef();
        const effHp = this.player.getEffectiveMaxHp();
        const effMp = this.player.getEffectiveMaxMp();
        const effFov = this.player.getEffectiveFov();

        const itemAtk = this.player.getItemAtkBonus();
        const itemDef = this.player.getItemDefBonus();
        const itemHp = this.player.getItemHpBonus();
        const itemMp = this.player.getItemMpBonus();
        const itemFov = this.player.getItemFovBonus();
        const lvlFov = this.player.getLevelFovBonus();
        const buffFov = this.player.getSpellFovBonus();

        const statLines = [
            `❤️ MAX HEALTH: ${effHp}  (Base: ${this.player.maxHp} | Items: +${itemHp})`,
            `💧 MAX MANA: ${effMp}  (Base: ${this.player.maxMp} | Items: +${itemMp})`,
            `⚔️ ATTACK POWER: ${effAtk}  (Base: ${this.player.atk} | Items: +${itemAtk})`,
            `🛡️ DEFENSE POWER: ${effDef}  (Base: ${this.player.def} | Items: +${itemDef})`,
            `👁️ VISION (FOV): ${effFov}  (Base: ${this.player.baseFov} | Lvl: +${lvlFov} | Items: +${itemFov}${buffFov > 0 ? ` | Buff: +${buffFov}` : ''})`
        ];

        let lineY = startY + 45;
        statLines.forEach(line => {
            const txt = this.add.text(leftX + 16, lineY, line, {
                fontFamily: 'system-ui, monospace', fontSize: '11px', color: '#f8fafc', fontStyle: 'bold'
            });
            this.container.add(txt);
            lineY += 24;
        });

        // Equipment & Mastery Ranks Section Header
        const eqHeader = this.add.text(leftX + colWidth / 2, lineY + 12, '🎒 ACTIVE EQUIPMENT & MASTERY', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#c084fc', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(eqHeader);

        lineY += 32;

        const slots: { label: string; item: any }[] = [
            { label: 'Weapon', item: this.player.equipment.weapon },
            { label: 'Head', item: this.player.equipment.head },
            { label: 'Body', item: this.player.equipment.body },
            { label: 'Ring', item: this.player.equipment.ring }
        ];

        slots.forEach(s => {
            const itemName = s.item ? s.item.name : 'None';
            const rank = s.item ? this.player.getItemMasteryRank(s.item.name) : 1;
            const rankBadge = s.item && rank > 1 ? ` (Rank ${rank})` : '';

            const itemTxt = this.add.text(leftX + 16, lineY, `• ${s.label}: ${itemName}${rankBadge}`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: s.item ? '#e2e8f0' : '#64748b', fontStyle: 'bold'
            });
            this.container.add(itemTxt);

            if (s.item && s.item.passive) {
                lineY += 16;
                const passTxt = this.add.text(leftX + 28, lineY, `└ Passive: ${s.item.passive.name} (${s.item.passive.description})`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#facc15', wordWrap: { width: colWidth - 40 }
                });
                this.container.add(passTxt);
                lineY += passTxt.height;
            }

            lineY += 18;
        });

        // ==========================================
        // RIGHT COLUMN: 🏆 LIFETIME RUN STATISTICS
        // ==========================================
        const rightX = w / 2 - colWidth - 25;

        const rightGfx = this.add.graphics();
        rightGfx.fillStyle(0x0f172a, 0.9);
        rightGfx.fillRoundedRect(rightX, startY, colWidth, colHeight, 10);
        rightGfx.lineStyle(2, 0xf59e0b, 0.8);
        rightGfx.strokeRoundedRect(rightX, startY, colWidth, colHeight, 10);
        this.container.add(rightGfx);

        const rightHeader = this.add.text(rightX + colWidth / 2, startY + 18, '🏆 LIFETIME RUN RECORD', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#facc15', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(rightHeader);

        const records = [
            { icon: '💥', label: 'Total Damage Dealt', val: `${this.player.totalDamageDealt.toLocaleString()} HP`, color: '#f87171' },
            { icon: '👹', label: 'Monsters Slain', val: `${this.player.totalMonstersKilled.toLocaleString()} Slain`, color: '#fb923c' },
            { icon: '⏳', label: 'Total Turns Taken', val: `${this.player.totalTurns.toLocaleString()} Turns`, color: '#facc15' },
            { icon: '🎒', label: 'Items Picked Up', val: `${this.player.itemsPickedUp.toLocaleString()} Items`, color: '#38bdf8' },
            { icon: '✨', label: 'Spells Cast', val: `${this.player.spellsCast.toLocaleString()} Spells`, color: '#c084fc' },
            { icon: '🛡️', label: 'Total Damage Taken', val: `${this.player.totalDamageTaken.toLocaleString()} HP`, color: '#f43f5e' },
            { icon: '💚', label: 'Health Restored', val: `${this.player.totalHealthHealed.toLocaleString()} HP`, color: '#4ade80' },
            { icon: '📜', label: 'Spells Learned', val: `${this.player.learnedSpells.length} Spells`, color: '#a78bfa' }
        ];

        let rLineY = startY + 52;
        records.forEach(rec => {
            const iconTxt = this.add.text(rightX + 20, rLineY, `${rec.icon} ${rec.label}:`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#cbd5e1', fontStyle: 'bold'
            });

            const valTxt = this.add.text(rightX + colWidth - 20, rLineY, rec.val, {
                fontFamily: 'system-ui, monospace', fontSize: '12px', color: rec.color, fontStyle: 'bold'
            }).setOrigin(1, 0);

            this.container.add([iconTxt, valTxt]);
            rLineY += 40;
        });

        // Close Button
        const closeBtn = this.add.rectangle(0, h / 2 - 28, 220, 36, 0x0284c7, 1.0).setInteractive({ useHandCursor: true });
        closeBtn.setStrokeStyle(2, 0x38bdf8);

        const closeTxt = this.add.text(0, h / 2 - 28, 'CLOSE STATS [Z / ESC]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        closeBtn.on('pointerdown', () => {
            AudioManager.getInstance().playMove();
            this.close();
        });

        this.container.add([closeBtn, closeTxt]);
    }

    private close() {
        this.scale.off('resize', this.handleResize, this);
        if (this.onCloseCallback) this.onCloseCallback();
        this.scene.stop();
    }
}
