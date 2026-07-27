import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Difficulty } from '../config/GameConfig';
import { SaveManager, SaveSlot } from '../save/SaveManager';
import { DungeonGrid } from '../dungeon/DungeonGenerator';
import { Monster } from '../entities/Monster';
import { ItemData } from '../items/ItemSystem';
import { AudioManager } from '../audio/AudioManager';

export class SaveOverlay extends Phaser.Scene {
    private mode: 'SAVE_AND_LOAD' | 'LOAD_ONLY' = 'SAVE_AND_LOAD';
    private player?: Player;
    private currentFloor: number = 1;
    private difficulty: Difficulty = Difficulty.NORMAL;
    private grid?: DungeonGrid;
    private monsters?: Monster[];
    private droppedItems?: { item: ItemData; x: number; y: number }[];
    private onCloseCallback?: () => void;
    private container!: Phaser.GameObjects.Container;

    private currentPage: number = 0;
    private readonly slotsPerPage: number = 4;

    constructor() {
        super('SaveOverlay');
    }

    public init(data: {
        mode?: 'SAVE_AND_LOAD' | 'LOAD_ONLY';
        player?: Player;
        floor?: number;
        difficulty?: Difficulty;
        grid?: DungeonGrid;
        monsters?: Monster[];
        droppedItems?: { item: ItemData; x: number; y: number }[];
        onClose?: () => void;
    }) {
        this.mode = data.mode || 'SAVE_AND_LOAD';
        this.player = data.player;
        this.currentFloor = data.floor || 1;
        this.difficulty = data.difficulty || Difficulty.NORMAL;
        this.grid = data.grid;
        this.monsters = data.monsters;
        this.droppedItems = data.droppedItems;
        this.onCloseCallback = data.onClose;
        this.currentPage = 0;
    }

    public create() {
        const { width, height } = this.scale;

        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.close());

        this.container = this.add.container(width / 2, height / 2);
        this.renderSaveModal();

