export class AudioManager {
    private static instance: AudioManager;
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private musicVolume: number = 0.8;
    private sfxVolume: number = 0.8;

    private currentZoneTrack: number = 0;
    private isPlayingMusic: boolean = false;
    private musicTimer: number | null = null;

    private constructor() {
        // AudioContext lazy init on user gesture
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        } else if (this.currentZoneTrack > 0) {
            this.playZoneTrack(this.currentZoneTrack);
        }
        return this.isMuted;
    }

    public getMuted(): boolean {
        return this.isMuted;
    }

    public getMusicVolume(): number {
        return this.musicVolume;
    }

    public getSfxVolume(): number {
        return this.sfxVolume;
    }

    public setMusicVolume(val: number) {
        this.musicVolume = Math.max(0, Math.min(1, val));
    }

    public setSfxVolume(val: number) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
    }

    public playTone(freq: number, type: OscillatorType, duration: number, startVol: number, endVol: number = 0.001) {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const vol = startVol * this.sfxVolume;
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol * this.sfxVolume), this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch {
            // Audio context safely ignored if blocked by browser autoplay policy
        }
    }

    public playMusicTone(freq: number, type: OscillatorType, duration: number, startVol: number, endVol: number = 0.001) {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const vol = startVol * this.musicVolume * 2.5;
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol * this.musicVolume), this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch {
            // Audio context safely ignored if blocked by browser autoplay policy
        }
    }

    public playNoise(duration: number, startVol: number) {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            const vol = startVol * this.sfxVolume;
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch {
            // Ignore autoplay restriction errors
        }
    }

    // SFX Methods
    public playMove() {
        this.playTone(180 + Math.random() * 40, 'triangle', 0.05, 0.1, 0.01);
    }

    public playAttack() {
        this.playTone(400, 'sawtooth', 0.1, 0.3, 0.01);
        this.playNoise(0.08, 0.2);
    }

    public playHit() {
        this.playTone(120, 'square', 0.15, 0.4, 0.01);
        this.playNoise(0.12, 0.3);
    }

    public playMagicCast() {
        this.initContext();
        if (!this.ctx || this.isMuted) return;
        [300, 450, 600, 900].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.12, 0.2, 0.01);
            }, idx * 60);
        });
    }

    public playHeal() {
        [400, 520, 650, 800].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.15, 0.25, 0.01);
            }, idx * 70);
        });
    }

    public playTeleport() {
        this.playTone(900, 'sine', 0.2, 0.3, 0.01);
        setTimeout(() => this.playTone(300, 'sawtooth', 0.2, 0.3, 0.01), 80);
    }

    public playStatusTick() {
        this.playTone(220, 'square', 0.08, 0.15, 0.01);
    }

    public playItemPickup() {
        [523, 659, 783, 1046].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.1, 0.3, 0.01);
            }, idx * 50);
        });
    }

    public playLevelUp() {
        const notes = [440, 554, 659, 880, 1108];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.2, 0.4, 0.01);
            }, idx * 90);
        });
    }

    public playStairs() {
        [600, 500, 400, 300].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.12, 0.2, 0.01);
            }, idx * 60);
        });
    }

    // Procedural Music Loops for the 3 Zones
    public playZoneTrack(zone: number) {
        this.stopMusic();
        this.currentZoneTrack = zone;
        this.isPlayingMusic = true;

        const zoneFreqs: Record<number, number[]> = {
            1: [110, 130, 146, 164, 196, 220], // Ancient Dungeon Minor scale
            2: [146, 174, 220, 261, 293, 349], // Crystal Caverns Mysterious scale
            3: [87, 98, 116, 130, 155, 174]   // Infernal Depths Heavy Low scale
        };

        const freqs = zoneFreqs[zone] || zoneFreqs[1];
        let step = 0;

        const tick = () => {
            if (!this.isPlayingMusic || this.isMuted) return;
            const note = freqs[step % freqs.length];
            const waveType: OscillatorType = zone === 1 ? 'sine' : zone === 2 ? 'triangle' : 'sawtooth';
            
            // Play ambient bass note using music volume
            this.playMusicTone(note * 0.5, waveType, 0.45, 0.25, 0.01);

            // High arp every few beats
            if (step % 2 === 0) {
                const highNote = freqs[(step * 3) % freqs.length] * (zone === 2 ? 2 : 1.5);
                this.playMusicTone(highNote, 'sine', 0.25, 0.15, 0.005);
            }

            step++;
            this.musicTimer = window.setTimeout(tick, 450);
        };

        tick();
    }

    public stopMusic() {
        this.isPlayingMusic = false;
        if (this.musicTimer !== null) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
    }

    public getCurrentZoneTrack(): number {
        return this.currentZoneTrack;
    }
}
