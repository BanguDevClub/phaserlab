export enum Difficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD'
}

export interface Palette {
    name: string;
    background: number;
    wall: number;
    wallBorder: number;
    floor: number;
    floorGrid: number;
    fog: number;
    accent: number;
    stair: number;
}

export const ZONE_PALETTES: Record<number, Palette> = {
    1: { // Floors 1-9 (Ancient Stone Dungeon)
        name: 'Ancient Stone Dungeon',
        background: 0x0f111a,
        wall: 0x2a2f45,
        wallBorder: 0x4a5578,
        floor: 0x161a26,
        floorGrid: 0x1d2334,
        fog: 0x08090d,
        accent: 0x38bdf8,
        stair: 0xf59e0b
    },
    2: { // Floors 10-19 (Crystal Caverns)
        name: 'Crystal Caverns',
        background: 0x120a2a,
        wall: 0x3b1f5c,
        wallBorder: 0x6d36a5,
        floor: 0x1d1238,
        floorGrid: 0x2a1a50,
        fog: 0x0a0518,
        accent: 0xa855f7,
        stair: 0x10b981
    },
    3: { // Floors 20-30 (Abyssal Infernal Depths)
        name: 'Infernal Abyssal Depths',
        background: 0x1a0505,
        wall: 0x4a1212,
        wallBorder: 0x8a2323,
        floor: 0x280b0b,
        floorGrid: 0x381212,
        fog: 0x0d0202,
        accent: 0xef4444,
        stair: 0x3b82f6
    }
};

export const DIFFICULTY_SETTINGS = {
    [Difficulty.EASY]: {
        name: 'Easy',
        monsterStatMult: 1.0,
        playerStatMult: 1.15,
        dropChanceMult: 0.8,
        expMult: 1.1
    },
    [Difficulty.NORMAL]: {
        name: 'Normal',
        monsterStatMult: 1.45,
        playerStatMult: 0.95,
        dropChanceMult: 0.5,
        expMult: 1.0
    },
    [Difficulty.HARD]: {
        name: 'Hard',
        monsterStatMult: 2.1,
        playerStatMult: 0.80,
        dropChanceMult: 0.35,
        expMult: 0.85
    }
};

export function getZoneForFloor(floor: number): number {
    if (floor <= 9) return 1;
    if (floor <= 19) return 2;
    return 3;
}

export function getFloorDimensions(floor: number): { width: number; height: number } {
    if (floor <= 9) return { width: 50, height: 50 };
    if (floor <= 19) return { width: 100, height: 100 };
    return { width: 200, height: 200 };
}

export const TILE_SIZE = 32;
