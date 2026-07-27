import { Entity } from './Entity';
import { MonsterTemplate } from './Bestiary';

export class Monster extends Entity {
    public template: MonsterTemplate;
    public expReward: number;

    constructor(template: MonsterTemplate, x: number, y: number, floorMultiplier: number = 1.0) {
        const hp = Math.round(template.baseHp * floorMultiplier);
        const mp = Math.round(template.baseMp * floorMultiplier);
        const atk = Math.round(template.baseAtk * floorMultiplier);
        const def = Math.round(template.baseDef * floorMultiplier);

        super(
            `${template.id}_${Date.now()}_${Math.random()}`,
            template.name,
            x, y,
            hp, mp, atk, def
        );

        this.template = template;
        this.expReward = Math.round(template.expReward * floorMultiplier);
    }
}
