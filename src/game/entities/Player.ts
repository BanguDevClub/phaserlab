import { Entity } from './Entity';
import { ItemData } from '../items/ItemSystem';

export interface EquipmentSlots {
    weapon: ItemData | null;
    head: ItemData | null;
    body: ItemData | null;
    ring: ItemData | null;
}

export class Player extends Entity {
    public level: number = 1;
    public exp: number = 0;
    public expToNextLevel: number = 50;

    public equipment: EquipmentSlots = {
        weapon: null,
        head: null,
        body: null,
        ring: null
    };

    public inventory: ItemData[] = [];
    public learnedSpells: string[] = [];

    // Mastery Systems: Duplicate items & spells increase mastery levels
    public itemMastery: Record<string, number> = {};
    public spellMastery: Record<string, number> = {};

    // Regeneration counters
    private walkStepCount: number = 0;
    private hpRegenTimer: number = 0;

    constructor(x: number, y: number) {
        super('player', 'Hero', x, y, 100, 50, 18, 5);
    }

    public override getMaxHpForCap(): number {
        return this.getEffectiveMaxHp();
    }

    public override getMaxMpForCap(): number {
        return this.getEffectiveMaxMp();
    }

    // Item Mastery helper
    public getItemMasteryRank(itemName: string): number {
        return this.itemMastery[itemName] || 1;
    }

    public incrementItemMastery(itemName: string): number {
        this.itemMastery[itemName] = (this.itemMastery[itemName] || 1) + 1;
        return this.itemMastery[itemName];
    }

    // Spell Mastery helper
    public getSpellMasteryRank(spellId: string): number {
        return this.spellMastery[spellId] || 1;
    }

    public incrementSpellMastery(spellId: string): number {
        this.spellMastery[spellId] = (this.spellMastery[spellId] || 1) + 1;
        return this.spellMastery[spellId];
    }

    // Calculate effective stats taking base + items + passives + item mastery into account
    public getEffectiveAtk(): number {
        let bonus = 0;
        let pct = 0;

        Object.values(this.equipment).forEach(item => {
            if (item) {
                const rank = this.getItemMasteryRank(item.name);
                const masteryMult = 1 + 0.20 * (rank - 1);
                bonus += item.atkBonus * masteryMult;
                if (item.passive?.atkBonusPct) pct += item.passive.atkBonusPct;
            }
        });

        return Math.round((this.atk + bonus) * (1 + pct));
    }

    public getEffectiveDef(): number {
        let bonus = 0;
        let pct = 0;

        Object.values(this.equipment).forEach(item => {
            if (item) {
                const rank = this.getItemMasteryRank(item.name);
                const masteryMult = 1 + 0.20 * (rank - 1);
                bonus += item.defBonus * masteryMult;
                if (item.passive?.defBonusPct) pct += item.passive.defBonusPct;
            }
        });

        return Math.round((this.def + bonus) * (1 + pct));
    }

    public getEffectiveMaxHp(): number {
        let bonus = 0;
        Object.values(this.equipment).forEach(item => {
            if (item) {
                const rank = this.getItemMasteryRank(item.name);
                const masteryMult = 1 + 0.20 * (rank - 1);
                bonus += item.hpBonus * masteryMult;
            }
        });
        return Math.round(this.maxHp + bonus);
    }

    public getEffectiveMaxMp(): number {
        let bonus = 0;
        Object.values(this.equipment).forEach(item => {
            if (item) {
                const rank = this.getItemMasteryRank(item.name);
                const masteryMult = 1 + 0.20 * (rank - 1);
                bonus += item.mpBonus * masteryMult;
            }
        });
        return Math.round(this.maxMp + bonus);
    }

