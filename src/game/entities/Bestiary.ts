import { MonsterShapeType } from '../graphics/ShapeRenderer';

export type MonsterRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface MonsterTemplate {
    id: string;
    name: string;
    historicName?: string;
    rarity: MonsterRarity;
    minLevel: number;
    maxLevel: number;
    baseHp: number;
    baseMp: number;
    baseAtk: number;
    baseDef: number;
    expReward: number;
    description: string;
    shape: MonsterShapeType;
    fillColor: number;
    borderColor: number;
    hasMagic: boolean;
    magicType?: 'BURN' | 'POISON' | 'TELEPORT_SELF' | 'TELEPORT_PLAYER' | 'FREEZE' | 'STUN' | 'DRAIN_MP';
    spellName?: string;
}

export class Bestiary {

    public static readonly MONSTERS: MonsterTemplate[] = [
        // ==========================================
        // 1. COMMON MONSTERS (Min: 50 HP, 10 ATK, 10 DEF)
        // ==========================================
        {
            id: 'goblin_scout', name: 'Goblin Scout', rarity: 'COMMON', minLevel: 1, maxLevel: 5,
            baseHp: 50, baseMp: 0, baseAtk: 10, baseDef: 10, expReward: 18,
            description: 'Nasty subterranean creature scavenging for shiny trinkets in upper dungeon floors.',
            shape: 'TRIANGLE', fillColor: 0x16a34a, borderColor: 0x4ade80, hasMagic: false
        },
        {
            id: 'cave_rat', name: 'Giant Cave Rat', rarity: 'COMMON', minLevel: 1, maxLevel: 4,
            baseHp: 50, baseMp: 0, baseAtk: 10, baseDef: 10, expReward: 15,
            description: 'Diseased rodent mutated by dark lab mana. Aggressive in dark corridors.',
            shape: 'TRIANGLE', fillColor: 0x78716c, borderColor: 0xa8a29e, hasMagic: false
        },
        {
            id: 'kobold_skirmisher', name: 'Kobold Skirmisher', rarity: 'COMMON', minLevel: 1, maxLevel: 5,
            baseHp: 55, baseMp: 0, baseAtk: 12, baseDef: 11, expReward: 20,
            description: 'Reptilian humanoid adept at setting primitive traps in dungeon hallways.',
            shape: 'DIAMOND', fillColor: 0xd97706, borderColor: 0xfcd34d, hasMagic: false
        },
        {
            id: 'acid_slime', name: 'Acidic Slime', rarity: 'COMMON', minLevel: 2, maxLevel: 6,
            baseHp: 65, baseMp: 0, baseAtk: 11, baseDef: 14, expReward: 25,
            description: 'Amorphous blob of corrosive slime that dissolves organic armor on contact.',
            shape: 'SQUARE', fillColor: 0x84cc16, borderColor: 0xbef264, hasMagic: false
        },
        {
            id: 'imp_brat', name: 'Minor Imp', rarity: 'COMMON', minLevel: 2, maxLevel: 5,
            baseHp: 55, baseMp: 15, baseAtk: 13, baseDef: 10, expReward: 24,
            description: 'Small mischievous demon with glowing red eyes and razor-sharp claws.',
            shape: 'STAR', fillColor: 0xd97706, borderColor: 0xf87171, hasMagic: false
        },
        {
            id: 'skeleton_warrior', name: 'Skeleton Warrior', rarity: 'COMMON', minLevel: 3, maxLevel: 7,
            baseHp: 70, baseMp: 0, baseAtk: 14, baseDef: 13, expReward: 30,
            description: 'Animated bones of a fallen knight wielding a rusty broadsword.',
            shape: 'PENTAGON', fillColor: 0xe2e8f0, borderColor: 0x94a3b8, hasMagic: false
        },
        {
            id: 'giant_spider', name: 'Brood Spider', rarity: 'COMMON', minLevel: 3, maxLevel: 7,
            baseHp: 60, baseMp: 0, baseAtk: 15, baseDef: 11, expReward: 28,
            description: 'Eight-legged hunter waiting silently in web-covered alcoves.',
            shape: 'SPIKE', fillColor: 0x334155, borderColor: 0x64748b, hasMagic: false
        },
        {
            id: 'wild_direwolf', name: 'Dire Wolf', rarity: 'COMMON', minLevel: 4, maxLevel: 8,
            baseHp: 75, baseMp: 0, baseAtk: 16, baseDef: 12, expReward: 35,
            description: 'Massive feral wolf with razor-sharp fangs and thick grey fur.',
            shape: 'TRIANGLE', fillColor: 0x475569, borderColor: 0x94a3b8, hasMagic: false
        },
        {
            id: 'bat_swarm', name: 'Vampire Bat Swarm', rarity: 'COMMON', minLevel: 4, maxLevel: 8,
            baseHp: 58, baseMp: 0, baseAtk: 13, baseDef: 10, expReward: 32,
            description: 'A cloud of hungry bats fluttering rapidly in dark caverns.',
            shape: 'STAR', fillColor: 0x6b21a8, borderColor: 0xa855f7, hasMagic: false
        },
        {
            id: 'orc_grunt', name: 'Orc Warrior', rarity: 'COMMON', minLevel: 5, maxLevel: 9,
            baseHp: 85, baseMp: 0, baseAtk: 18, baseDef: 15, expReward: 45,
            description: 'Brutish warrior with heavy iron mail and a jagged cleaver.',
            shape: 'HEXAGON', fillColor: 0x15803d, borderColor: 0x86efac, hasMagic: false
        },

        // ==========================================
        // 2. UNCOMMON MONSTERS (Min: 100 HP, 15 ATK, 15 DEF)
        // ==========================================
        {
            id: 'orc_shaman', name: 'Orc Shaman', rarity: 'UNCOMMON', minLevel: 5, maxLevel: 10,
            baseHp: 100, baseMp: 50, baseAtk: 17, baseDef: 15, expReward: 60,
            description: 'Tribe elder channeling ancestral embers into burning flames.',
            shape: 'OCTAGON', fillColor: 0xb45309, borderColor: 0xfde047,
            hasMagic: true, magicType: 'BURN', spellName: 'Flame Burst'
        },
        {
            id: 'harpy_screamer', name: 'Harpy Screamer', rarity: 'UNCOMMON', minLevel: 6, maxLevel: 11,
            baseHp: 105, baseMp: 40, baseAtk: 18, baseDef: 15, expReward: 58,
            description: 'Winged terror whose piercing screech causes temporary disorientation.',
            shape: 'STAR', fillColor: 0x0284c7, borderColor: 0x7dd3fc,
            hasMagic: true, magicType: 'STUN', spellName: 'Screech'
        },
        {
            id: 'gargoyle_sentinel', name: 'Stone Gargoyle', rarity: 'UNCOMMON', minLevel: 7, maxLevel: 12,
            baseHp: 150, baseMp: 20, baseAtk: 20, baseDef: 22, expReward: 75,
            description: 'Ancient stone statue animated by dark runes. Highly durable armor.',
            shape: 'HEXAGON', fillColor: 0x475569, borderColor: 0xc084fc, hasMagic: false
        },
        {
            id: 'basilisk_drake', name: 'Basilisk Drake', rarity: 'UNCOMMON', minLevel: 7, maxLevel: 12,
            baseHp: 120, baseMp: 45, baseAtk: 20, baseDef: 16, expReward: 78,
            description: 'Serpentine reptilian beast that breathes deadly venomous fog.',
            shape: 'SPIKE', fillColor: 0x047857, borderColor: 0x34d399,
            hasMagic: true, magicType: 'POISON', spellName: 'Venom Breath'
        },
        {
            id: 'lich_initiate', name: 'Lich Initiate', rarity: 'UNCOMMON', minLevel: 8, maxLevel: 13,
            baseHp: 110, baseMp: 65, baseAtk: 18, baseDef: 15, expReward: 80,
            description: 'Aspiring necromancer practicing frost curses on dungeon intruders.',
            shape: 'OCTAGON', fillColor: 0x312e81, borderColor: 0x818cf8,
            hasMagic: true, magicType: 'FREEZE', spellName: 'Frost Ray'
        },
        {
            id: 'spellblade_wraith', name: 'Spellblade Wraith', rarity: 'UNCOMMON', minLevel: 8, maxLevel: 14,
            baseHp: 115, baseMp: 55, baseAtk: 22, baseDef: 16, expReward: 85,
            description: 'Spectral knight combining sword mastership with blink magic.',
            shape: 'DIAMOND', fillColor: 0x6b21a8, borderColor: 0xe9d5ff,
            hasMagic: true, magicType: 'TELEPORT_SELF', spellName: 'Blink Strike'
        },
        {
            id: 'frost_specter', name: 'Frost Specter', rarity: 'UNCOMMON', minLevel: 8, maxLevel: 13,
            baseHp: 108, baseMp: 55, baseAtk: 19, baseDef: 15, expReward: 78,
            description: 'Ghostly entity encased in zero-degree mist that chills attacker mana.',
            shape: 'STAR', fillColor: 0x0ea5e9, borderColor: 0xbae6fd,
            hasMagic: true, magicType: 'DRAIN_MP', spellName: 'Mana Chill'
        },
        {
            id: 'fire_elemental', name: 'Fire Elemental', rarity: 'UNCOMMON', minLevel: 9, maxLevel: 14,
            baseHp: 130, baseMp: 65, baseAtk: 24, baseDef: 17, expReward: 95,
            description: 'Living embodiment of roaring flames. Burns whatever it touches.',
            shape: 'SPIKE', fillColor: 0xd97706, borderColor: 0xfef08a,
            hasMagic: true, magicType: 'BURN', spellName: 'Inferno Touch'
        },
        {
            id: 'shadow_stalker', name: 'Shadow Stalker', rarity: 'UNCOMMON', minLevel: 9, maxLevel: 15,
            baseHp: 115, baseMp: 50, baseAtk: 25, baseDef: 16, expReward: 90,
            description: 'Assassin from the Nether realms that warps behind prey.',
            shape: 'DIAMOND', fillColor: 0x1e1b4b, borderColor: 0xa855f7,
            hasMagic: true, magicType: 'TELEPORT_SELF', spellName: 'Shadowstep'
        },
        {
            id: 'manticore_beast', name: 'Manticore', rarity: 'UNCOMMON', minLevel: 9, maxLevel: 15,
            baseHp: 140, baseMp: 35, baseAtk: 27, baseDef: 18, expReward: 100,
            description: 'Lion body with bat wings and a scorpion tail shooting poison darts.',
            shape: 'PENTAGON', fillColor: 0x991b1b, borderColor: 0xfca5a5,
            hasMagic: true, magicType: 'POISON', spellName: 'Scorpion Sting'
        },

        // ==========================================
        // 3. RARE MONSTERS (Min: 150 HP, 20 ATK, 20 DEF)
        // ==========================================
        {
            id: 'minotaur_berserker', name: 'Minotaur Berserker', rarity: 'RARE', minLevel: 9, maxLevel: 16,
            baseHp: 180, baseMp: 0, baseAtk: 30, baseDef: 22, expReward: 120,
            description: 'Bovine behemoth with massive horns charging violently through halls.',
            shape: 'SQUARE', fillColor: 0x7f1d1d, borderColor: 0xf87171, hasMagic: false
        },
        {
            id: 'gorgon_medusa', name: 'Gorgon Medusa', historicName: 'Medusa', rarity: 'RARE', minLevel: 9, maxLevel: 16,
            baseHp: 150, baseMp: 70, baseAtk: 26, baseDef: 20, expReward: 125,
            description: 'Serpent-haired priestess whose gaze freezes blood in veins.',
            shape: 'OCTAGON', fillColor: 0x065f46, borderColor: 0x6ee7b7,
            hasMagic: true, magicType: 'FREEZE', spellName: 'Petrifying Gaze'
        },
        {
            id: 'beholder_eye', name: 'Elder Beholder', historicName: 'Xanathar', rarity: 'RARE', minLevel: 10, maxLevel: 18,
            baseHp: 200, baseMp: 95, baseAtk: 32, baseDef: 24, expReward: 150,
            description: 'Floating orb with multiple eyestalks shooting random warp and poison beams.',
            shape: 'OCTAGON', fillColor: 0x854d0e, borderColor: 0xfef08a,
            hasMagic: true, magicType: 'TELEPORT_PLAYER', spellName: 'Warp Beam'
        },
        {
            id: 'chimera_prime', name: 'Abyssal Chimera', historicName: 'Bellerophon Bane', rarity: 'RARE', minLevel: 10, maxLevel: 19,
            baseHp: 220, baseMp: 85, baseAtk: 35, baseDef: 25, expReward: 165,
            description: 'Triple-headed horror combining fire, poison, and lion ferocity.',
            shape: 'SPIKE', fillColor: 0x9f1239, borderColor: 0xfecdd3,
            hasMagic: true, magicType: 'BURN', spellName: 'Triple Breath'
        },
        {
            id: 'leviathan_spawn', name: 'Leviathan Spawn', historicName: 'Leviathan', rarity: 'RARE', minLevel: 11, maxLevel: 20,
            baseHp: 250, baseMp: 105, baseAtk: 36, baseDef: 28, expReward: 190,
            description: 'Ancient sea demon from abyssal depths commanding tidal freezing waves.',
            shape: 'HEXAGON', fillColor: 0x0c4a6e, borderColor: 0x38bdf8,
            hasMagic: true, magicType: 'FREEZE', spellName: 'Tidal Freeze'
        },
        {
            id: 'fenrir_wolf', name: 'Fenrir the Unbound', historicName: 'Fenrir', rarity: 'RARE', minLevel: 11, maxLevel: 21,
            baseHp: 240, baseMp: 75, baseAtk: 40, baseDef: 25, expReward: 200,
            description: 'Mythological giant wolf destined to consume the sun.',
            shape: 'TRIANGLE', fillColor: 0x334155, borderColor: 0xe2e8f0,
            hasMagic: true, magicType: 'STUN', spellName: 'Ragnarok Howl'
        },
        {
            id: 'behemoth_titan', name: 'Behemoth Titan', historicName: 'Behemoth', rarity: 'RARE', minLevel: 12, maxLevel: 22,
            baseHp: 300, baseMp: 50, baseAtk: 42, baseDef: 32, expReward: 220,
            description: 'Colossal land beast whose footsteps shatter bedrock.',
            shape: 'SQUARE', fillColor: 0x78350f, borderColor: 0xfde047, hasMagic: false
        },
        {
            id: 'thanatos_reaper', name: 'Thanatos Reaper', historicName: 'Thanatos', rarity: 'RARE', minLevel: 12, maxLevel: 23,
            baseHp: 220, baseMp: 125, baseAtk: 44, baseDef: 26, expReward: 240,
            description: 'Greek daemon of death wielding a soul-harvesting scythe that drains MP.',
            shape: 'DIAMOND', fillColor: 0x18181b, borderColor: 0xa1a1aa,
            hasMagic: true, magicType: 'DRAIN_MP', spellName: 'Soul Drain'
        },

        // ==========================================
        // 4. EPIC MONSTERS (Min: 500 HP, 50 ATK, 50 DEF)
        // ==========================================
        {
            id: 'typhon_father', name: 'Typhon the Storm', historicName: 'Typhon', rarity: 'EPIC', minLevel: 13, maxLevel: 24,
            baseHp: 520, baseMp: 115, baseAtk: 52, baseDef: 50, expReward: 320,
            description: 'Fearsome monster of Greek mythology with a hundred serpent heads.',
            shape: 'SPIKE', fillColor: 0x581c87, borderColor: 0xc084fc,
            hasMagic: true, magicType: 'TELEPORT_PLAYER', spellName: 'Storm Vortex'
        },
        {
            id: 'dragon_fafnir', name: 'Dragon Fafnir', historicName: 'Fafnir', rarity: 'EPIC', minLevel: 13, maxLevel: 25,
            baseHp: 550, baseMp: 135, baseAtk: 54, baseDef: 52, expReward: 350,
            description: 'Greedy Norse dragon guarding cursed gold with incinerating dragonfire.',
            shape: 'STAR', fillColor: 0xb91c1c, borderColor: 0xfca5a5,
            hasMagic: true, magicType: 'BURN', spellName: 'Dragonfire'
        },
        {
            id: 'arch_demon_baal', name: 'Arch-Demon Baal', historicName: 'Baal', rarity: 'EPIC', minLevel: 14, maxLevel: 26,
            baseHp: 540, baseMp: 145, baseAtk: 56, baseDef: 53, expReward: 380,
            description: 'First King of Hell ruling over spider hooves and dark lightning.',
            shape: 'OCTAGON', fillColor: 0x450a0a, borderColor: 0xef4444,
            hasMagic: true, magicType: 'TELEPORT_SELF', spellName: 'Hellstep'
        },
        {
            id: 'hydra_lernaean', name: 'Lernaean Hydra', historicName: 'Hydra', rarity: 'EPIC', minLevel: 14, maxLevel: 26,
            baseHp: 560, baseMp: 90, baseAtk: 52, baseDef: 51, expReward: 370,
            description: 'Multi-headed water serpent that spews clouds of corrosive venom.',
            shape: 'PENTAGON', fillColor: 0x064e3b, borderColor: 0x34d399,
            hasMagic: true, magicType: 'POISON', spellName: 'Hydra Venom'
        },
        {
            id: 'cerberus_guardian', name: 'Cerberus Gatekeeper', historicName: 'Cerberus', rarity: 'EPIC', minLevel: 15, maxLevel: 27,
            baseHp: 520, baseMp: 95, baseAtk: 58, baseDef: 52, expReward: 400,
            description: 'Three-headed hound guarding Hades, spewing molten hellfire.',
            shape: 'SPIKE', fillColor: 0x7f1d1d, borderColor: 0xf87171,
            hasMagic: true, magicType: 'BURN', spellName: 'Hellfire Bite'
        },
        {
            id: 'kraken_abyssal', name: 'Kraken Abyssal', historicName: 'Kraken', rarity: 'EPIC', minLevel: 15, maxLevel: 27,
            baseHp: 580, baseMp: 110, baseAtk: 55, baseDef: 55, expReward: 420,
            description: 'Giant tentacled sea nightmare pulling targets into cold depths.',
            shape: 'OCTAGON', fillColor: 0x1e3a8a, borderColor: 0x60a5fa,
            hasMagic: true, magicType: 'FREEZE', spellName: 'Abyssal Grasp'
        },
        {
            id: 'asmodeus_prince', name: 'Asmodeus King', historicName: 'Asmodeus', rarity: 'EPIC', minLevel: 16, maxLevel: 28,
            baseHp: 560, baseMp: 170, baseAtk: 60, baseDef: 54, expReward: 450,
            description: 'Lustful Demon King riding a dragon while wielding a fiery lance.',
            shape: 'STAR', fillColor: 0x701a75, borderColor: 0xf0abfc,
            hasMagic: true, magicType: 'BURN', spellName: 'Lustfire'
        },
        {
            id: 'valkyrie_brunhilde', name: 'Valkyrie Brunhilde', historicName: 'Brunhilde', rarity: 'EPIC', minLevel: 16, maxLevel: 28,
            baseHp: 530, baseMp: 130, baseAtk: 62, baseDef: 56, expReward: 440,
            description: 'Shieldmaiden of Valhalla striking with divine lightning spears.',
            shape: 'DIAMOND', fillColor: 0x0284c7, borderColor: 0xfef08a,
            hasMagic: true, magicType: 'STUN', spellName: 'Lightning Spear'
        },
        {
            id: 'mephisto_lord', name: 'Mephistopheles', historicName: 'Mephisto', rarity: 'EPIC', minLevel: 17, maxLevel: 29,
            baseHp: 570, baseMp: 190, baseAtk: 60, baseDef: 55, expReward: 480,
            description: 'Arch-fiend of deception who burns souls and siphons magic energy.',
            shape: 'HEXAGON', fillColor: 0x312e81, borderColor: 0xa855f7,
            hasMagic: true, magicType: 'DRAIN_MP', spellName: 'Pact Drain'
        },
        {
            id: 'belial_sovereign', name: 'Belial Without Master', historicName: 'Belial', rarity: 'EPIC', minLevel: 18, maxLevel: 30,
            baseHp: 600, baseMp: 180, baseAtk: 64, baseDef: 58, expReward: 500,
            description: 'Demon of lawlessness wielding heavy corrupted dark iron.',
            shape: 'SQUARE', fillColor: 0x27272a, borderColor: 0xd4d4d8, hasMagic: false
        },

        // ==========================================
        // 5. LEGENDARY MONSTERS (Min: 1000 HP, 100 ATK, 100 DEF)
        // ==========================================
        {
            id: 'lucifer_fallen', name: 'Lucifer Morningstar', historicName: 'Lucifer', rarity: 'LEGENDARY', minLevel: 18, maxLevel: 30,
            baseHp: 1050, baseMp: 220, baseAtk: 110, baseDef: 105, expReward: 800,
            description: 'Fallen Archangel holding supreme dark power over the void.',
            shape: 'STAR', fillColor: 0x4c0519, borderColor: 0xfecdd3,
            hasMagic: true, magicType: 'TELEPORT_PLAYER', spellName: 'Void Displacement'
        },
        {
            id: 'beelzebub_fly', name: 'Beelzebub Lord of Flies', historicName: 'Beelzebub', rarity: 'LEGENDARY', minLevel: 18, maxLevel: 30,
            baseHp: 1000, baseMp: 200, baseAtk: 105, baseDef: 100, expReward: 780,
            description: 'Gluttonous Demon Prince surrounded by clouds of poisonous flies.',
            shape: 'OCTAGON', fillColor: 0x365314, borderColor: 0xa3e635,
            hasMagic: true, magicType: 'POISON', spellName: 'Plague Swarm'
        },
        {
            id: 'azazel_fallen', name: 'Azazel Scapegoat', historicName: 'Azazel', rarity: 'LEGENDARY', minLevel: 19, maxLevel: 30,
            baseHp: 1100, baseMp: 210, baseAtk: 115, baseDef: 108, expReward: 850,
            description: 'Leader of the fallen Watchers teaching forbidden blade smithing.',
            shape: 'DIAMOND', fillColor: 0x7c2d12, borderColor: 0xffedd5,
            hasMagic: true, magicType: 'BURN', spellName: 'Watcher Fire'
        },
        {
            id: 'astaroth_duke', name: 'Grand Duke Astaroth', historicName: 'Astaroth', rarity: 'LEGENDARY', minLevel: 19, maxLevel: 30,
            baseHp: 1150, baseMp: 230, baseAtk: 118, baseDef: 110, expReward: 880,
            description: 'Demon Duke riding a viper with venomous breath.',
            shape: 'SPIKE', fillColor: 0x14532d, borderColor: 0x86efac,
            hasMagic: true, magicType: 'POISON', spellName: 'Viper Breath'
        },
        {
            id: 'elder_tiamat', name: 'Elder Dragon Tiamat', historicName: 'Tiamat', rarity: 'LEGENDARY', minLevel: 20, maxLevel: 30,
            baseHp: 1300, baseMp: 280, baseAtk: 130, baseDef: 120, expReward: 1000,
            description: 'Five-headed dragon queen of primordial chaos.',
            shape: 'STAR', fillColor: 0x701a75, borderColor: 0xfef08a,
            hasMagic: true, magicType: 'BURN', spellName: 'Chaos Breath'
        },
        {
            id: 'titan_cronos', name: 'Cronos the Titan', historicName: 'Cronos', rarity: 'LEGENDARY', minLevel: 21, maxLevel: 30,
            baseHp: 1400, baseMp: 250, baseAtk: 135, baseDef: 125, expReward: 1100,
            description: 'King of Titans wielding time-warping scythe strikes.',
            shape: 'HEXAGON', fillColor: 0x713f12, borderColor: 0xfde047,
            hasMagic: true, magicType: 'STUN', spellName: 'Time Stop'
        },
        {
            id: 'prometheus_flame', name: 'Prometheus Unbound', historicName: 'Prometheus', rarity: 'LEGENDARY', minLevel: 22, maxLevel: 30,
            baseHp: 1250, baseMp: 260, baseAtk: 125, baseDef: 115, expReward: 950,
            description: 'Titan who stole fire from gods, wielding eternal sunfire.',
            shape: 'STAR', fillColor: 0xeab308, borderColor: 0xffedd5,
            hasMagic: true, magicType: 'BURN', spellName: 'Solar Flare'
        },
        {
            id: 'yamata_orochi', name: 'Yamata-no-Orochi', historicName: 'Orochi', rarity: 'LEGENDARY', minLevel: 23, maxLevel: 30,
            baseHp: 1500, baseMp: 300, baseAtk: 140, baseDef: 130, expReward: 1250,
            description: 'Eight-headed legend of Japanese myth with venom and blaze.',
            shape: 'SPIKE', fillColor: 0x831843, borderColor: 0xfbcfe8,
            hasMagic: true, magicType: 'POISON', spellName: 'Eightfold Venom'
        },
        {
            id: 'jormungandr_serpent', name: 'Jormungandr Serpent', historicName: 'Jormungandr', rarity: 'LEGENDARY', minLevel: 24, maxLevel: 30,
            baseHp: 1600, baseMp: 320, baseAtk: 145, baseDef: 135, expReward: 1350,
            description: 'Norse serpent wrapping around the world, spitting lethal venom.',
            shape: 'OCTAGON', fillColor: 0x064e3b, borderColor: 0xa7f3d0,
            hasMagic: true, magicType: 'POISON', spellName: 'Miasma Spray'
        },
        {
            id: 'abaddon_angel', name: 'Abaddon Angel of Abyss', historicName: 'Abaddon', rarity: 'LEGENDARY', minLevel: 25, maxLevel: 30,
            baseHp: 1700, baseMp: 350, baseAtk: 150, baseDef: 140, expReward: 1500,
            description: 'The Destroyer, Lord of the Bottomless Pit and Locust armies.',
            shape: 'STAR', fillColor: 0x18181b, borderColor: 0xef4444,
            hasMagic: true, magicType: 'TELEPORT_PLAYER', spellName: 'Abyssal Void'
        },
        {
            id: 'satan_emperor', name: 'Satan Supreme Arch-Fiend', historicName: 'Satan', rarity: 'LEGENDARY', minLevel: 27, maxLevel: 30,
            baseHp: 2000, baseMp: 400, baseAtk: 175, baseDef: 160, expReward: 2000,
            description: 'The supreme adversary reigning in the deepest 30th floor chamber.',
            shape: 'STAR', fillColor: 0x450a0a, borderColor: 0xfef08a,
            hasMagic: true, magicType: 'BURN', spellName: 'Cataclysm Fire'
        },
        {
            id: 'demogorgon_prince', name: 'Demogorgon Prince of Demons', historicName: 'Demogorgon', rarity: 'LEGENDARY', minLevel: 28, maxLevel: 30,
            baseHp: 2500, baseMp: 500, baseAtk: 200, baseDef: 180, expReward: 2500,
            description: 'Two-headed Lord of All Demons wielding madness and annihilation.',
            shape: 'SPIKE', fillColor: 0x3b0764, borderColor: 0xf0abfc,
            hasMagic: true, magicType: 'TELEPORT_SELF', spellName: 'Chaos Shift'
        }
    ];

