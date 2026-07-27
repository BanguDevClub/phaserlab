import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ItemData } from '../items/ItemSystem';
import { AudioManager } from '../audio/AudioManager';

export class InventoryOverlay extends Phaser.Scene {
    private player!: Player;
    private onCloseCallback?: () => void;
    private container!: Phaser.GameObjects.Container;
    private selectedItem: ItemData | null = null;

    private currentPage: number = 0;
    private readonly itemsPerPage: number = 6;

    // Filters for Item Type and Rarity
    private typeFilter: string = 'ALL';
    private rarityFilter: string = 'ALL';

    constructor() {
        super('InventoryOverlay');
    }

    public init(data: { player: Player; onClose?: () => void }) {
        this.player = data.player;
        this.onCloseCallback = data.onClose;
        this.selectedItem = null;
        this.currentPage = 0;
        this.typeFilter = 'ALL';
        this.rarityFilter = 'ALL';
    }

    public create() {
        const { width, height } = this.scale;

        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.close());

        this.container = this.add.container(width / 2, height / 2);
        this.renderInventoryModal();

        this.input.keyboard?.on('keydown-E', () => this.close());
        this.input.keyboard?.on('keydown-ESC', () => this.close());

        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        this.container.setPosition(gameSize.width / 2, gameSize.height / 2);
    }

    private getFilteredInventory(): ItemData[] {
        return this.player.inventory.filter(item => {
            let typeMatch = true;
            if (this.typeFilter === 'WEAPON') typeMatch = ['SWORD', 'LANCE', 'AXE'].includes(item.type);
            else if (this.typeFilter === 'ARMOR') typeMatch = ['HELMET', 'ARMOR'].includes(item.type);
            else if (this.typeFilter === 'RING') typeMatch = item.type === 'RING';
            else if (this.typeFilter === 'SCROLL') typeMatch = item.type === 'SCROLL';

            let rarityMatch = true;
            if (this.rarityFilter !== 'ALL') rarityMatch = item.rarity === this.rarityFilter;

            return typeMatch && rarityMatch;
        });
    }

    private renderInventoryModal() {
        this.container.removeAll(true);

        const w = 720;
        const h = 600;

        // Modal Frame Card
        const panel = this.add.graphics();
        panel.fillStyle(0x090d16, 0.96);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
        panel.lineStyle(3, 0x38bdf8, 1.0);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
        this.container.add(panel);

        // Header Title
        const title = this.add.text(0, -h / 2 + 24, '🎒 HERO INVENTORY & EQUIPMENT', {
            fontFamily: 'system-ui, sans-serif', fontSize: '22px', color: '#38bdf8', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.container.add(title);

        // 1. Equipped Gear Section
        const eqTitle = this.add.text(-w / 2 + 30, -h / 2 + 50, 'EQUIPPED GEAR', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#facc15', fontStyle: 'bold'
        });
        this.container.add(eqTitle);

        const slots: { label: string; item: ItemData | null; key: 'weapon' | 'head' | 'body' | 'ring' }[] = [
            { label: 'Weapon', item: this.player.equipment.weapon, key: 'weapon' },
            { label: 'Head', item: this.player.equipment.head, key: 'head' },
            { label: 'Body', item: this.player.equipment.body, key: 'body' },
            { label: 'Ring', item: this.player.equipment.ring, key: 'ring' }
        ];

        slots.forEach((s, idx) => {
            const startX = -w / 2 + 30 + (idx % 2) * 340;
            const startY = -h / 2 + 70 + Math.floor(idx / 2) * 38;

            const slotCard = this.add.graphics();
            slotCard.fillStyle(0x1e293b, 0.9);
            slotCard.fillRoundedRect(startX, startY, 320, 34, 6);
            slotCard.lineStyle(2, s.item ? s.item.rarityColor : 0x475569, 1.0);
            slotCard.strokeRoundedRect(startX, startY, 320, 34, 6);
            this.container.add(slotCard);

            let itemText = '(Empty)';
            let colorStr = '#64748b';
            if (s.item) {
                const rank = this.player.getItemMasteryRank(s.item.name);
                const rankStr = rank > 1 ? ` ⭐R${rank}` : '';
                itemText = `[${s.item.rarity}] ${s.item.name}${rankStr}`;
                colorStr = '#' + s.item.rarityColor.toString(16).padStart(6, '0');
            }

            const txt = this.add.text(startX + 12, startY + 17, `${s.label}: ${itemText}`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: colorStr, fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            this.container.add(txt);

            if (s.item) {
                const hit = this.add.rectangle(startX + 160, startY + 17, 320, 34, 0x000000, 0.001).setInteractive({ useHandCursor: true });
                hit.on('pointerdown', () => {
                    this.selectedItem = s.item;
                    this.renderInventoryModal();
                });
                this.container.add(hit);

                const unequipBtn = this.add.text(startX + 305, startY + 17, '❌', {
                    fontFamily: 'sans-serif', fontSize: '12px'
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

                unequipBtn.on('pointerdown', (e: Phaser.Input.Pointer) => {
                    e.event.stopPropagation();
                    this.player.unequipSlot(s.key);
                    this.selectedItem = null;
                    AudioManager.getInstance().playItemPickup();
                    this.renderInventoryModal();
                });
                this.container.add(unequipBtn);
            }
        });

        // 2. Bag Items Section Header & Pagination Bar
        const filteredList = this.getFilteredInventory();
        const totalPages = Math.max(1, Math.ceil(filteredList.length / this.itemsPerPage));
        if (this.currentPage >= totalPages) this.currentPage = totalPages - 1;
        if (this.currentPage < 0) this.currentPage = 0;

        const headerY = -h / 2 + 154;

        const invTitle = this.add.text(-w / 2 + 30, headerY, `BAG ITEMS (${filteredList.length}/${this.player.inventory.length})`, {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#facc15', fontStyle: 'bold'
        });
        this.container.add(invTitle);

        // Pagination Controls on Section Header
        if (totalPages > 1) {
            const pageTxt = this.add.text(w / 2 - 120, headerY, `Page ${this.currentPage + 1}/${totalPages}`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#38bdf8', fontStyle: 'bold'
            }).setOrigin(0.5);

            const prevBtn = this.add.rectangle(w / 2 - 185, headerY, 48, 22, this.currentPage > 0 ? 0x0284c7 : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            prevBtn.setStrokeStyle(1, 0x38bdf8);
            const prevTxt = this.add.text(w / 2 - 185, headerY, '◀ Prev', {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            prevBtn.on('pointerdown', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    AudioManager.getInstance().playMove();
                    this.renderInventoryModal();
                }
            });

            const nextBtn = this.add.rectangle(w / 2 - 55, headerY, 48, 22, this.currentPage < totalPages - 1 ? 0x0284c7 : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            nextBtn.setStrokeStyle(1, 0x38bdf8);
            const nextTxt = this.add.text(w / 2 - 55, headerY, 'Next ▶', {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            nextBtn.on('pointerdown', () => {
                if (this.currentPage < totalPages - 1) {
                    this.currentPage++;
                    AudioManager.getInstance().playMove();
                    this.renderInventoryModal();
                }
            });

            this.container.add([pageTxt, prevBtn, prevTxt, nextBtn, nextTxt]);
        }

        // 3. Filter Controls Section (Centered & Placed Below Title Bar)
        const filterTypeY = -h / 2 + 184;

        const typeLbl = this.add.text(-w / 2 + 30, filterTypeY, 'TYPE:', {
            fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.container.add(typeLbl);

        const typeOptions = [
            { id: 'ALL', label: 'All Types' },
            { id: 'WEAPON', label: 'Weapons' },
            { id: 'ARMOR', label: 'Armor' },
            { id: 'RING', label: 'Rings' },
            { id: 'SCROLL', label: 'Scrolls' }
        ];

        typeOptions.forEach((opt, idx) => {
            const posX = -w / 2 + 120 + idx * 72;
            const isSel = this.typeFilter === opt.id;
            const btn = this.add.rectangle(posX, filterTypeY, 66, 22, isSel ? 0x0284c7 : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            btn.setStrokeStyle(1, isSel ? 0x38bdf8 : 0x475569);

            const txt = this.add.text(posX, filterTypeY, opt.label, {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: isSel ? '#ffffff' : '#94a3b8', fontStyle: 'bold'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.typeFilter = opt.id;
                this.currentPage = 0;
                AudioManager.getInstance().playMove();
                this.renderInventoryModal();
            });

            this.container.add([btn, txt]);
        });

        // Rarity Filter Row
        const filterRarityY = -h / 2 + 212;

        const rLbl = this.add.text(-w / 2 + 30, filterRarityY, 'RARITY:', {
            fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.container.add(rLbl);

        const rarityOptions = ['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

        rarityOptions.forEach((rOpt, idx) => {
            const posX = -w / 2 + 120 + idx * 84;
            const isSel = this.rarityFilter === rOpt;
            const btn = this.add.rectangle(posX, filterRarityY, 78, 22, isSel ? 0x7c3aed : 0x1e293b, 1.0).setInteractive({ useHandCursor: true });
            btn.setStrokeStyle(1, isSel ? 0xc084fc : 0x475569);

            const txt = this.add.text(posX, filterRarityY, rOpt, {
                fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: isSel ? '#ffffff' : '#94a3b8', fontStyle: 'bold'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.rarityFilter = rOpt;
                this.currentPage = 0;
                AudioManager.getInstance().playMove();
                this.renderInventoryModal();
            });

            this.container.add([btn, txt]);
        });

        // 4. Render Bag Items Grid
        const gridStartY = -h / 2 + 242;

        if (filteredList.length === 0) {
            const emptyTxt = this.add.text(0, gridStartY + 25, '(No items match selected Type & Rarity filters)', {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#64748b'
            }).setOrigin(0.5);
            this.container.add(emptyTxt);
        } else {
            const pageItems = filteredList.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);

            pageItems.forEach((item, idx) => {
                const col = idx % 2;
                const row = Math.floor(idx / 2);

                const posX = -w / 2 + 30 + col * 340;
                const posY = gridStartY + row * 34;

                const itemCard = this.add.graphics();
                const isSelected = this.selectedItem?.id === item.id;

                itemCard.fillStyle(isSelected ? 0x0284c7 : 0x1e293b, 0.9);
                itemCard.fillRoundedRect(posX, posY, 320, 30, 6);
                itemCard.lineStyle(2, item.rarityColor, 1.0);
                itemCard.strokeRoundedRect(posX, posY, 320, 30, 6);
                this.container.add(itemCard);

                const rank = this.player.getItemMasteryRank(item.name);
                const rankBadge = rank > 1 ? ` ⭐R${rank}` : '';
                const colorStr = '#' + item.rarityColor.toString(16).padStart(6, '0');

                const btnTxt = this.add.text(posX + 10, posY + 15, `• ${item.name}${rankBadge}`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: colorStr, fontStyle: 'bold'
                }).setOrigin(0, 0.5);
                this.container.add(btnTxt);

                const hit = this.add.rectangle(posX + 160, posY + 15, 320, 30, 0x000000, 0.001).setInteractive({ useHandCursor: true });
                hit.on('pointerdown', () => {
                    this.selectedItem = item;
                    this.renderInventoryModal();
                });
                this.container.add(hit);
            });
        }

        // 5. Selected Item Details Inspection Card
        const inspectCard = this.add.graphics();
        inspectCard.fillStyle(0x0f172a, 0.95);
        inspectCard.fillRoundedRect(-w / 2 + 30, h / 2 - 145, w - 60, 110, 8);
        inspectCard.lineStyle(2, this.selectedItem ? this.selectedItem.rarityColor : 0x38bdf8, 0.8);
        inspectCard.strokeRoundedRect(-w / 2 + 30, h / 2 - 145, w - 60, 110, 8);
        this.container.add(inspectCard);

        if (this.selectedItem) {
            const item = this.selectedItem;
            const rank = this.player.getItemMasteryRank(item.name);
            const masteryMult = 1 + 0.20 * (rank - 1);

            const atkEff = Math.round(item.atkBonus * masteryMult);
            const defEff = Math.round(item.defBonus * masteryMult);
            const hpEff = Math.round(item.hpBonus * masteryMult);
            const mpEff = Math.round(item.mpBonus * masteryMult);

            const statsStr = `ATK: +${atkEff} | DEF: +${defEff} | HP: +${hpEff} | MP: +${mpEff}`;

            const nameTxt = this.add.text(-w / 2 + 45, h / 2 - 137, `[${item.rarity}] ${item.name} (${item.type})  ⭐Rank ${rank}`, {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#' + item.rarityColor.toString(16).padStart(6, '0'), fontStyle: 'bold'
            });

            const statTxt = this.add.text(-w / 2 + 45, h / 2 - 119, `${statsStr} (${Math.round((masteryMult - 1) * 100)}% Mastery Bonus)`, {
                fontFamily: 'monospace', fontSize: '11px', color: '#a7f3d0', fontStyle: 'bold'
            });

            const descTxt = this.add.text(-w / 2 + 45, h / 2 - 101, item.description, {
                fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#cbd5e1', lineSpacing: 1, wordWrap: { width: w - 250 }
            });

            this.container.add([nameTxt, statTxt, descTxt]);

            if (item.passive) {
                const passY = descTxt.y + descTxt.height + 4;
                const passTxt = this.add.text(-w / 2 + 45, passY, `⚡ PASSIVE: ${item.passive.name} - ${item.passive.description}`, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#facc15', fontStyle: 'bold', wordWrap: { width: w - 250 }
                });
                this.container.add(passTxt);
            }

            const isBagItem = this.player.inventory.some(i => i.id === item.id);
            const duplicates = this.player.inventory.filter(i => i.name === item.name);
            const hasDuplicateItem = item.type !== 'SCROLL' && duplicates.length >= (isBagItem ? 2 : 1);

            if (hasDuplicateItem) {
                const mastBtn = this.add.rectangle(w / 2 - 120, h / 2 - 118, 160, 30, 0xd97706, 1.0).setInteractive({ useHandCursor: true });
                mastBtn.setStrokeStyle(2, 0xfacc15);

                const mastTxt = this.add.text(w / 2 - 120, h / 2 - 118, '⭐ UPGRADE MASTERY', {
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                mastBtn.on('pointerdown', () => {
                    const dupIdx = this.player.inventory.findIndex(i => i.name === item.name && (isBagItem ? i.id !== item.id : true));
                    if (dupIdx !== -1) {
                        this.player.inventory.splice(dupIdx, 1);
                        this.player.incrementItemMastery(item.name);
                        AudioManager.getInstance().playLevelUp();
                    }
                    this.renderInventoryModal();
                });

                this.container.add([mastBtn, mastTxt]);
            }

            if (isBagItem) {
                let actLabel = '🛡️ EQUIP ITEM';
                if (item.type === 'SCROLL') {
                    const isAlreadyLearned = item.spellToLearn && this.player.learnedSpells.includes(item.spellToLearn);
                    actLabel = isAlreadyLearned ? '⭐ UPGRADE SPELL' : '📖 LEARN SPELL';
                }

                const actBtn = this.add.rectangle(w / 2 - 120, h / 2 - 80, 160, 32, 0x059669, 1.0).setInteractive({ useHandCursor: true });
                actBtn.setStrokeStyle(2, 0x34d399);

                const actTxt = this.add.text(w / 2 - 120, h / 2 - 80, actLabel, {
                    fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                actBtn.on('pointerdown', () => {
                    if (item.type === 'SCROLL' && item.spellToLearn) {
                        if (!this.player.learnedSpells.includes(item.spellToLearn)) {
                            this.player.learnedSpells.push(item.spellToLearn);
                            this.player.spellMastery[item.spellToLearn] = 1;
                            AudioManager.getInstance().playLevelUp();
                        } else {
                            this.player.incrementSpellMastery(item.spellToLearn);
                            AudioManager.getInstance().playLevelUp();
                        }

                        const itemIdx = this.player.inventory.findIndex(i => i.id === item.id);
                        if (itemIdx !== -1) this.player.inventory.splice(itemIdx, 1);
                    } else {
                        this.player.equipItem(item);
                        AudioManager.getInstance().playItemPickup();
                    }
                    this.selectedItem = null;
                    this.renderInventoryModal();
                });

                this.container.add([actBtn, actTxt]);
            }
        } else {
            const hintTxt = this.add.text(0, h / 2 - 98, 'Select any gear or bag item above to inspect stats, description & passives', {
                fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#64748b'
            }).setOrigin(0.5);
            this.container.add(hintTxt);
        }

        // Close Hint
        const closeHint = this.add.text(0, h / 2 - 20, '[Press E / ESC / Click Outside to Close]', {
            fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#94a3b8', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(closeHint);
    }

    private close() {
        this.scale.off('resize', this.handleResize, this);
        if (this.onCloseCallback) this.onCloseCallback();
        this.scene.stop();
    }
}