        this.input.keyboard?.on('keydown-ESC', () => this.close());
        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
    }

    private renderSaveModal() {
        this.container.removeAll(true);

        const w = 680;
        const h = 520;

        // Modal Frame Card
        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.98);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0x059669, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
        this.container.add(panel);

        const headerTitle = this.mode === 'LOAD_ONLY' ? '💾 LOAD SAVED GAME' : '💾 SAVE & LOAD MANAGER';
        const title = this.add.text(0, -h / 2 + 28, headerTitle, {
            fontFamily: 'system-ui, sans-serif', fontSize: '22px', color: '#34d399', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.container.add(title);

        const slots = SaveManager.listSaveSlots();
        const totalPages = Math.max(1, Math.ceil(slots.length / this.slotsPerPage));
        if (this.currentPage >= totalPages) this.currentPage = totalPages - 1;
        if (this.currentPage < 0) this.currentPage = 0;

        // Top Action: Create New Save Slot Button (if in SAVE_AND_LOAD mode with player)
        if (this.mode === 'SAVE_AND_LOAD' && this.player) {
            const newSaveBtn = this.add.rectangle(0, -h / 2 + 70, 240, 36, 0x059669, 1.0).setInteractive({ useHandCursor: true });
            newSaveBtn.setStrokeStyle(2, 0x34d399);

            const newSaveTxt = this.add.text(0, -h / 2 + 70, '➕ SAVE TO NEW SLOT', {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            newSaveBtn.on('pointerdown', () => {
                if (this.player) {
                    SaveManager.saveGame(
                        '', this.currentFloor, this.difficulty, this.player,
                        this.grid, this.monsters, this.droppedItems
                    );
                    AudioManager.getInstance().playItemPickup();
                    this.renderSaveModal();
                }
            });

            this.container.add([newSaveBtn, newSaveTxt]);
        }

        // Pagination Controls & Slot List Header
        let startY = -h / 2 + (this.mode === 'SAVE_AND_LOAD' && this.player ? 115 : 75);

        if (totalPages > 1) {
            const pageTxt = this.add.text(0, startY, `Page ${this.currentPage + 1}/${totalPages} (Total Slots: ${slots.length})`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#34d399', fontStyle: 'bold'
            }).setOrigin(0.5);

            const prevBtn = this.add.rectangle(-160, startY, 52, 22, this.currentPage > 0 ? 0x059669 : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            prevBtn.setStrokeStyle(1, 0x34d399);
            const prevTxt = this.add.text(-160, startY, '◀ Prev', {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            prevBtn.on('pointerdown', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    AudioManager.getInstance().playMove();
                    this.renderSaveModal();
                }
            });

            const nextBtn = this.add.rectangle(160, startY, 52, 22, this.currentPage < totalPages - 1 ? 0x059669 : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            nextBtn.setStrokeStyle(1, 0x34d399);
            const nextTxt = this.add.text(160, startY, 'Next ▶', {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            nextBtn.on('pointerdown', () => {
                if (this.currentPage < totalPages - 1) {
                    this.currentPage++;
                    AudioManager.getInstance().playMove();
                    this.renderSaveModal();
                }
            });

            this.container.add([pageTxt, prevBtn, prevTxt, nextBtn, nextTxt]);
            startY += 25;
        }

        if (slots.length === 0) {
            const emptyTxt = this.add.text(0, 0, 'No saved game slots found in LocalStorage.\n\nSave your game in-dungeon to resume anytime!', {
                fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#94a3b8', align: 'center', lineSpacing: 6
            }).setOrigin(0.5);
            this.container.add(emptyTxt);
        } else {
            const pageSlots = slots.slice(this.currentPage * this.slotsPerPage, (this.currentPage + 1) * this.slotsPerPage);

            pageSlots.forEach(slot => {
                const cardGfx = this.add.graphics();
                cardGfx.fillStyle(0x1e293b, 0.9);
                cardGfx.fillRoundedRect(-w / 2 + 30, startY, w - 60, 68, 8);
                cardGfx.lineStyle(2, 0x34d399, 0.8);
                cardGfx.strokeRoundedRect(-w / 2 + 30, startY, w - 60, 68, 8);
                this.container.add(cardGfx);

                const slotInfo = this.add.text(-w / 2 + 45, startY + 12, `💾 ${slot.name}`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
                });

                const dateStr = new Date(slot.timestamp).toLocaleString();
                const subInfo = this.add.text(-w / 2 + 45, startY + 36, `Floor ${slot.floor} • Level ${slot.playerData.level} • ${slot.difficulty} • Saved: ${dateStr}`, {
                    fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0'
                });

                this.container.add([slotInfo, subInfo]);

                // Overwrite / Save Button (if in SAVE mode)
                if (this.mode === 'SAVE_AND_LOAD' && this.player) {
                    const overwBtn = this.add.rectangle(w / 2 - 195, startY + 34, 80, 36, 0xd97706, 1.0).setInteractive({ useHandCursor: true });
                    overwBtn.setStrokeStyle(1, 0xfacc15);

                    const overwTxt = this.add.text(w / 2 - 195, startY + 34, 'OVERWRITE', {
                        fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#ffffff', fontStyle: 'bold'
                    }).setOrigin(0.5);

                    overwBtn.on('pointerdown', () => {
                        if (this.player) {
                            SaveManager.saveGame(
                                slot.name, this.currentFloor, this.difficulty, this.player,
                                this.grid, this.monsters, this.droppedItems, slot.id
                            );
                            AudioManager.getInstance().playItemPickup();
                            this.renderSaveModal();
                        }
                    });

                    this.container.add([overwBtn, overwTxt]);
                }

                // Load Game Button
                const loadBtn = this.add.rectangle(w / 2 - 105, startY + 34, 75, 36, 0x0284c7, 1.0).setInteractive({ useHandCursor: true });
                loadBtn.setStrokeStyle(2, 0x38bdf8);

                const loadTxt = this.add.text(w / 2 - 105, startY + 34, 'LOAD', {
                    fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                loadBtn.on('pointerdown', () => {
                    this.loadAndResumeGame(slot);
                });

                // Delete Slot Button
                const delBtn = this.add.rectangle(w / 2 - 50, startY + 34, 30, 36, 0x991b1b, 1.0).setInteractive({ useHandCursor: true });
                delBtn.setStrokeStyle(1, 0xef4444);

                const delTxt = this.add.text(w / 2 - 50, startY + 34, '🗑️', {
                    fontFamily: 'sans-serif', fontSize: '12px'
                }).setOrigin(0.5);

                delBtn.on('pointerdown', () => {
                    SaveManager.deleteSaveSlot(slot.id);
                    AudioManager.getInstance().playMove();
                    this.renderSaveModal();
                });

                this.container.add([loadBtn, loadTxt, delBtn, delTxt]);

                startY += 78;
            });
        }

        const closeHint = this.add.text(0, h / 2 - 25, '[Press ESC / Click Outside to Close]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(closeHint);
    }

    private loadAndResumeGame(slot: SaveSlot) {
        AudioManager.getInstance().stopMusic();
        AudioManager.getInstance().playLevelUp();

        // Stop all active overlay and menu scenes
        this.scene.stop('Game');
        this.scene.stop('PauseOverlay');
        this.scene.stop('MainMenu');
        this.scene.stop('SaveOverlay');

        // Launch Game scene with full loaded save slot data
        this.scene.start('Game', {
            difficulty: slot.difficulty,
            floor: slot.floor,
            saveData: slot.playerData,
            levelSaveData: slot.levelData
        });
    }

    private close() {
        this.scale.off('resize', this.handleResize, this);
        if (this.onCloseCallback) this.onCloseCallback();
        this.scene.stop();
    }
}