    public static getRandomMonsterForFloor(floor: number): MonsterTemplate {
        // Rarity spawn probability distribution based on current floor level
        let weights: { rarity: MonsterRarity; weight: number }[] = [];

        if (floor < 5) {
            weights = [
                { rarity: 'COMMON', weight: 95 },
                { rarity: 'UNCOMMON', weight: 4 },
                { rarity: 'RARE', weight: 1 }
            ];
        } else if (floor < 10) {
            weights = [
                { rarity: 'COMMON', weight: 50 },
                { rarity: 'UNCOMMON', weight: 45 },
                { rarity: 'RARE', weight: 4 },
                { rarity: 'EPIC', weight: 1 }
            ];
        } else if (floor < 15) {
            weights = [
                { rarity: 'UNCOMMON', weight: 50 },
                { rarity: 'RARE', weight: 45 },
                { rarity: 'EPIC', weight: 4 },
                { rarity: 'LEGENDARY', weight: 1 }
            ];
        } else if (floor < 20) {
            weights = [
                { rarity: 'RARE', weight: 55 },
                { rarity: 'EPIC', weight: 44 },
                { rarity: 'LEGENDARY', weight: 1 }
            ];
        } else if (floor < 25) {
            weights = [
                { rarity: 'EPIC', weight: 70 },
                { rarity: 'LEGENDARY', weight: 30 }
            ];
        } else {
            weights = [
                { rarity: 'EPIC', weight: 30 },
                { rarity: 'LEGENDARY', weight: 70 }
            ];
        }

        // Pick rarity via weighted random selection
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
        let rand = Math.random() * totalWeight;
        let chosenRarity: MonsterRarity = 'COMMON';

        for (const item of weights) {
            if (rand < item.weight) {
                chosenRarity = item.rarity;
                break;
            }
            rand -= item.weight;
        }

        // Filter candidate monsters of the chosen rarity
        const candidates = this.MONSTERS.filter(m => m.rarity === chosenRarity);
        if (candidates.length > 0) {
            return candidates[Math.floor(Math.random() * candidates.length)];
        }

        // Fallback
        return this.MONSTERS[this.MONSTERS.length - 1];
    }

    public static getMonsterTemplateById(id: string): MonsterTemplate {
        const found = this.MONSTERS.find(m => m.id === id);
        if (found) return found;
        return this.MONSTERS[0];
    }
}
