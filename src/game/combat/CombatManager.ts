import { Player } from '../entities/Player';
import { Monster } from '../entities/Monster';
import { DungeonGrid, TileType, DungeonGenerator } from '../dungeon/DungeonGenerator';
import { ItemSystem, ItemData } from '../items/ItemSystem';
import { AudioManager } from '../audio/AudioManager';
import { SPELL_CATALOG } from '../magic/MagicSystem';

export interface CombatActionResult {
    playerMoved: boolean;
    turnPassed: boolean;
    levelTransition: boolean;
    logMessages: string[];
    droppedItems: { item: ItemData; x: number; y: number }[];
}

export class CombatManager {

    public static executePlayerMoveOrAttack(
        player: Player,
        dx: number,
        dy: number,
        grid: DungeonGrid,
        monsters: Monster[],
        difficultyMult: number = 1.0
    ): CombatActionResult {
        const result: CombatActionResult = {
            playerMoved: false,
            turnPassed: false,
            levelTransition: false,
            logMessages: [],
            droppedItems: []
        };

        const targetX = player.x + dx;
        const targetY = player.y + dy;

        if (targetX < 0 || targetX >= grid.width || targetY < 0 || targetY >= grid.height) {
            return result;
        }

        // Check if there is a monster at target position
        const monster = monsters.find(m => m.isAlive() && m.x === targetX && m.y === targetY);

        if (monster) {
            // Player attacks monster in melee
            const audio = AudioManager.getInstance();
            audio.playAttack();

            const damage = Math.max(1, Math.round(player.getEffectiveAtk() - monster.def * 0.5));
            const dealt = monster.takeDamage(damage);

            // Track damage dealt stat
            player.totalDamageDealt += dealt;

            // Handle lifesteal passive if equipped
            let lifestealMsg = '';
            Object.values(player.equipment).forEach(item => {
                if (item?.passive?.lifestealPct) {
                    const healAmt = player.heal(dealt * item.passive.lifestealPct);
                    if (healAmt > 0) lifestealMsg = ` (Lifestole +${healAmt} HP)`;
                }
            });

            result.logMessages.push(`Hero attacks [${monster.template.rarity}] ${monster.name} dealing ${dealt} damage!${lifestealMsg}`);

            if (!monster.isAlive()) {
                audio.playHit();
                player.totalMonstersKilled++;
                const expGained = Math.round(monster.expReward * difficultyMult);
                result.logMessages.push(`[${monster.template.rarity}] ${monster.name} was slain! +${expGained} EXP.`);
                
                const leveledUp = player.gainExp(expGained);
                if (leveledUp) {
                    audio.playLevelUp();
                    result.logMessages.push(`★ LEVEL UP! Hero is now Level ${player.level}! Stats increased!`);
                }

                // Monster item drop check (1/5 chance: 20%. 90% same rarity, 10% higher rarity)
                if (Math.random() < 0.20) {
                    const roll = Math.random();
                    const targetRarity = roll < 0.90 ? monster.template.rarity : ItemSystem.getHigherRarity(monster.template.rarity);
                    const item = ItemSystem.generateItemForRarity(targetRarity, grid.floor);
                    result.droppedItems.push({ item, x: monster.x, y: monster.y });
                    result.logMessages.push(`🎁 Slain monster dropped [${item.rarity}] ${item.name} at (${monster.x}, ${monster.y})!`);
                }
            }

            player.totalTurns++;
            result.turnPassed = true;
        } else {
            // Movement to floor tile
            if (grid.tiles[targetY][targetX] === TileType.WALL) {
                result.logMessages.push(`Blocked by a solid dungeon wall.`);
                return result;
            }

            player.x = targetX;
            player.y = targetY;
            player.onWalkStep();
            AudioManager.getInstance().playMove();
            player.totalTurns++;
            result.playerMoved = true;
            result.turnPassed = true;

            // Check stairs transition
            if (grid.tiles[targetY][targetX] === TileType.STAIR) {
                AudioManager.getInstance().playStairs();
                result.levelTransition = true;
                result.logMessages.push(`★ Descended the stairs to Floor ${grid.floor + 1}!`);
            }
        }

        return result;
    }

