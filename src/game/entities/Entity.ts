export interface StatusEffectState {
    type: 'BURN' | 'POISON' | 'FREEZE' | 'STUN' | 'FAR_SIGHT';
    duration: number; // turns remaining
    power: number;
}

export abstract class Entity {
    public id: string;
    public name: string;
    public x: number; // tile x
    public y: number; // tile y

    // Core 4 Stats
    public maxHp: number;
    public currentHp: number;
    public maxMp: number;
    public currentMp: number;
    public atk: number;
    public def: number;

    public activeStatusEffects: StatusEffectState[] = [];

    constructor(
        id: string,
        name: string,
        x: number,
        y: number,
        hp: number,
        mp: number,
        atk: number,
        def: number
    ) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.maxHp = hp;
        this.currentHp = hp;
        this.maxMp = mp;
        this.currentMp = mp;
        this.atk = atk;
        this.def = def;
    }

    public isAlive(): boolean {
        return this.currentHp > 0;
    }

    public getMaxHpForCap(): number {
        return this.maxHp;
    }

    public getMaxMpForCap(): number {
        return this.maxMp;
    }

    public takeDamage(amount: number): number {
        const actualDamage = Math.max(1, Math.round(amount));
        this.currentHp = Math.max(0, this.currentHp - actualDamage);
        return actualDamage;
    }

    public heal(amount: number): number {
        const maxCap = this.getMaxHpForCap();
        const actualHeal = Math.min(maxCap - this.currentHp, Math.round(amount));
        this.currentHp = Math.min(maxCap, this.currentHp + Math.max(0, actualHeal));
        return actualHeal;
    }

    public restoreMp(amount: number): number {
        const maxCap = this.getMaxMpForCap();
        const actualMp = Math.min(maxCap - this.currentMp, Math.round(amount));
        this.currentMp = Math.min(maxCap, this.currentMp + Math.max(0, actualMp));
        return actualMp;
    }

    public addStatusEffect(type: 'BURN' | 'POISON' | 'FREEZE' | 'STUN' | 'FAR_SIGHT', duration: number, power: number) {
        const existing = this.activeStatusEffects.find(s => s.type === type);
        if (existing) {
            existing.duration = Math.max(existing.duration, duration);
            existing.power = Math.max(existing.power, power);
        } else {
            this.activeStatusEffects.push({ type, duration, power });
        }
    }

    public isStunnedOrFrozen(): boolean {
        return this.activeStatusEffects.some(s => s.type === 'FREEZE' || s.type === 'STUN');
    }
}
