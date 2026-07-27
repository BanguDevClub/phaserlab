import * as Phaser from 'phaser';

export type MonsterShapeType = 
    | 'TRIANGLE'
    | 'SQUARE'
    | 'PENTAGON'
    | 'HEXAGON'
    | 'OCTAGON'
    | 'STAR'
    | 'DIAMOND'
    | 'SPIKE';

export interface RenderShapeConfig {
    shape: MonsterShapeType;
    fillColor: number;
    borderColor: number;
    borderWidth?: number;
    scale?: number;
}

export class ShapeRenderer {

    // Render Player: Geometrical Cyan Diamond/Shield with Fill & Border
    public static renderPlayer(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 24) {
        graphics.clear();
        const radius = size / 2;

        // Outer glow border
        graphics.lineStyle(4, 0x38bdf8, 0.4);
        graphics.beginPath();
        graphics.moveTo(x, y - radius - 3);
        graphics.lineTo(x + radius + 3, y);
        graphics.lineTo(x, y + radius + 3);
        graphics.lineTo(x - radius - 3, y);
        graphics.closePath();
        graphics.strokePath();

        // Fill & primary border
        graphics.fillStyle(0x0284c7, 1.0);
        graphics.lineStyle(3, 0xf0f9ff, 1.0);

        graphics.beginPath();
        graphics.moveTo(x, y - radius);
        graphics.lineTo(x + radius, y);
        graphics.lineTo(x, y + radius);
        graphics.lineTo(x - radius, y);
        graphics.closePath();

        graphics.fillPath();
        graphics.strokePath();

        // Core emblem highlight
        graphics.fillStyle(0x38bdf8, 1.0);
        graphics.fillCircle(x, y, radius * 0.35);
    }

    // Render Monster: Geometrical form with fill and border colors (Do NOT call clear() so all monsters draw together!)
    public static renderMonster(
        graphics: Phaser.GameObjects.Graphics, 
        x: number, 
        y: number, 
        config: RenderShapeConfig, 
        size: number = 24
    ) {
        const r = (size / 2) * (config.scale || 1.0);
        const borderWidth = config.borderWidth || 2;

        graphics.fillStyle(config.fillColor, 1.0);
        graphics.lineStyle(borderWidth, config.borderColor, 1.0);

        switch (config.shape) {
            case 'TRIANGLE':
                this.drawPolygon(graphics, x, y, r, 3);
                break;
            case 'SQUARE':
                this.drawPolygon(graphics, x, y, r, 4, Math.PI / 4);
                break;
            case 'PENTAGON':
                this.drawPolygon(graphics, x, y, r, 5, -Math.PI / 2);
                break;
            case 'HEXAGON':
                this.drawPolygon(graphics, x, y, r, 6, 0);
                break;
            case 'OCTAGON':
                this.drawPolygon(graphics, x, y, r, 8, Math.PI / 8);
                break;
            case 'DIAMOND':
                this.drawPolygon(graphics, x, y, r, 4, 0);
                break;
            case 'STAR':
                this.drawStar(graphics, x, y, r * 0.5, r, 5);
                break;
            case 'SPIKE':
                this.drawStar(graphics, x, y, r * 0.4, r * 1.1, 6);
                break;
        }
    }

    // Render Item: Geometrical representation (Do NOT call clear() so all items draw together!)
    public static renderItemIcon(
        graphics: Phaser.GameObjects.Graphics,
        x: number,
        y: number,
        type: string,
        rarityColor: number,
        size: number = 18
    ) {
        const r = size / 2;

        // Background rarity aura/glow
        graphics.fillStyle(rarityColor, 0.25);
        graphics.fillCircle(x, y, r + 2);

        graphics.fillStyle(rarityColor, 1.0);
        graphics.lineStyle(2, 0xffffff, 1.0);

        if (type === 'SWORD') {
            // Diamond Blade
            graphics.beginPath();
            graphics.moveTo(x, y - r);
            graphics.lineTo(x + r * 0.4, y);
            graphics.lineTo(x, y + r);
            graphics.lineTo(x - r * 0.4, y);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else if (type === 'LANCE') {
            // Elongated triangle
            graphics.beginPath();
            graphics.moveTo(x, y - r * 1.1);
            graphics.lineTo(x + r * 0.5, y + r);
            graphics.lineTo(x - r * 0.5, y + r);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else if (type === 'AXE') {
            // Crescent axe head shape
            graphics.beginPath();
            graphics.arc(x, y, r, -Math.PI / 3, Math.PI / 3, false);
            graphics.lineTo(x - r * 0.2, y);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else if (type === 'HELMET') {
            // Dome shape
            graphics.beginPath();
            graphics.arc(x, y + r * 0.2, r * 0.8, Math.PI, 0, false);
            graphics.lineTo(x + r * 0.8, y + r * 0.6);
            graphics.lineTo(x - r * 0.8, y + r * 0.6);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else if (type === 'ARMOR') {
            // Shield rectangle
            graphics.fillRect(x - r * 0.7, y - r * 0.7, r * 1.4, r * 1.4);
            graphics.strokeRect(x - r * 0.7, y - r * 0.7, r * 1.4, r * 1.4);
        } else if (type === 'RING') {
            // Ring concentric circles
            graphics.fillCircle(x, y, r * 0.75);
            graphics.strokeCircle(x, y, r * 0.75);
            graphics.fillStyle(0x000000, 1.0);
            graphics.fillCircle(x, y, r * 0.35);
        } else if (type === 'SCROLL') {
            // Scroll rectangle with paper curl lines
            graphics.fillRect(x - r * 0.5, y - r * 0.8, r * 1.0, r * 1.6);
            graphics.strokeRect(x - r * 0.5, y - r * 0.8, r * 1.0, r * 1.6);
        } else {
            // Generic Gem / Chest item
            graphics.fillCircle(x, y, r * 0.8);
            graphics.strokeCircle(x, y, r * 0.8);
        }
    }

    // Helper: Regular polygon drawing
    private static drawPolygon(
        graphics: Phaser.GameObjects.Graphics,
        cx: number,
        cy: number,
        radius: number,
        sides: number,
        startAngle: number = -Math.PI / 2
    ) {
        graphics.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = startAngle + (i * 2 * Math.PI) / sides;
            const px = cx + radius * Math.cos(angle);
            const py = cy + radius * Math.sin(angle);
            if (i === 0) graphics.moveTo(px, py);
            else graphics.lineTo(px, py);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }

    // Helper: Star shape drawing
    private static drawStar(
        graphics: Phaser.GameObjects.Graphics,
        cx: number,
        cy: number,
        innerRadius: number,
        outerRadius: number,
        points: number
    ) {
        graphics.beginPath();
        const step = Math.PI / points;
        let angle = -Math.PI / 2;

        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) graphics.moveTo(px, py);
            else graphics.lineTo(px, py);
            angle += step;
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }
}
