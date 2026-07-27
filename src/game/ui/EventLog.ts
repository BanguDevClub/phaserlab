import * as Phaser from 'phaser';

export class EventLog {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Graphics;
    private logTexts: Phaser.GameObjects.Text[] = [];
    private messages: string[] = [];

    private width: number = 440;
    private height: number = 160;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.container = scene.add.container(x, y);
        this.container.setScrollFactor(0);
        this.container.setDepth(140);

        this.background = scene.add.graphics();
        this.container.add(this.background);

        this.drawBackground();
        this.addMessage("★ Welcome to PhaserLab! Defeat monsters, collect legendary relics, and reach Floor 30!");
    }

    public resize(x: number, y: number, width: number = 440) {
        this.width = width;
        this.container.setPosition(x, y);
        this.drawBackground();
        this.updateTextDisplay();
    }

    private drawBackground() {
        this.background.clear();
        // Glassmorphism dark slate card
        this.background.fillStyle(0x090d16, 0.92);
        this.background.fillRoundedRect(0, 0, this.width, this.height, 10);
        this.background.lineStyle(2, 0x38bdf8, 0.7);
        this.background.strokeRoundedRect(0, 0, this.width, this.height, 10);

        // Header Title Ribbon
        this.background.fillStyle(0x1e293b, 0.9);
        this.background.fillRoundedRect(8, 6, 150, 22, 4);
    }

    public addMessage(msg: string) {
        this.messages.push(msg);
        if (this.messages.length > 60) {
            this.messages.shift();
        }
        this.updateTextDisplay();
    }

    private updateTextDisplay() {
        this.logTexts.forEach(t => t.destroy());
        this.logTexts = [];

        // Title Header
        const header = this.scene.add.text(14, 9, '📜 GAME & LOG', {
            fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#38bdf8', fontStyle: 'bold'
        });
        this.container.add(header);
        this.logTexts.push(header);

        // Render messages from newest to oldest, filling upward from bottom Y (this.height - 10)
        let bottomY = this.height - 10;
        const revMessages = this.messages.slice(-12).reverse();

        for (let i = 0; i < revMessages.length; i++) {
            const msg = revMessages[i];
            let color = '#cbd5e1';
            let fontStyle = 'normal';

            if (msg.includes('LEVEL UP') || msg.includes('★')) {
                color = '#facc15';
                fontStyle = 'bold';
            } else if (msg.includes('slain') || msg.includes('attacks') || msg.includes('perished')) {
                color = '#f87171';
            } else if (msg.includes('Dropped') || msg.includes('Picked up') || msg.includes('item') || msg.includes('MASTERY')) {
                color = '#c084fc';
                fontStyle = 'bold';
            } else if (msg.includes('cast') || msg.includes('MP') || msg.includes('warped')) {
                color = '#38bdf8';
            } else if (msg.includes('Descended') || msg.includes('Entered') || msg.includes('Floor')) {
                color = '#4ade80';
                fontStyle = 'bold';
            }

            const textObj = this.scene.add.text(14, 0, msg, {
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: color,
                fontStyle: fontStyle,
                wordWrap: { width: this.width - 28 }
            });

            const textHeight = textObj.height;
            const targetY = bottomY - textHeight;

            // Stop rendering if adding this text line would overlap the header title ribbon (Y < 32)
            if (targetY < 32) {
                textObj.destroy();
                break;
            }

            textObj.setY(targetY);
            // Alpha fade out for older messages
            textObj.setAlpha(Math.max(0.4, 1.0 - (i * 0.12)));

            this.container.add(textObj);
            this.logTexts.push(textObj);

            bottomY = targetY - 4;
        }
    }

    public setVisible(visible: boolean) {
        this.container.setVisible(visible);
    }
}
