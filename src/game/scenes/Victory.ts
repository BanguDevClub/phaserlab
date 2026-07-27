import { Scene } from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export class Victory extends Scene {
    constructor() {
        super('Victory');
    }

    create(data: { level: number; exploredPct?: number }) {
        this.cameras.main.setBackgroundColor(0x090d16);
        AudioManager.getInstance().playLevelUp();

        const { width, height } = this.scale;
        const container = this.add.container(width / 2, height / 2);

        const card = this.add.graphics();
        card.fillStyle(0x0f172a, 0.96);
        card.fillRoundedRect(-260, -190, 520, 380, 14);
        card.lineStyle(3, 0xfacc15, 1.0);
        card.strokeRoundedRect(-260, -190, 520, 380, 14);

        const title = this.add.text(0, -130, '🏆 VICTORY!', {
            fontFamily: 'system-ui, sans-serif', fontSize: '50px', color: '#facc15', fontStyle: 'bold', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        const pct = data.exploredPct || 0;
        const details = this.add.text(0, -25, 
            `CONGRATULATIONS HERO!\n\nYou conquered all 30 floors of PhaserLab!\n` +
            `Hero Final Level: ${data.level || 1}\n` +
            `Final Floor Explored: ${pct}%`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#86efac', align: 'center', lineSpacing: 8
            }
        ).setOrigin(0.5);

        const btn = this.add.rectangle(0, 105, 240, 50, 0x059669, 1.0).setInteractive({ useHandCursor: true });
        btn.setStrokeStyle(3, 0x34d399);

        const btnTxt = this.add.text(0, 105, 'PLAY AGAIN', {
            fontFamily: 'system-ui, sans-serif', fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        container.add([card, title, details, btn, btnTxt]);
    }
}
