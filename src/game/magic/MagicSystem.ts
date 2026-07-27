export interface Spell {
    id: string;
    name: string;
    description: string;
    manaCost: number;
    range: number;
    type: 'DAMAGE' | 'HEAL' | 'TELEPORT' | 'BUFF' | 'AOE';
    statusEffect?: 'BURN' | 'POISON' | 'FREEZE';
    power: number;
}

export const SPELL_CATALOG: Record<string, Spell> = {
    FIREBALL: {
        id: 'FIREBALL',
        name: 'Fireball',
        description: 'Launches a searing orb of flame that burns the target over time.',
        manaCost: 20,
        range: 5,
        type: 'DAMAGE',
        statusEffect: 'BURN',
        power: 28
    },
    ICE_SPIKE: {
        id: 'ICE_SPIKE',
        name: 'Ice Spike',
        description: 'Fires a shard of sub-zero ice that freezes the target.',
        manaCost: 22,
        range: 4,
        type: 'DAMAGE',
        statusEffect: 'FREEZE',
        power: 25
    },
    POISON_DART: {
        id: 'POISON_DART',
        name: 'Poison Dart',
        description: 'Shoots a venomous dart that inflicts heavy poison over several turns.',
        manaCost: 15,
        range: 5,
        type: 'DAMAGE',
        statusEffect: 'POISON',
        power: 18
    },
    TELEPORT: {
        id: 'TELEPORT',
        name: 'Flash Teleport',
        description: 'Instantaneously warps the wielder to a safe floor tile in the dungeon.',
        manaCost: 30,
        range: 0,
        type: 'TELEPORT',
        power: 0
    },
    HEAL: {
        id: 'HEAL',
        name: 'Greater Heal',
        description: 'Channels holy light to restore a large portion of health.',
        manaCost: 25,
        range: 0,
        type: 'HEAL',
        power: 45
    },
    ARCANE_NOVA: {
        id: 'ARCANE_NOVA',
        name: 'Arcane Nova',
        description: 'Explodes outward with raw arcane energy, hitting all adjacent enemies.',
        manaCost: 35,
        range: 2,
        type: 'AOE',
        power: 32
    },
    SHIELDING_WARD: {
        id: 'SHIELDING_WARD',
        name: 'Shielding Ward',
        description: 'Erects a protective barrier boosting Defense significantly.',
        manaCost: 20,
        range: 0,
        type: 'BUFF',
        power: 15
    }
};
