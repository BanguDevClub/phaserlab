export type ItemType = 'SWORD' | 'LANCE' | 'AXE' | 'HELMET' | 'ARMOR' | 'RING' | 'SCROLL';
export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ItemPassive {
    name: string;
    description: string;
    atkBonusPct?: number;
    defBonusPct?: number;
    hpRegenBonus?: number;
    mpRegenBonus?: number;
    lifestealPct?: number;
    manaCostDiscount?: number;
}

export interface ItemData {
    id: string;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    description: string;
    atkBonus: number;
    defBonus: number;
    hpBonus: number;
    mpBonus: number;
    spellToLearn?: string; // For scrolls
    passive?: ItemPassive;
    rarityColor: number;
}

export interface ItemTemplate {
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    description: string;
    atk: number;
    def: number;
    hp: number;
    mp: number;
    spellToLearn?: string;
    passive?: ItemPassive;
}

export const RARITY_COLORS: Record<ItemRarity, number> = {
    COMMON: 0x9ca3af,    // Light grey
    UNCOMMON: 0x22c55e,  // Emerald green
    RARE: 0x3b82f6,      // Radiant blue
    EPIC: 0xa855f7,      // Purple
    LEGENDARY: 0xeab308  // Legendary Gold
};

export class ItemSystem {

    public static getHigherRarity(rarity: ItemRarity): ItemRarity {
        if (rarity === 'COMMON') return 'UNCOMMON';
        if (rarity === 'UNCOMMON') return 'RARE';
        if (rarity === 'RARE') return 'EPIC';
        if (rarity === 'EPIC') return 'LEGENDARY';
        return 'LEGENDARY';
    }