    // Regeneration calculated using Total Effective Stats (Max HP & Max MP)
    public onWalkStep() {
        this.walkStepCount++;

        let bonusMpRegen = 0;
        let bonusHpRegen = 0;
        Object.values(this.equipment).forEach(item => {
            if (item?.passive?.mpRegenBonus) bonusMpRegen += item.passive.mpRegenBonus;
            if (item?.passive?.hpRegenBonus) bonusHpRegen += item.passive.hpRegenBonus;
        });

        // MP regen: 2% of Total Max MP every step + item bonuses
        const totalMaxMp = this.getEffectiveMaxMp();
        const mpRegenAmount = Math.max(1, Math.round(totalMaxMp * 0.02)) + bonusMpRegen;
        this.restoreMp(mpRegenAmount);

        // HP regen: 1% of Total Max HP every 4 steps + item bonuses
        this.hpRegenTimer++;
        if (this.hpRegenTimer >= 4) {
            this.hpRegenTimer = 0;
            const totalMaxHp = this.getEffectiveMaxHp();
            const hpRegenAmount = Math.max(1, Math.round(totalMaxHp * 0.01)) + bonusHpRegen;
            this.heal(hpRegenAmount);
        }
    }

    // Waiting action ('Space' key): Fast MP & HP regen calculated on Total Stats
    public onWaitTurn() {
        let bonusMpRegen = 0;
        let bonusHpRegen = 0;
        Object.values(this.equipment).forEach(item => {
            if (item?.passive?.mpRegenBonus) bonusMpRegen += item.passive.mpRegenBonus;
            if (item?.passive?.hpRegenBonus) bonusHpRegen += item.passive.hpRegenBonus;
        });

        // Fast MP regen on wait: 8% of Total Max MP + bonuses
        const totalMaxMp = this.getEffectiveMaxMp();
        const mpRegenAmount = Math.max(4, Math.round(totalMaxMp * 0.08)) + bonusMpRegen;
        this.restoreMp(mpRegenAmount);

        // Faster HP regen on wait: 3% of Total Max HP + bonuses
        const totalMaxHp = this.getEffectiveMaxHp();
        const hpRegenAmount = Math.max(2, Math.round(totalMaxHp * 0.03)) + bonusHpRegen;
        this.heal(hpRegenAmount);
    }

    public gainExp(amount: number): boolean {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
            return true;
        }
        return false;
    }

    private levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.round(this.expToNextLevel * 1.5);

        // Base stat gains
        this.maxHp += 20;
        this.currentHp = this.getEffectiveMaxHp();
        this.maxMp += 10;
        this.currentMp = this.getEffectiveMaxMp();
        this.atk += 4;
        this.def += 2;
    }

    public equipItem(item: ItemData): { unequipped: ItemData | null } {
        let unequipped: ItemData | null = null;

        if (item.type === 'SWORD' || item.type === 'LANCE' || item.type === 'AXE') {
            unequipped = this.equipment.weapon;
            this.equipment.weapon = item;
        } else if (item.type === 'HELMET') {
            unequipped = this.equipment.head;
            this.equipment.head = item;
        } else if (item.type === 'ARMOR') {
            unequipped = this.equipment.body;
            this.equipment.body = item;
        } else if (item.type === 'RING') {
            unequipped = this.equipment.ring;
            this.equipment.ring = item;
        }

        // Remove equipped item from inventory
        const idx = this.inventory.findIndex(i => i.id === item.id);
        if (idx !== -1) {
            this.inventory.splice(idx, 1);
        }

        // Return previously unequipped item to inventory if any
        if (unequipped) {
            this.inventory.push(unequipped);
        }

        return { unequipped };
    }

    public unequipSlot(slot: keyof EquipmentSlots): ItemData | null {
        const item = this.equipment[slot];
        if (item) {
            this.equipment[slot] = null;
            this.inventory.push(item);
        }
        return item;
    }

    public getManaDiscount(): number {
        let discount = 0;
        Object.values(this.equipment).forEach(item => {
            if (item?.passive?.manaCostDiscount) {
                discount += item.passive.manaCostDiscount;
            }
        });
        return Math.min(0.8, discount);
    }
}
