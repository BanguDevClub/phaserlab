import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Prepare boot scene
    }

    create() {
        this.scene.start('Preloader');
    }
}
