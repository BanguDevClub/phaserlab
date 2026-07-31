import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { SPELL_CATALOG } from '../magic/MagicSystem';
import { AudioManager } from '../audio/AudioManager';

export class MagicOverlay extends Phaser.Scene {
    private player!: Player;
    private onSelectSpell?: (spellId: string) => void;
    private onCloseCallback?: () => void;
    private container!: Phaser.GameObjects.Container;

    private currentPage: number = 0;
    private readonly spellsPerPage: number = 4;

    constructor() {
        super('MagicOverlay');
    }

    public init(data: { player: Player; onSelectSpell?: (spellId: string) => void; onClose?: () => void }) {
        this.player = data.player;
        this.onSelectSpell = data.onSelectSpell;
        this.onCloseCallback = data.onClose;
        this.currentPage = 0;
    }

    public create() {
        const { width, height } = this.scale;

        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.close());

        this.container = this.add.container(width / 2, height / 2);
        this.renderMagicModal();

        this.input.keyboard?.on('keydown-Q', () => this.close());
        this.input.keyboard?.on('keydown-ESC', () => this.close());

        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
    }

    private renderMagicModal() {
        this.container.removeAll(true);

        const w = 700;
        const h = 530;

        // Modal Card Frame
        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.96);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0xa855f7, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
        this.container.add(panel);

        const title = this.add.text(0, -h / 2 + 28, '✨ SPELLBOOK & ARCANE SPELLS [Q]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '22px', color: '#c084fc', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.container.add(title);

        const mpBonusPct = Math.round((this.player.getEffectiveMaxMp() / 100) * 40);
        const mpScalingTxt = this.add.text(0, -h / 2 + 52, `⚡ MP Power Scaling: +${mpBonusPct}% Damage/Heal Power (Based on ${this.player.getEffectiveMaxMp()} Max MP)`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#38bdf8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(mpScalingTxt);

        const totalPages = Math.max(1, Math.ceil(this.player.learnedSpells.length / this.spellsPerPage));
        if (this.currentPage >= totalPages) this.currentPage = totalPages - 1;
        if (this.currentPage < 0) this.currentPage = 0;

        if (this.player.learnedSpells.length === 0) {
            const noSpells = this.add.text(0, -10, 'You have not learned any magic spells yet!\n\nFind and read Scrolls dropped by dungeon monsters or room chests.', {
                fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#94a3b8', align: 'center', lineSpacing: 6
            }).setOrigin(0.5);
            this.container.add(noSpells);
        } else {
            // Pagination Header Bar
            if (totalPages > 1) {
                const pageTxt = this.add.text(0, -h / 2 + 75, `Page ${this.currentPage + 1}/${totalPages}  (Learned Spells: ${this.player.learnedSpells.length})`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#c084fc', fontStyle: 'bold'
                }).setOrigin(0.5);

                const prevBtn = this.add.rectangle(-150, -h / 2 + 75, 54, 22, this.currentPage > 0 ? 0x7c3aed : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
                prevBtn.setStrokeStyle(1, 0xc084fc);
                const prevTxt = this.add.text(-150, -h / 2 + 75, '◀ Prev', {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                prevBtn.on('pointerdown', () => {
                    if (this.currentPage > 0) {
                        this.currentPage--;
                        AudioManager.getInstance().playMove();
                        this.renderMagicModal();
                    }
                });

                const nextBtn = this.add.rectangle(150, -h / 2 + 75, 54, 22, this.currentPage < totalPages - 1 ? 0x7c3aed : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
                nextBtn.setStrokeStyle(1, 0xc084fc);
                const nextTxt = this.add.text(150, -h / 2 + 75, 'Next ▶', {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                nextBtn.on('pointerdown', () => {
                    if (this.currentPage < totalPages - 1) {
                        this.currentPage++;
                        AudioManager.getInstance().playMove();
                        this.renderMagicModal();
                    }
                });

                this.container.add([pageTxt, prevBtn, prevTxt, nextBtn, nextTxt]);
            }

            let startY = -h / 2 + (totalPages > 1 ? 95 : 82);
            const pageSpells = this.player.learnedSpells.slice(this.currentPage * this.spellsPerPage, (this.currentPage + 1) * this.spellsPerPage);

            pageSpells.forEach(spellId => {
                const spell = SPELL_CATALOG[spellId];
                if (!spell) return;

                const spellRank = this.player.getSpellMasteryRank(spell.id);
                const masteryDiscount = 0.15 * (spellRank - 1);
                const totalDiscount = Math.min(0.85, this.player.getManaDiscount() + masteryDiscount);

                const cost = Math.max(3, Math.round(spell.manaCost * (1 - totalDiscount)));
                const canCast = this.player.currentMp >= cost;

                const mpScaleMult = 1.0 + (this.player.getEffectiveMaxMp() / 100) * 0.4;
                const masteryPowerMult = 1 + 0.25 * (spellRank - 1);
                const finalPower = Math.round(spell.power * masteryPowerMult * mpScaleMult);

                const cardHeight = 72;
                const cardGfx = this.add.graphics();
                cardGfx.fillStyle(canCast ? 0x1e1b4b : 0x18181b, 0.9);
                cardGfx.fillRoundedRect(-w / 2 + 25, startY, w - 50, cardHeight, 8);
                cardGfx.lineStyle(2, canCast ? 0xa855f7 : 0x475569, 1.0);
                cardGfx.strokeRoundedRect(-w / 2 + 25, startY, w - 50, cardHeight, 8);
                this.container.add(cardGfx);

                // Target Type Badge Label
                let targetTypeTag = '[🎯 SINGLE TARGET]';
                let targetTypeColor = '#38bdf8';
                if (spell.type === 'AOE') {
                    targetTypeTag = `[💥 AOE (Radius: ${spell.range})]`;
                    targetTypeColor = '#f59e0b';
                } else if (spell.type === 'HEAL' || spell.type === 'BUFF' || spell.type === 'TELEPORT') {
                    targetTypeTag = '[✨ SELF / UTILITY]';
                    targetTypeColor = '#10b981';
                }

                // Left Column: Spell Name, Type Tag, Rank & Description
                const textColor = canCast ? '#ffffff' : '#64748b';
                const rankBadge = spellRank > 1 ? ` ⭐Rank ${spellRank}` : '';
                const nameTxt = this.add.text(-w / 2 + 38, startY + 8, `${spell.name}${rankBadge} (Power: ${finalPower})`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: textColor, fontStyle: 'bold'
                });

                const tagTxt = this.add.text(-w / 2 + 38 + nameTxt.width + 12, startY + 10, targetTypeTag, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: targetTypeColor, fontStyle: 'bold'
                });

                const descText = this.add.text(-w / 2 + 38, startY + 30, spell.description, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: canCast ? '#cbd5e1' : '#475569',
                    lineSpacing: 1, wordWrap: { width: 410 }
                });

                // Right Column: Cost & Cast Button
                const costBadgeColor = canCast ? '#38bdf8' : '#ef4444';
                const costTxt = this.add.text(w / 2 - 150, startY + 26, `${cost} MP`, {
                    fontFamily: 'monospace', fontSize: '14px', color: costBadgeColor, fontStyle: 'bold'
                }).setOrigin(1, 0.5);

                this.container.add([nameTxt, tagTxt, descText, costTxt]);

                if (canCast) {
                    const castBtn = this.add.rectangle(w / 2 - 75, startY + 36, 95, 34, 0x7c3aed, 1.0).setInteractive({ useHandCursor: true });
                    castBtn.setStrokeStyle(2, 0xc084fc);

                    const castTxt = this.add.text(w / 2 - 75, startY + 36, 'CAST', {
                        fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
                    }).setOrigin(0.5);

                    castBtn.on('pointerdown', () => {
                        AudioManager.getInstance().playMagicCast();
                        if (this.onSelectSpell) this.onSelectSpell(spell.id);
                        this.close();
                    });

                    this.container.add([castBtn, castTxt]);
                } else {
                    const warnBtn = this.add.rectangle(w / 2 - 75, startY + 36, 95, 34, 0x27272a, 1.0);
                    warnBtn.setStrokeStyle(1, 0xef4444);

                    const warnTxt = this.add.text(w / 2 - 75, startY + 36, 'NO MP', {
                        fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ef4444', fontStyle: 'bold'
                    }).setOrigin(0.5);

                    this.container.add([warnBtn, warnTxt]);
                }

                startY += 78;
            });
        }

        const closeHint = this.add.text(0, h / 2 - 20, '[Press Q / ESC to Close]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(closeHint);
    }

    private close() {
        this.scale.off('resize', this.handleResize, this);
        if (this.onCloseCallback) this.onCloseCallback();
        this.scene.stop();
    }
}
