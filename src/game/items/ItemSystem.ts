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

        // ==========================================
        // 2. UNCOMMON ITEMS
        // ==========================================
        {
            name: "Steel Longsword", type: "SWORD", rarity: "UNCOMMON",
            description: "Finely honed steel longsword with a polished crossguard.",
            atk: 18, def: 4, hp: 0, mp: 0
        },
        {
            name: "Knight Lance", type: "LANCE", rarity: "UNCOMMON",
            description: "Heavy steel lance designed for high impact strikes.",
            atk: 22, def: 0, hp: 0, mp: 0
        },
        {
            name: "Battle Axe", type: "AXE", rarity: "UNCOMMON",
            description: "Double-bladed steel battle axe built to crush shields.",
            atk: 25, def: 0, hp: 25, mp: 0
        },
        {
            name: "Reinforced Helm", type: "HELMET", rarity: "UNCOMMON",
            description: "Steel helmet fitted with a protective visor.",
            atk: 0, def: 15, hp: 30, mp: 0
        },
        {
            name: "Chainmail Coat", type: "ARMOR", rarity: "UNCOMMON",
            description: "Interlocking steel rings capable of deflecting blade strikes.",
            atk: 0, def: 22, hp: 45, mp: 0
        },
        {
            name: "Silver Signet", type: "RING", rarity: "UNCOMMON",
            description: "Polished silver signet ring enhancing battle focus.",
            atk: 6, def: 4, hp: 0, mp: 35
        },
        {
            name: "Scroll of Ice Spike", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Ice Spike. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "ICE_SPIKE"
        },
        {
            name: "Scroll of Poison Dart", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Poison Dart. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "POISON_DART"
        },
        {
            name: "Scroll of Teleport", type: "SCROLL", rarity: "UNCOMMON",
            description: "Ancient scroll containing the spell secrets of Teleport. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "TELEPORT"
        },

        // ==========================================
        // 3. RARE ITEMS
        // ==========================================
        {
            name: "Mithril Claymore", type: "SWORD", rarity: "RARE",
            description: "Lightweight yet exceptionally strong mithril sword.",
            atk: 28, def: 8, hp: 0, mp: 0
        },
        {
            name: "Dragon Piercer", type: "LANCE", rarity: "RARE",
            description: "Toughened lance crafted to pierce draconian scales.",
            atk: 34, def: 5, hp: 0, mp: 0
        },
        {
            name: "Berserker Waraxe", type: "AXE", rarity: "RARE",
            description: "Massive waraxe infused with berserker fury.",
            atk: 38, def: 0, hp: 40, mp: 0
        },
        {
            name: "Mithril Coif", type: "HELMET", rarity: "RARE",
            description: "Woven mithril mesh offering superior protection.",
            atk: 0, def: 24, hp: 50, mp: 0
        },
        {
            name: "Plate of Valor", type: "ARMOR", rarity: "RARE",
            description: "Full plate armor worn by high commanders.",
            atk: 0, def: 35, hp: 80, mp: 0
        },
        {
            name: "Opal Ring of Mana", type: "RING", rarity: "RARE",
            description: "Radiant opal gem ring pulsing with raw magic energy.",
            atk: 10, def: 8, hp: 0, mp: 60
        },
        {
            name: "Scroll of Arcane Nova", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Arcane Nova. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "ARCANE_NOVA"
        },
        {
            name: "Scroll of Shielding Ward", type: "SCROLL", rarity: "RARE",
            description: "Ancient scroll containing the spell secrets of Shielding Ward. Read ('E') to master the spell.",
            atk: 0, def: 0, hp: 0, mp: 0, spellToLearn: "SHIELDING_WARD"
        },

        // ==========================================
        // 4. EPIC HISTORIC ITEMS
        // ==========================================
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
            name: "Lance of Longinus", type: "LANCE", rarity: "EPIC",
            description: "The Holy Spear of destiny. Pierces through any creature's armor.",
            atk: 55, def: 5, hp: 30, mp: 50,
            passive: { name: "Armor Piercer", description: "Bypasses 25% of target DEF", atkBonusPct: 0.12 }
        },
        {
            name: "Labrys of Minos", type: "AXE", rarity: "EPIC",
            description: "Double-headed battleaxe wielded by the ancient Minoan royal guards.",
            atk: 60, def: 0, hp: 80, mp: 0,
            passive: { name: "Cleave", description: "+25% raw physical power", atkBonusPct: 0.25 }
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

        // ==========================================
        // 5. LEGENDARY RELICS
        // ==========================================
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
        }
    ];

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

        // Filter candidate item templates matching the chosen rarity
        const candidates = this.ITEMS.filter(i => i.rarity === chosenRarity);
        const template = candidates.length > 0 
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : this.ITEMS[0];

        // Slight stat scaling based on floor level
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
}
