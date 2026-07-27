import { Scene } from 'phaser';
import { Difficulty, DIFFICULTY_SETTINGS } from '../config/GameConfig';
import { AudioManager } from '../audio/AudioManager';

export class MainMenu extends Scene {
    private selectedDifficulty: Difficulty = Difficulty.NORMAL;
    private container!: Phaser.GameObjects.Container;
    private guideModal!: Phaser.GameObjects.Container;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x090d16);
        this.container = this.add.container(this.scale.width / 2, this.scale.height / 2);

        this.renderMainMenu();

        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
            if (this.guideModal) this.guideModal.setPosition(gameSize.width / 2, gameSize.height / 2);
        });
    }

    private renderMainMenu() {
        this.container.removeAll(true);
        const audio = AudioManager.getInstance();

        // 1. Header Banner
        const title = this.add.text(0, -250, 'PHASERLAB', {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '52px',
            color: '#38bdf8',
            fontStyle: 'bold',
            stroke: '#0284c7',
            strokeThickness: 8
        }).setOrigin(0.5);

        const subtitle = this.add.text(0, -195, '2D Turn-Based Rogue-like Labyrinth RPG • 30 Procedural Floors', {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '15px',
            color: '#94a3b8',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. Difficulty Selection Card
        const diffCard = this.add.graphics();
        diffCard.fillStyle(0x0f172a, 0.95);
        diffCard.fillRoundedRect(-280, -165, 560, 105, 12);
        diffCard.lineStyle(2, 0x38bdf8, 0.6);
        diffCard.strokeRoundedRect(-280, -165, 560, 105, 12);

        const diffLabel = this.add.text(0, -145, '⚔️ SELECT DIFFICULTY', {
            fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#facc15', fontStyle: 'bold'
        }).setOrigin(0.5);

        const diffContainer = this.add.container(0, -100);
        const difficulties: Difficulty[] = [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD];

        difficulties.forEach((d, idx) => {
            const posX = (idx - 1) * 170;
            const isSelected = this.selectedDifficulty === d;

            const btnBg = this.add.rectangle(posX, 0, 150, 38, isSelected ? 0x0284c7 : 0x1e293b, 1.0);
            btnBg.setStrokeStyle(2, isSelected ? 0x38bdf8 : 0x475569);
            btnBg.setInteractive({ useHandCursor: true });

            const btnTxt = this.add.text(posX, 0, DIFFICULTY_SETTINGS[d].name.toUpperCase(), {
                fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: isSelected ? '#ffffff' : '#94a3b8', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnBg.on('pointerdown', () => {
                this.selectedDifficulty = d;
                audio.playMove();
                this.renderMainMenu();
            });

            diffContainer.add([btnBg, btnTxt]);
        });

        // 3. Audio Volume & Music Tracks Inspector Card
        const audioCard = this.add.graphics();
        audioCard.fillStyle(0x0f172a, 0.95);
        audioCard.fillRoundedRect(-280, -45, 560, 165, 12);
        audioCard.lineStyle(2, 0xa855f7, 0.6);
        audioCard.strokeRoundedRect(-280, -45, 560, 165, 12);

        const audioLabel = this.add.text(0, -25, '🎵 VOLUME CONTROLS & TRACK INSPECTOR', {
            fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#c084fc', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Volume Sliders / Step Controls
        const musicVolPct = Math.round(audio.getMusicVolume() * 100);
        const sfxVolPct = Math.round(audio.getSfxVolume() * 100);

        const volContainer = this.add.container(0, 10);

        // Music Volume controls
        const musicLbl = this.add.text(-240, 0, `Music: ${musicVolPct}%`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#38bdf8', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        const mMinus = this.add.rectangle(-130, 0, 32, 26, 0x1e293b, 1.0).setStrokeStyle(1, 0x38bdf8).setInteractive({ useHandCursor: true });
        const mMinusTxt = this.add.text(-130, 0, '➖', { fontSize: '11px' }).setOrigin(0.5);
        mMinus.on('pointerdown', () => {
            audio.setMusicVolume(audio.getMusicVolume() - 0.1);
            this.renderMainMenu();
        });

        const mPlus = this.add.rectangle(-90, 0, 32, 26, 0x1e293b, 1.0).setStrokeStyle(1, 0x38bdf8).setInteractive({ useHandCursor: true });
        const mPlusTxt = this.add.text(-90, 0, '➕', { fontSize: '11px' }).setOrigin(0.5);
        mPlus.on('pointerdown', () => {
            audio.setMusicVolume(audio.getMusicVolume() + 0.1);
            this.renderMainMenu();
        });

        // SFX Volume controls
        const sfxLbl = this.add.text(40, 0, `SFX: ${sfxVolPct}%`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#facc15', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        const sMinus = this.add.rectangle(150, 0, 32, 26, 0x1e293b, 1.0).setStrokeStyle(1, 0xfacc15).setInteractive({ useHandCursor: true });
        const sMinusTxt = this.add.text(150, 0, '➖', { fontSize: '11px' }).setOrigin(0.5);
        sMinus.on('pointerdown', () => {
            audio.setSfxVolume(audio.getSfxVolume() - 0.1);
            audio.playMove();
            this.renderMainMenu();
        });

        const sPlus = this.add.rectangle(190, 0, 32, 26, 0x1e293b, 1.0).setStrokeStyle(1, 0xfacc15).setInteractive({ useHandCursor: true });
        const sPlusTxt = this.add.text(190, 0, '➕', { fontSize: '11px' }).setOrigin(0.5);
        sPlus.on('pointerdown', () => {
            audio.setSfxVolume(audio.getSfxVolume() + 0.1);
            audio.playMove();
            this.renderMainMenu();
        });

        volContainer.add([musicLbl, mMinus, mMinusTxt, mPlus, mPlusTxt, sfxLbl, sMinus, sMinusTxt, sPlus, sPlusTxt]);

        // Zone Tracks selector
        const musicContainer = this.add.container(0, 48);
        const activeTrack = audio.getCurrentZoneTrack();

        const trackBtns = [
            { name: 'Track 1 (1-9)', zone: 1 },
            { name: 'Track 2 (10-19)', zone: 2 },
            { name: 'Track 3 (20-30)', zone: 3 },
            { name: 'Stop Music', zone: 0 }
        ];

        trackBtns.forEach((t, idx) => {
            const posX = (idx - 1.5) * 130;
            const isPlayingThis = activeTrack === t.zone;

            const btnBg = this.add.rectangle(posX, 0, 120, 28, isPlayingThis ? 0x7c3aed : 0x1e293b, 1.0);
            btnBg.setStrokeStyle(2, isPlayingThis ? 0xc084fc : 0x475569);
            btnBg.setInteractive({ useHandCursor: true });

            const btnTxt = this.add.text(posX, 0, t.name, {
                fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: isPlayingThis ? '#ffffff' : '#38bdf8', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnBg.on('pointerdown', () => {
                if (t.zone === 0) audio.stopMusic();
                else audio.playZoneTrack(t.zone);
                this.renderMainMenu();
            });

            musicContainer.add([btnBg, btnTxt]);
        });

        // SFX Tester buttons
        const sfxContainer = this.add.container(0, 86);
        const sfxList = [
            { name: '🔊 Step SFX', action: () => audio.playMove() },
            { name: '⚔️ Attack SFX', action: () => audio.playAttack() },
            { name: '✨ Magic SFX', action: () => audio.playMagicCast() },
            { name: '🎒 Item SFX', action: () => audio.playItemPickup() }
        ];

        sfxList.forEach((s, idx) => {
            const posX = (idx - 1.5) * 130;
            const btnBg = this.add.rectangle(posX, 0, 120, 26, 0x1e293b, 1.0);
            btnBg.setStrokeStyle(1, 0xfacc15);
            btnBg.setInteractive({ useHandCursor: true });

            const btnTxt = this.add.text(posX, 0, s.name, {
                fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#facc15', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnBg.on('pointerdown', s.action);
            sfxContainer.add([btnBg, btnTxt]);
        });

        // 4. Action Buttons (Guide, Load Game, Enter Labyrinth)
        const guideBtn = this.add.rectangle(-180, 150, 170, 50, 0x6b21a8, 1.0);
        guideBtn.setStrokeStyle(2, 0xc084fc);
        guideBtn.setInteractive({ useHandCursor: true });
        const guideTxt = this.add.text(-180, 150, '📖 GUIDE', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        guideBtn.on('pointerdown', () => {
            audio.playMove();
            this.showGuideModal();
        });

        const loadBtn = this.add.rectangle(0, 150, 170, 50, 0x059669, 1.0);
        loadBtn.setStrokeStyle(2, 0x34d399);
        loadBtn.setInteractive({ useHandCursor: true });
        const loadTxt = this.add.text(0, 150, '💾 SAVED GAMES', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        loadBtn.on('pointerdown', () => {
            audio.playMove();
            this.scene.launch('SaveOverlay', { mode: 'LOAD_ONLY' });
        });

        const startBtn = this.add.rectangle(180, 150, 170, 50, 0x0284c7, 1.0);
        startBtn.setStrokeStyle(2, 0x38bdf8);
        startBtn.setInteractive({ useHandCursor: true });
        const startTxt = this.add.text(180, 150, '⚔️ NEW GAME', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        startBtn.on('pointerdown', () => {
            audio.stopMusic();
            audio.playLevelUp();
            this.scene.start('Game', { difficulty: this.selectedDifficulty });
        });

        this.container.add([
            title, subtitle,
            diffCard, diffLabel, diffContainer,
            audioCard, audioLabel, volContainer, musicContainer, sfxContainer,
            guideBtn, guideTxt, loadBtn, loadTxt, startBtn, startTxt
        ]);
    }

    private showGuideModal() {
        if (this.guideModal) this.guideModal.destroy();

        this.guideModal = this.add.container(this.scale.width / 2, this.scale.height / 2);
        this.guideModal.setDepth(200);

        const w = 680;
        const h = 510;

        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.98);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0x38bdf8, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);

        const title = this.add.text(0, -h / 2 + 30, '📖 PHASERLAB GUIDE, BESTIARY & SAVES', {
            fontFamily: 'system-ui, sans-serif', fontSize: '19px', color: '#38bdf8', fontStyle: 'bold'
        }).setOrigin(0.5);

        const content = this.add.text(-w / 2 + 35, -h / 2 + 75,
            `🕹️ CONTROLS:\n` +
            ` • W, A, S, D / ARROW KEYS: Move / Melee Attack adjacent monsters\n` +
            ` • E KEY: Open Inventory & Equipment (Filter by Type & Rarity!)\n` +
            ` • Q KEY: Open Spellbook (Cast learned magic spells)\n` +
            ` • SPACE KEY: Wait Turn (Restores % Total Max MP & % Total Max HP)\n` +
            ` • S / SAVE BUTTON: Save & Load Manager (Unlimited save slots!)\n\n` +
            `⭐ ITEM & SPELL MASTERY MECHANICS:\n` +
            ` • Duplicate Items: Upgrade Item Mastery Rank manually in inventory (+20% Stats per rank).\n` +
            ` • Duplicate Scrolls: Upgrade Spell Mastery Rank manually (-15% MP cost, +25% Power per rank).\n\n` +
            `💾 UNLIMITED SAVE SLOTS:\n` +
            ` • Save your progress anytime to LocalStorage and load from Main Menu or In-Game!`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#e2e8f0', lineSpacing: 4
            }
        );

        const closeBtn = this.add.rectangle(0, h / 2 - 35, 160, 42, 0xef4444, 1.0).setInteractive({ useHandCursor: true });
        const closeTxt = this.add.text(0, h / 2 - 35, 'CLOSE GUIDE', {
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        closeBtn.on('pointerdown', () => {
            this.guideModal.destroy();
        });

        this.guideModal.add([panel, title, content, closeBtn, closeTxt]);
    }
}