    public static executePlayerWait(player: Player): CombatActionResult {
        player.onWaitTurn();
        player.totalTurns++;
        AudioManager.getInstance().playMove();
        return {
            playerMoved: false,
            turnPassed: true,
            levelTransition: false,
            logMessages: [`Hero waits and focuses, quickly restoring MP and HP based on Total Stats.`],
            droppedItems: []
        };
    }

    public static executePlayerSpell(
        player: Player,
        spellId: string,
        targetX: number,
        targetY: number,
        grid: DungeonGrid,
        monsters: Monster[],
        difficultyMult: number = 1.0
    ): CombatActionResult {
        const result: CombatActionResult = {
            playerMoved: false,
            turnPassed: false,
            levelTransition: false,
            logMessages: [],
            droppedItems: []
        };

        const spell = SPELL_CATALOG[spellId];
        if (!spell) return result;

        const spellRank = player.getSpellMasteryRank(spell.id);
        const masteryDiscount = 0.15 * (spellRank - 1);
        const totalDiscount = Math.min(0.85, player.getManaDiscount() + masteryDiscount);
        const cost = Math.max(3, Math.round(spell.manaCost * (1 - totalDiscount)));

        if (player.currentMp < cost) {
            result.logMessages.push(`Not enough MP to cast ${spell.name}! (Needs ${cost} MP)`);
            return result;
        }

        // Spell MP Power Scaling: Player's total Max MP boosts spell power dynamically!
        const mpScaleMult = 1.0 + (player.getEffectiveMaxMp() / 100) * 0.4;
        const masteryPowerMult = 1 + 0.25 * (spellRank - 1);
        const finalPower = Math.round(spell.power * masteryPowerMult * mpScaleMult);

        const audio = AudioManager.getInstance();
        player.currentMp -= cost;
        player.spellsCast++;
        player.totalTurns++;
        audio.playMagicCast();

        if (spell.type === 'TELEPORT') {
            // Find random explored floor tile
            const floorTiles: { x: number; y: number }[] = [];
            for (let y = 0; y < grid.height; y++) {
                for (let x = 0; x < grid.width; x++) {
                    if (grid.tiles[y][x] === TileType.FLOOR && !monsters.some(m => m.isAlive() && m.x === x && m.y === y)) {
                        floorTiles.push({ x, y });
                    }
                }
            }
            if (floorTiles.length > 0) {
                const spot = floorTiles[Math.floor(Math.random() * floorTiles.length)];
                player.x = spot.x;
                player.y = spot.y;
                audio.playTeleport();
                result.logMessages.push(`Hero cast ${spell.name} (Rank ${spellRank}) and warped through space!`);
                result.playerMoved = true;
                result.turnPassed = true;
            }
            return result;
        }

        if (spell.type === 'HEAL') {
            const healed = player.heal(finalPower + player.level * 5);
            audio.playHeal();
            result.logMessages.push(`Hero cast ${spell.name} (Rank ${spellRank}, MP Boosted) restoring ${healed} HP!`);
            result.turnPassed = true;
            return result;
        }

        if (spell.type === 'BUFF') {
            if (spell.statusEffect === 'FAR_SIGHT') {
                const duration = 20 * spellRank;
                const fovPower = spell.power;
                player.addStatusEffect('FAR_SIGHT', duration, fovPower);
                audio.playHeal();
                result.logMessages.push(`Hero cast ${spell.name} (Rank ${spellRank}), granting +${fovPower} FOV Vision Radius for ${duration} turns!`);
            } else {
                player.def += finalPower;
                audio.playHeal();
                result.logMessages.push(`Hero cast ${spell.name} (Rank ${spellRank}, MP Boosted), granting +${finalPower} DEF!`);
            }
            result.turnPassed = true;
            return result;
        }

        // Single target or AOE spell
        const targetMonsters = spell.type === 'AOE' 
            ? monsters.filter(m => m.isAlive() && Math.abs(m.x - player.x) <= spell.range && Math.abs(m.y - player.y) <= spell.range)
            : monsters.filter(m => m.isAlive() && m.x === targetX && m.y === targetY);

        if (targetMonsters.length === 0 && spell.type !== 'AOE') {
            result.logMessages.push(`No monster found at spell target!`);
            return result;
        }

        targetMonsters.forEach(m => {
            const rawDmg = finalPower + Math.round(player.getEffectiveAtk() * 0.4);
            const dealt = m.takeDamage(rawDmg);
            player.totalDamageDealt += dealt;
            result.logMessages.push(`${spell.name} [Rank ${spellRank}] blasted [${m.template.rarity}] ${m.name} for ${dealt} magic damage!`);

            if (spell.statusEffect) {
                m.addStatusEffect(spell.statusEffect, 4, 8);
                result.logMessages.push(`${m.name} is afflicted with ${spell.statusEffect}!`);
            }

            if (!m.isAlive()) {
                player.totalMonstersKilled++;
                const expGained = Math.round(m.expReward * difficultyMult);
                result.logMessages.push(`[${m.template.rarity}] ${m.name} disintegrated! +${expGained} EXP.`);
                if (player.gainExp(expGained)) {
                    audio.playLevelUp();
                    result.logMessages.push(`★ LEVEL UP! Hero is now Level ${player.level}!`);
                }
                // Monster item drop check on spell kill (1/5 chance: 20%)
                if (Math.random() < 0.20) {
                    const roll = Math.random();
                    const targetRarity = roll < 0.90 ? m.template.rarity : ItemSystem.getHigherRarity(m.template.rarity);
                    const item = ItemSystem.generateItemForRarity(targetRarity, grid.floor);
                    result.droppedItems.push({ item, x: m.x, y: m.y });
                }
            }
        });

        result.turnPassed = true;
        return result;
    }

