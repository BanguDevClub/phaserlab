import { Scene } from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create(data: { floor: number; level: number; killedBy: string; exploredPct?: number }) {
        this.cameras.main.setBackgroundColor(0x090d16);
        AudioManager.getInstance().stopMusic();

        const { width, height } = this.scale;
        const container = this.add.container(width / 2, height / 2);

        const card = this.add.graphics();
        card.fillStyle(0x0f172a, 0.96);
        card.fillRoundedRect(-250, -180, 500, 360, 14);
        card.lineStyle(3, 0xef4444, 1.0);
        card.strokeRoundedRect(-250, -180, 500, 360, 14);

        const title = this.add.text(0, -120, '☠️ GAME OVER', {
            fontFamily: 'system-ui, sans-serif', fontSize: '48px', color: '#ef4444', fontStyle: 'bold', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        const pct = data.exploredPct || 0;
        const details = this.add.text(0, -20, 
            `Hero perished on Floor ${data.floor || 1}\n` +
            `Reached Level ${data.level || 1}\n` +
            `Labyrinth Explored: ${pct}%\n\n` +
            `Slain by: ${data.killedBy || 'Dungeon Monsters'}`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#e2e8f0', align: 'center', lineSpacing: 8
            }
        ).setOrigin(0.5);

        const btn = this.add.rectangle(0, 105, 220, 48, 0x0284c7, 1.0).setInteractive({ useHandCursor: true });
        btn.setStrokeStyle(3, 0x38bdf8);

        const btnTxt = this.add.text(0, 105, 'RETURN TO MAIN MENU', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        container.add([card, title, details, btn, btnTxt]);
    }
}
