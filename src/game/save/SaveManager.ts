import { Difficulty } from '../config/GameConfig';
import { Player } from '../entities/Player';
import { ItemData } from '../items/ItemSystem';
import { DungeonGrid } from '../dungeon/DungeonGenerator';
import { Monster } from '../entities/Monster';

export interface PlayerSaveData {
    x: number;
    y: number;
    maxHp: number;
    currentHp: number;
    maxMp: number;
    currentMp: number;
    atk: number;
    def: number;
    level: number;
    exp: number;
    expToNextLevel: number;
    equipment: {
        weapon: ItemData | null;
        head: ItemData | null;
        body: ItemData | null;
        ring: ItemData | null;
    };
    inventory: ItemData[];
    learnedSpells: string[];
    itemMastery: Record<string, number>;
    spellMastery: Record<string, number>;
    // Stats tracking
    totalDamageDealt?: number;
    totalTurns?: number;
    totalMonstersKilled?: number;
    itemsPickedUp?: number;
    spellsCast?: number;
    totalDamageTaken?: number;
    totalHealthHealed?: number;
}

export interface SerializedMonster {
    templateId: string;
    x: number;
    y: number;
    currentHp: number;
    maxHp: number;
    atk: number;
    def: number;
    expReward: number;
}

export interface LevelSaveData {
    width: number;
    height: number;
    tiles: number[][];
    explored: boolean[][];
    visible: boolean[][];
    playerStart: { x: number; y: number };
    stairPos: { x: number; y: number };
    monsters: SerializedMonster[];
    droppedItems: { item: ItemData; x: number; y: number }[];
}

export interface SaveSlot {
    id: string;
    name: string;
    timestamp: number;
    floor: number;
    difficulty: Difficulty;
    playerData: PlayerSaveData;
    levelData?: LevelSaveData;
}

export class SaveManager {
    private static readonly STORAGE_KEY = 'phaserlab_save_slots';

    public static listSaveSlots(): SaveSlot[] {
        try {
            const raw = localStorage.getItem(SaveManager.STORAGE_KEY);
            if (!raw) return [];
            const parsed: SaveSlot[] = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.sort((a, b) => b.timestamp - a.timestamp) : [];
        } catch {
            return [];
        }
    }

    public static saveGame(
        slotName: string,
        floor: number,
        difficulty: Difficulty,
        player: Player,
        grid?: DungeonGrid,
        monsters?: Monster[],
        droppedItems?: { item: ItemData; x: number; y: number }[],
        existingSlotId?: string
    ): SaveSlot {
        const slots = SaveManager.listSaveSlots();
        const now = Date.now();
        const dateStr = new Date(now).toLocaleString();

        const playerData: PlayerSaveData = {
            x: player.x,
            y: player.y,
            maxHp: player.maxHp,
            currentHp: player.currentHp,
            maxMp: player.maxMp,
            currentMp: player.currentMp,
            atk: player.atk,
            def: player.def,
            level: player.level,
            exp: player.exp,
            expToNextLevel: player.expToNextLevel,
            equipment: {
                weapon: player.equipment.weapon,
                head: player.equipment.head,
                body: player.equipment.body,
                ring: player.equipment.ring
            },
            inventory: player.inventory,
            learnedSpells: player.learnedSpells,
            itemMastery: player.itemMastery,
            spellMastery: player.spellMastery,
            totalDamageDealt: player.totalDamageDealt,
            totalTurns: player.totalTurns,
            totalMonstersKilled: player.totalMonstersKilled,
            itemsPickedUp: player.itemsPickedUp,
            spellsCast: player.spellsCast,
            totalDamageTaken: player.totalDamageTaken,
            totalHealthHealed: player.totalHealthHealed
        };

        let levelData: LevelSaveData | undefined = undefined;
        if (grid) {
            levelData = {
                width: grid.width,
                height: grid.height,
                tiles: grid.tiles,
                explored: grid.explored,
                visible: grid.visible,
                playerStart: grid.playerStart,
                stairPos: grid.stairPos,
                monsters: (monsters || []).filter(m => m.isAlive()).map(m => ({
                    templateId: m.template.id,
                    x: m.x,
                    y: m.y,
                    currentHp: m.currentHp,
                    maxHp: m.maxHp,
                    atk: m.atk,
                    def: m.def,
                    expReward: m.expReward
                })),
                droppedItems: droppedItems || []
            };
        }

        const targetId = existingSlotId || `slot_${now}_${Math.floor(Math.random() * 1000)}`;
        const displayName = slotName || `Floor ${floor} • Lv ${player.level} (${dateStr})`;

        const newSlot: SaveSlot = {
            id: targetId,
            name: displayName,
            timestamp: now,
            floor,
            difficulty,
            playerData,
            levelData
        };

        const idx = slots.findIndex(s => s.id === targetId);
        if (idx !== -1) {
            slots[idx] = newSlot;
        } else {
            slots.push(newSlot);
        }

        try {
            localStorage.setItem(SaveManager.STORAGE_KEY, JSON.stringify(slots));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }

        return newSlot;
    }

    public static loadGame(slotId: string): SaveSlot | null {
        const slots = SaveManager.listSaveSlots();
        return slots.find(s => s.id === slotId) || null;
    }

    public static deleteSaveSlot(slotId: string): boolean {
        const slots = SaveManager.listSaveSlots();
        const filtered = slots.filter(s => s.id !== slotId);
        try {
            localStorage.setItem(SaveManager.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch {
            return false;
        }
    }

    public static restorePlayerFromSave(player: Player, saveData: PlayerSaveData) {
        player.x = saveData.x;
        player.y = saveData.y;
        player.maxHp = saveData.maxHp;
        player.currentHp = saveData.currentHp;
        player.maxMp = saveData.maxMp;
        player.currentMp = saveData.currentMp;
        player.atk = saveData.atk;
        player.def = saveData.def;
        player.level = saveData.level;
        player.exp = saveData.exp;
        player.expToNextLevel = saveData.expToNextLevel;
        player.equipment = {
            weapon: saveData.equipment.weapon,
            head: saveData.equipment.head,
            body: saveData.equipment.body,
            ring: saveData.equipment.ring
        };
        player.inventory = saveData.inventory || [];
        player.learnedSpells = saveData.learnedSpells || [];
        player.itemMastery = saveData.itemMastery || {};
        player.spellMastery = saveData.spellMastery || {};

        player.totalDamageDealt = saveData.totalDamageDealt || 0;
        player.totalTurns = saveData.totalTurns || 0;
        player.totalMonstersKilled = saveData.totalMonstersKilled || 0;
        player.itemsPickedUp = saveData.itemsPickedUp || 0;
        player.spellsCast = saveData.spellsCast || 0;
        player.totalDamageTaken = saveData.totalDamageTaken || 0;
        player.totalHealthHealed = saveData.totalHealthHealed || 0;
    }
}