    public static processTurnEnd(
        player: Player,
        monsters: Monster[],
        grid: DungeonGrid,
        difficultyMult: number = 1.0
    ): string[] {
        const logs: string[] = [];
        const audio = AudioManager.getInstance();

        // 1. Process Status Effects on Player
        player.activeStatusEffects.forEach(s => {
            if (s.type === 'BURN') {
                const dmg = player.takeDamage(s.power);
                logs.push(`Hero suffers ${dmg} Burn fire damage!`);
                audio.playStatusTick();
            } else if (s.type === 'POISON') {
                const dmg = player.takeDamage(s.power);
                logs.push(`Hero suffers ${dmg} Poison tick damage!`);
                audio.playStatusTick();
            } else if (s.type === 'FAR_SIGHT') {
                if (s.duration === 1) {
                    logs.push(`Hero's Far Sight vision effect has expired.`);
                }
            }
            s.duration--;
        });
        player.activeStatusEffects = player.activeStatusEffects.filter(s => s.duration > 0);

        // 2. Process Status Effects on Monsters
        monsters.filter(m => m.isAlive()).forEach(m => {
            m.activeStatusEffects.forEach(s => {
                if (s.type === 'BURN' || s.type === 'POISON') {
                    const dmg = m.takeDamage(s.power);
                    logs.push(`[${m.template.rarity}] ${m.name} suffers ${dmg} ${s.type.toLowerCase()} damage!`);
                    if (!m.isAlive()) {
                        player.totalMonstersKilled++;
                        logs.push(`[${m.template.rarity}] ${m.name} succumbed to ${s.type.toLowerCase()}!`);
                        player.gainExp(m.expReward * difficultyMult);
                    }
                }
                s.duration--;
            });
            m.activeStatusEffects = m.activeStatusEffects.filter(s => s.duration > 0);
        });

        // 3. Process Monster AI Turns (STRICT ORTHOGONAL ONLY & NO MONSTER OVERLAP)
        monsters.filter(m => m.isAlive()).forEach(m => {
            if (m.isStunnedOrFrozen()) {
                logs.push(`[${m.template.rarity}] ${m.name} is frozen/stunned and cannot move!`);
                return;
            }

            const dx = player.x - m.x;
            const dy = player.y - m.y;
            const isOrthogonalAdjacent = (Math.abs(dx) === 1 && dy === 0) || (Math.abs(dy) === 1 && dx === 0);
            const manhattanDist = Math.abs(dx) + Math.abs(dy);

            // Active awareness radius of 10 tiles
            if (manhattanDist <= 10) {
                if (isOrthogonalAdjacent) {
                    // Strictly Orthogonal Melee Attack Only
                    const rawAtk = Math.round(m.atk * difficultyMult);
                    const damage = Math.max(1, Math.round(rawAtk - player.getEffectiveDef() * 0.5));
                    const dealt = player.takeDamage(damage);
                    audio.playHit();
                    logs.push(`[${m.template.rarity}] ${m.name} attacks Hero for ${dealt} damage!`);
                } else if (m.template.hasMagic && m.template.magicType && Math.random() < 0.35 && manhattanDist <= 6) {
                    // Monster casts magic ability
                    const magType = m.template.magicType;
                    audio.playMagicCast();

                    if (magType === 'BURN') {
                        player.addStatusEffect('BURN', 4, 6);
                        logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Fire'} burning Hero!`);
                    } else if (magType === 'POISON') {
                        player.addStatusEffect('POISON', 5, 5);
                        logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Poison'} poisoning Hero!`);
                    } else if (magType === 'FREEZE') {
                        player.addStatusEffect('FREEZE', 2, 0);
                        logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Freeze'} freezing Hero!`);
                    } else if (magType === 'STUN') {
                        player.addStatusEffect('STUN', 2, 0);
                        logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Stun'} stunning Hero!`);
                    } else if (magType === 'DRAIN_MP') {
                        const drained = player.currentMp - Math.max(0, player.currentMp - 20);
                        player.currentMp = Math.max(0, player.currentMp - 20);
                        logs.push(`[${m.template.rarity}] ${m.name} drained ${drained} MP from Hero!`);
                    } else if (magType === 'TELEPORT_PLAYER') {
                        // Teleport player randomly
                        const floorTiles: { x: number; y: number }[] = [];
                        for (let y = 0; y < grid.height; y++) {
                            for (let x = 0; x < grid.width; x++) {
                                if (grid.tiles[y][x] === TileType.FLOOR && !monsters.some(other => other.isAlive() && other.x === x && other.y === y)) {
                                    floorTiles.push({ x, y });
                                }
                            }
                        }
                        if (floorTiles.length > 0) {
                            const spot = floorTiles[Math.floor(Math.random() * floorTiles.length)];
                            player.x = spot.x;
                            player.y = spot.y;
                            audio.playTeleport();
                            logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Warp'}, teleporting Hero across the labyrinth!`);
                        }
                    } else if (magType === 'TELEPORT_SELF') {
                        // Teleport monster randomly to unoccupied floor tile
                        const floorTiles: { x: number; y: number }[] = [];
                        for (let y = 0; y < grid.height; y++) {
                            for (let x = 0; x < grid.width; x++) {
                                if (
                                    grid.tiles[y][x] === TileType.FLOOR &&
                                    !(x === player.x && y === player.y) &&
                                    !monsters.some(other => other.isAlive() && other.x === x && other.y === y)
                                ) {
                                    floorTiles.push({ x, y });
                                }
                            }
                        }
                        if (floorTiles.length > 0) {
                            const spot = floorTiles[Math.floor(Math.random() * floorTiles.length)];
                            m.x = spot.x;
                            m.y = spot.y;
                            audio.playTeleport();
                            logs.push(`[${m.template.rarity}] ${m.name} cast ${m.template.spellName || 'Blink'} and warped to (${spot.x}, ${spot.y})!`);
                        }
                    }
                } else {
                    // Strictly Orthogonal Movement Only (CARDINAL N, S, E, W ONLY)
                    const stepX = Math.sign(dx);
                    const stepY = Math.sign(dy);

                    let trySteps: { x: number; y: number }[] = [];
                    if (Math.abs(dx) >= Math.abs(dy)) {
                        if (stepX !== 0) trySteps.push({ x: m.x + stepX, y: m.y });
                        if (stepY !== 0) trySteps.push({ x: m.x, y: m.y + stepY });
                    } else {
                        if (stepY !== 0) trySteps.push({ x: m.x, y: m.y + stepY });
                        if (stepX !== 0) trySteps.push({ x: m.x + stepX, y: m.y });
                    }

                    for (const targetPos of trySteps) {
                        if (
                            grid.tiles[targetPos.y][targetPos.x] === TileType.FLOOR &&
                            !(targetPos.x === player.x && targetPos.y === player.y) &&
                            !monsters.some(other => other.isAlive() && other.id !== m.id && other.x === targetPos.x && other.y === targetPos.y)
                        ) {
                            m.x = targetPos.x;
                            m.y = targetPos.y;
                            break;
                        }
                    }
                }
            }
        });

        // Update Line of sight / FOV
        DungeonGenerator.updateVisibility(grid, player.x, player.y, player.getEffectiveFov());

        return logs;
    }
}
