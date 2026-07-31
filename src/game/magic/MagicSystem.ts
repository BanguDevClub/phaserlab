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
    DIVINE_SMITE: {
        id: 'DIVINE_SMITE',
        name: 'Divine Smite',
        description: 'Calls down holy wrath upon a single enemy, dealing massive holy damage.',
        manaCost: 35,
        range: 5,
        type: 'DAMAGE',
        power: 48
    },
    THUNDERBOLT: {
        id: 'THUNDERBOLT',
        name: 'Thunderbolt',
        description: 'Strikes a single foe with concentrated lightning from the heavens.',
        manaCost: 30,
        range: 6,
        type: 'DAMAGE',
        power: 42
    },
    ASTRAL_DRAIN: {
        id: 'ASTRAL_DRAIN',
        name: 'Astral Drain',
        description: 'Siphons life and magic from a single target into wielder reserves.',
        manaCost: 25,
        range: 4,
        type: 'DAMAGE',
        power: 30
    },
    TELEPORT: {
        id: 'TELEPORT',
        name: 'Flash Teleport',
        description: 'Instantaneously warps the wielder to a safe floor tile in the dungeon.',
        manaCost: 28,
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
    SHIELDING_WARD: {
        id: 'SHIELDING_WARD',
        name: 'Shielding Ward',
        description: 'Erects a protective barrier boosting Defense significantly.',
        manaCost: 20,
        range: 0,
        type: 'BUFF',
        power: 18
    },
    PHOENIX_FLAME: {
        id: 'PHOENIX_FLAME',
        name: 'Phoenix Flame',
        description: 'Envelops the wielder in sacred flames, healing HP and heavily buffing DEF.',
        manaCost: 45,
        range: 0,
        type: 'HEAL',
        power: 65
    },
    ARCANE_NOVA: {
        id: 'ARCANE_NOVA',
        name: 'Arcane Nova',
        description: 'Explodes outward with raw arcane energy, hitting all adjacent enemies.',
        manaCost: 35,
        range: 2,
        type: 'AOE',
        power: 35
    },
    RAGNAROK_STRIKE: {
        id: 'RAGNAROK_STRIKE',
        name: 'Ragnarok Strike',
        description: 'Unleashes a apocalyptic blast burning all enemies in a wide radius.',
        manaCost: 55,
        range: 3,
        type: 'AOE',
        statusEffect: 'BURN',
        power: 60
    },
    HOLY_LIGHT: {
        id: 'HOLY_LIGHT',
        name: 'Holy Light Nova',
        description: 'Emits a blinding pulse of sacred energy, damaging surrounding enemies while healing.',
        manaCost: 40,
        range: 2,
        type: 'AOE',
        power: 38
    },
    MIASMA_CLOUD: {
        id: 'MIASMA_CLOUD',
        name: 'Miasma Cloud',
        description: 'Summons a toxic cloud that poisons all foes caught within its range.',
        manaCost: 38,
        range: 3,
        type: 'AOE',
        statusEffect: 'POISON',
        power: 32
    },
    TIME_DISTORTION: {
        id: 'TIME_DISTORTION',
        name: 'Time Distortion',
        description: 'Distorts temporal flow around nearby enemies, dealing damage and freezing them.',
        manaCost: 50,
        range: 2,
        type: 'AOE',
        statusEffect: 'FREEZE',
        power: 40
    }
};
