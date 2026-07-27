import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Game as MainGame } from './scenes/Game';
import { InventoryOverlay } from './scenes/InventoryOverlay';
import { MagicOverlay } from './scenes/MagicOverlay';
import { SaveOverlay } from './scenes/SaveOverlay';
import { PauseOverlay } from './scenes/PauseOverlay';
import { GameOver } from './scenes/GameOver';
import { Victory } from './scenes/Victory';
import { AUTO, Game, Scale } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#0f172a',
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        InventoryOverlay,
        MagicOverlay,
        SaveOverlay,
        PauseOverlay,
        GameOver,
        Victory
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