    // Structured Item Catalog classified by Rarity (Matching Bestiary structure)
    public static readonly ITEMS: ItemTemplate[] = [
        // ==========================================
        // 1. COMMON ITEMS
        // ==========================================
        {
            name: "Iron Broadsword", type: "SWORD", rarity: "COMMON",
            description: "Standard issue iron broadsword. Reliable in close combat.",
            atk: 10, def: 2, hp: 0, mp: 0
        },
        {
            name: "Recruit Spear", type: "LANCE", rarity: "COMMON",
            description: "Simple wooden lance tipped with forged iron.",
            atk: 12, def: 0, hp: 0, mp: 0
        },
        {
            name: "Woodcutter Axe", type: "AXE", rarity: "COMMON",
            description: "Heavy iron axe originally forged for chopping timber.",
            atk: 14, def: 0, hp: 15, mp: 0
        },
        {
            name: "Leather Cap", type: "HELMET", rarity: "COMMON",
            description: "Basic hardened leather helmet providing light head protection.",
            atk: 0, def: 8, hp: 15, mp: 0
        },
        {
            name: "Padded Vest", type: "ARMOR", rarity: "COMMON",
            description: "Quilted cloth vest stuffed with dense wool.",
            atk: 0, def: 12, hp: 25, mp: 0
        },
        {
            name: "Copper Band", type: "RING", rarity: "COMMON",
            description: "Simple copper ring that channels minor mana.",
            atk: 3, def: 0, hp: 0, mp: 20
        },
        {
            name: "Scroll of Fireball", type: "SCROLL", rarity: "COMMON",
            description: "Ancient scroll containing the spell secrets of Fireball. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "FIREBALL"
        },
        {
            name: "Scroll of Heal", type: "SCROLL", rarity: "COMMON",
            description: "Ancient scroll containing the spell secrets of Heal. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "HEAL"
        },
        {
            name: "Scroll of Poison Dart", type: "SCROLL", rarity: "COMMON",
            description: "Ancient scroll containing the spell secrets of Poison Dart. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "POISON_DART"
        },

        // ==========================================
        // 2. UNCOMMON ITEMS (Minor Historical & Religious Trinkets)
        // ==========================================
        {
            name: "Roman Gladius", type: "SWORD", rarity: "UNCOMMON",
            description: "Short double-edged iron blade wielded by Roman Legionaries.",
            atk: 18, def: 4, hp: 0, mp: 0
        },
        {
            name: "Egyptian Khopesh", type: "SWORD", rarity: "UNCOMMON",
            description: "Curved sickle-sword forged for ancient Pharaoh vanguards.",
            atk: 20, def: 3, hp: 10, mp: 0
        },
        {
            name: "Viking Ulfberht", type: "SWORD", rarity: "UNCOMMON",
            description: "High-carbon crucible steel blade famed in Norse saga legends.",
            atk: 22, def: 2, hp: 0, mp: 15
        },
        {
            name: "Spartan Hoplon", type: "ARMOR", rarity: "UNCOMMON",
            description: "Heavy bronze-faced wooden shield of Spartan phalanx warriors.",
            atk: 0, def: 22, hp: 45, mp: 0
        },
        {
            name: "Crusader Greathelm", type: "HELMET", rarity: "UNCOMMON",
            description: "Cylindrical steel helm bearing a brass cross visor.",
            atk: 0, def: 18, hp: 35, mp: 0
        },
        {
            name: "Frankish Francisca", type: "AXE", rarity: "UNCOMMON",
            description: "Balanced throwing battleaxe used by early Frankish tribes.",
            atk: 25, def: 0, hp: 20, mp: 0
        },
        {
            name: "Byzantine Chainmail", type: "ARMOR", rarity: "UNCOMMON",
            description: "Interlocking iron ring mail worn by Eastern Roman cataphracts.",
            atk: 0, def: 24, hp: 50, mp: 0
        },
        {
            name: "Scarab of Ra", type: "RING", rarity: "UNCOMMON",
            description: "Egyptian lapis amulet representing rebirth and solar energy.",
            atk: 5, def: 5, hp: 25, mp: 40
        },
        {
            name: "Scroll of Ice Spike", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Ice Spike. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "ICE_SPIKE"
        },
        {
            name: "Scroll of Teleport", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Teleport. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "TELEPORT"
        },
        {
            name: "Scroll of Shielding Ward", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Shielding Ward. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "SHIELDING_WARD"
        },
        {
            name: "Scroll of Thunderbolt", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Thunderbolt. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "THUNDERBOLT"
        },

        // ==========================================
        // 3. RARE ITEMS (Historical & Religious Artifacts)
        // ==========================================
        {
            name: "Zulfiqar of Ali", type: "SWORD", rarity: "RARE",
            description: "Legendary double-pointed scimitar from ancient Near Eastern history.",
            atk: 32, def: 6, hp: 20, mp: 20
        },
        {
            name: "Ron Spear of Arthur", type: "LANCE", rarity: "RARE",
            description: "Heavy thrusting spear wielded alongside Excalibur by King Arthur.",
            atk: 35, def: 5, hp: 30, mp: 0
        },
        {
            name: "Vajra of Indra", type: "AXE", rarity: "RARE",
            description: "Ritual thunderbolt axe representing firmness of spirit and lightning power.",
            atk: 38, def: 4, hp: 25, mp: 35
        },
        {
            name: "Menorah of Solomon", type: "HELMET", rarity: "RARE",
            description: "Seven-lamp golden crown radiating holy illumination in dark caverns.",
            atk: 5, def: 25, hp: 50, mp: 40
        },
        {
            name: "Ankh of Osiris", type: "RING", rarity: "RARE",
            description: "Egyptian sacred key of life granting health regen and divine protection.",
            atk: 8, def: 12, hp: 60, mp: 50
        },
        {
            name: "Caduceus of Hermes", type: "LANCE", rarity: "RARE",
            description: "Herald's staff entwined with twin serpents, granting swift magic movement.",
            atk: 30, def: 8, hp: 30, mp: 60
        },
        {
            name: "Sandals of Hermes", type: "RING", rarity: "RARE",
            description: "Winged talaria footwear granting divine swiftness and mana focus.",
            atk: 10, def: 10, hp: 40, mp: 75
        },
        {
            name: "Draupnir Ring", type: "RING", rarity: "RARE",
            description: "Norse gold ring forged by dwarves that multiplies wielder prosperity.",
            atk: 12, def: 12, hp: 50, mp: 80
        },
        {
            name: "Scroll of Arcane Nova", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Arcane Nova. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "ARCANE_NOVA"
        },
        {
            name: "Scroll of Divine Smite", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Divine Smite. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "DIVINE_SMITE"
        },
        {
            name: "Scroll of Miasma Cloud", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Miasma Cloud. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "MIASMA_CLOUD"
        },
        {
            name: "Scroll of Astral Drain", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Astral Drain. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "ASTRAL_DRAIN"
        },

        // ==========================================
        // 4. EPIC HISTORIC & RELIGIOUS RELICS
        // ==========================================
        {
            name: "Spear of Longinus", type: "LANCE", rarity: "EPIC",
            description: "The Holy Spear of destiny that pierced the divine side. Ignores defense.",
            atk: 55, def: 5, hp: 30, mp: 50,
            passive: { name: "Armor Piercer", description: "Bypasses 25% of target DEF", atkBonusPct: 0.15 }
        },
        {
            name: "Cross of Constantine", type: "ARMOR", rarity: "EPIC",
            description: "Imperial golden breastplate inscribed with the sacred Chi-Rho emblem.",
            atk: 10, def: 50, hp: 110, mp: 40,
            passive: { name: "Imperium Guard", description: "+25% DEF & +3 HP regen per turn", defBonusPct: 0.25, hpRegenBonus: 3 }
        },
        {
            name: "Sudarshana Chakra", type: "RING", rarity: "EPIC",
            description: "Spinning serrated divine disc of Lord Vishnu representing cosmic law.",
            atk: 25, def: 15, hp: 70, mp: 90,
            passive: { name: "Chakra Vortex", description: "+20% ATK damage bonus", atkBonusPct: 0.20 }
        },
        {
            name: "Staff of Moses", type: "LANCE", rarity: "EPIC",
            description: "Sacred wooden staff that parted the Red Sea and struck water from rock.",
            atk: 40, def: 15, hp: 80, mp: 120,
            passive: { name: "Parting Seas", description: "Reduces spell mana cost by 25%", manaCostDiscount: 0.25 }
        },
        {
            name: "Excalibur", type: "SWORD", rarity: "EPIC",
            description: "The legendary sword of King Arthur. Radiates divine authority.",
            atk: 45, def: 12, hp: 60, mp: 30,
            passive: { name: "Holy Strike", description: "+15% ATK & restores 5 HP on kill", atkBonusPct: 0.15, hpRegenBonus: 5 }
        },
        {
            name: "Masamune", type: "SWORD", rarity: "EPIC",
            description: "Forged by master blacksmith Okazaki Masamune with razor sharpness.",
            atk: 50, def: 8, hp: 40, mp: 40,
            passive: { name: "Vanish Edge", description: "+20% ATK damage bonus", atkBonusPct: 0.20 }
        },
        {
            name: "Helm of Hades", type: "HELMET", rarity: "EPIC",
            description: "Cap of invisibility fashioned for the Lord of the Underworld.",
            atk: 10, def: 40, hp: 70, mp: 60,
            passive: { name: "Shadow Shroud", description: "+20% DEF & reduces spell cost 20%", defBonusPct: 0.20, manaCostDiscount: 0.20 }
        },
        {
            name: "Aegis of Athena", type: "ARMOR", rarity: "EPIC",
            description: "The legendary shield bearing Medusa's likeness, granted to Athena.",
            atk: 15, def: 55, hp: 120, mp: 40,
            passive: { name: "Gorgon Ward", description: "+25% DEF bonus", defBonusPct: 0.25 }
        },
        {
            name: "Ring of Solomon", type: "RING", rarity: "EPIC",
            description: "Magical seal ring of King Solomon granting command over spirits.",
            atk: 20, def: 20, hp: 80, mp: 120,
            passive: { name: "Arcane Mastery", description: "+3 MP restored on every step", mpRegenBonus: 3 }
        },
        {
            name: "Scroll of Ragnarok Strike", type: "SCROLL", rarity: "EPIC",
            description: "Ancient scroll containing the spell secrets of Ragnarok Strike. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "RAGNAROK_STRIKE"
        },
        {
            name: "Scroll of Holy Light", type: "SCROLL", rarity: "EPIC",
            description: "Ancient scroll containing the spell secrets of Holy Light. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "HOLY_LIGHT"
        },
        {
            name: "Scroll of Time Distortion", type: "SCROLL", rarity: "EPIC",
            description: "Ancient scroll containing the spell secrets of Time Distortion. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "TIME_DISTORTION"
        },

        // ==========================================
        // 5. LEGENDARY DIVINE ARTIFACTS
        // ==========================================
        {
            name: "Trishula of Shiva", type: "LANCE", rarity: "LEGENDARY",
            description: "The sacred trident of Lord Shiva symbolizing creation, preservation, and destruction.",
            atk: 95, def: 35, hp: 180, mp: 140,
            passive: { name: "Destroyer Strike", description: "+40% ATK & lifesteal 18%", atkBonusPct: 0.40, lifestealPct: 0.18 }
        },
        {
            name: "Book of Thoth", type: "RING", rarity: "LEGENDARY",
            description: "Sacred papyrus bound in gold containing supreme magic secrets of Egyptian lore.",
            atk: 40, def: 40, hp: 150, mp: 300,
            passive: { name: "Thoth Wisdom", description: "+35% spell power & 45% MP discount", manaCostDiscount: 0.45, mpRegenBonus: 5 }
        },
        {
            name: "Holy Grail", type: "RING", rarity: "LEGENDARY",
            description: "The sacred vessel granting eternal vitality and limitless holy energy.",
            atk: 30, def: 45, hp: 250, mp: 200,
            passive: { name: "Chalice Aura", description: "+6 HP & +4 MP regen per turn", hpRegenBonus: 6, mpRegenBonus: 4 }
        },
        {
            name: "Shroud of Turin", type: "ARMOR", rarity: "LEGENDARY",
            description: "Sacred linen cloth granting invulnerability aura against darkness.",
            atk: 25, def: 100, hp: 350, mp: 180,
            passive: { name: "Resurrection Light", description: "+40% DEF & +5 HP regen per turn", defBonusPct: 0.40, hpRegenBonus: 5 }
        },
        {
            name: "Mjolnir", type: "AXE", rarity: "LEGENDARY",
            description: "The hammer of Thor, god of thunder. Channels crackling lightning.",
            atk: 90, def: 30, hp: 160, mp: 100,
            passive: { name: "Thunderclap", description: "+35% ATK & lifesteal 15%", atkBonusPct: 0.35, lifestealPct: 0.15 }
        },
        {
            name: "Gungnir", type: "LANCE", rarity: "LEGENDARY",
            description: "The spear of Odin that never misses its target once thrown.",
            atk: 85, def: 25, hp: 140, mp: 120,
            passive: { name: "Odin's Sight", description: "+30% ATK & +2 MP regen on walk", atkBonusPct: 0.30, mpRegenBonus: 2 }
        },
        {
            name: "Cloak of Gilgamesh", type: "ARMOR", rarity: "LEGENDARY",
            description: "Golden battle armor of the King of Uruk imbued with immortality.",
            atk: 30, def: 90, hp: 300, mp: 160,
            passive: { name: "Immortality Aura", description: "+35% DEF & +4 HP regen per turn", defBonusPct: 0.35, hpRegenBonus: 4 }
        },
        {
            name: "Ring of Nibelungen", type: "RING", rarity: "LEGENDARY",
            description: "Cursed ring of infinite wealth and supreme magical command.",
            atk: 50, def: 50, hp: 200, mp: 250,
            passive: { name: "Rhine Sovereign", description: "+30% ATK/DEF & 40% spell cost discount", atkBonusPct: 0.30, defBonusPct: 0.30, manaCostDiscount: 0.40 }
        },
        {
            name: "Crown of Nebuchadnezzar", type: "HELMET", rarity: "LEGENDARY",
            description: "Imperial crown of the Babylonian king who constructed the Hanging Gardens.",
            atk: 40, def: 75, hp: 220, mp: 180,
            passive: { name: "Babel Tower", description: "+30% DEF and +100 Max HP", defBonusPct: 0.30 }
        },
        {
            name: "Scroll of Phoenix Flame", type: "SCROLL", rarity: "LEGENDARY",
            description: "Ancient scroll containing the spell secrets of Phoenix Flame. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "PHOENIX_FLAME"
        }
    ];

