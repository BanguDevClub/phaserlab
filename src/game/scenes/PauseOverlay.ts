import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Difficulty } from '../config/GameConfig';
import { AudioManager } from '../audio/AudioManager';
import { DungeonGrid } from '../dungeon/DungeonGenerator';
import { Monster } from '../entities/Monster';
import { ItemData } from '../items/ItemSystem';

export class PauseOverlay extends Phaser.Scene {
    private player?: Player;
    private floor: number = 1;
    private difficulty: Difficulty = Difficulty.NORMAL;
    private grid?: DungeonGrid;
    private monsters?: Monster[];
    private droppedItems?: { item: ItemData; x: number; y: number }[];
    private onCloseCallback?: () => void;
    private container!: Phaser.GameObjects.Container;

    constructor() {
        super('PauseOverlay');
    }

    public init(data: {
        player?: Player;
        floor?: number;
        difficulty?: Difficulty;
        grid?: DungeonGrid;
        monsters?: Monster[];
        droppedItems?: { item: ItemData; x: number; y: number }[];
        onClose?: () => void;
    }) {
        this.player = data.player;
        this.floor = data.floor || 1;
        this.difficulty = data.difficulty || Difficulty.NORMAL;
        this.grid = data.grid;
        this.monsters = data.monsters;
        this.droppedItems = data.droppedItems;
        this.onCloseCallback = data.onClose;
    }

    public create() {
        const { width, height } = this.scale;

        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.82).setOrigin(0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.resume());

        this.container = this.add.container(width / 2, height / 2);
        this.renderPauseModal();

        this.input.keyboard?.on('keydown-ENTER', () => this.resume());
        this.input.keyboard?.on('keydown-ESC', () => this.resume());

        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
        });
    }

    private renderPauseModal() {
        this.container.removeAll(true);

        const w = 520;
        const h = 360;

        // Modal Frame Card
        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.98);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0x38bdf8, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
        this.container.add(panel);

        const title = this.add.text(0, -h / 2 + 40, '⏸️ GAME PAUSED', {
            fontFamily: 'system-ui, sans-serif', fontSize: '32px', color: '#38bdf8', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        const lvlStr = this.player ? `Hero Level ${this.player.level}` : 'Hero';
        const subtext = this.add.text(0, -h / 2 + 85, `Floor ${this.floor} / 30 • ${this.difficulty} Difficulty • ${lvlStr}`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.container.add([title, subtext]);

        // Action Buttons
        const buttons = [
            {
                label: '▶ RESUME GAME [ENTER]',
                color: 0x059669,
                stroke: 0x34d399,
                action: () => this.resume()
            },
            {
                label: '💾 SAVE & LOAD GAME',
                color: 0xd97706,
                stroke: 0xfacc15,
                action: () => {
                    // Stop PauseOverlay scene so SaveOverlay opens directly over Game
                    this.scene.stop('PauseOverlay');
                    this.scene.launch('SaveOverlay', {
                        mode: 'SAVE_AND_LOAD',
                        player: this.player,
                        floor: this.floor,
                        difficulty: this.difficulty,
                        grid: this.grid,
                        monsters: this.monsters,
                        droppedItems: this.droppedItems,
                        onClose: () => {
                            this.scene.resume('Game');
                        }
                    });
                }
            },
            {
                label: '🏠 RETURN TO MAIN MENU',
                color: 0x991b1b,
                stroke: 0xef4444,
                action: () => {
                    AudioManager.getInstance().stopMusic();
                    this.scene.stop('Game');
                    this.scene.stop('PauseOverlay');
                    this.scene.start('MainMenu');
                }
            }
        ];

        let startY = -h / 2 + 145;
        buttons.forEach(btn => {
            const btnBg = this.add.rectangle(0, startY, 320, 46, btn.color, 1.0).setInteractive({ useHandCursor: true });
            btnBg.setStrokeStyle(2, btn.stroke);

            const btnTxt = this.add.text(0, startY, btn.label, {
                fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnBg.on('pointerdown', () => {
                AudioManager.getInstance().playMove();
                btn.action();
            });

            this.container.add([btnBg, btnTxt]);
            startY += 62;
        });

        const closeHint = this.add.text(0, h / 2 - 25, '[Press ENTER / ESC to Resume Game]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#64748b', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(closeHint);
    }

    private resume() {
        this.scale.off('resize', undefined, this);
        if (this.onCloseCallback) this.onCloseCallback();
        this.scene.stop();
        this.scene.resume('Game');
    }
}