    public static generateItemForRarity(rarity: ItemRarity, floor: number): ItemData {
        const candidates = this.ITEMS.filter(i => i.rarity === rarity);
        const template = candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : this.ITEMS[0];

        const floorScaling = 1.0 + (floor - 1) * 0.04;

        return {
            id: `${template.name.replace(/\s+/g, '_')}_${Date.now()}_${Math.random()}`,
            name: template.name,
            type: template.type,
            rarity: template.rarity,
            description: template.description,
            atkBonus: Math.round(template.atk * floorScaling),
            defBonus: Math.round(template.def * floorScaling),
            hpBonus: Math.round(template.hp * floorScaling),
            mpBonus: Math.round(template.mp * floorScaling),
            spellToLearn: template.spellToLearn,
            passive: template.passive,
            rarityColor: RARITY_COLORS[template.rarity]
        };
    }

    public static generateItemForFloor(floor: number): ItemData {
        // Rarity spawn probability distribution based on current floor (Matching Bestiary logic)
        let weights: { rarity: ItemRarity; weight: number }[] = [];

        if (floor <= 5) {
            weights = [
                { rarity: 'COMMON', weight: 95 },
                { rarity: 'UNCOMMON', weight: 4 },
                { rarity: 'RARE', weight: 1 }
            ];
        } else if (floor <= 10) {
            weights = [
                { rarity: 'COMMON', weight: 50 },
                { rarity: 'UNCOMMON', weight: 45 },
                { rarity: 'RARE', weight: 4 },
                { rarity: 'EPIC', weight: 1 }
            ];
        } else if (floor <= 15) {
            weights = [
                { rarity: 'UNCOMMON', weight: 50 },
                { rarity: 'RARE', weight: 45 },
                { rarity: 'EPIC', weight: 4 },
                { rarity: 'LEGENDARY', weight: 1 }
            ];
        } else if (floor <= 20) {
            weights = [
                { rarity: 'RARE', weight: 55 },
                { rarity: 'EPIC', weight: 44 },
                { rarity: 'LEGENDARY', weight: 1 }
            ];
        } else if (floor <= 25) {
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
        let chosenRarity: ItemRarity = 'COMMON';

        for (const item of weights) {
            if (rand < item.weight) {
                chosenRarity = item.rarity;
                break;
            }
            rand -= item.weight;
        }

        return this.generateItemForRarity(chosenRarity, floor);
    }
}
