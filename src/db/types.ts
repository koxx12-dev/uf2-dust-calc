import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Box = {
    item_name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    item_slot: 'Primary' | 'Secondary' | 'Extra';
    /**
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell')
     */
    location: Generated<'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell'>;
};
export type Enemy = {
    name: string;
    /**
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Main Menu')
     */
    location: Generated<'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Main Menu'>;
    level: Generated<number>;
    timelines: Generated<number>;
    dust: Generated<number>;
    gems: Generated<number>;
    is_boss: Generated<number>;
    is_survival: Generated<number>;
    is_rng: Generated<number>;
    is_event: Generated<number>;
    origin_event: string | null;
    is_dlc_required: Generated<number>;
};
export type EnemyDroppedItems = {
    item_name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    item_slot: 'Primary' | 'Secondary' | 'Extra';
    enemy_name: string;
    drop_chance: Generated<number>;
    drop_amount_min: Generated<number>;
    drop_amount_max: Generated<number>;
};
export type Item = {
    name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    slot: Generated<'Primary' | 'Secondary' | 'Extra'>;
    is_celestial: Generated<number>;
    /**
     * @kyseleyType('Nova' | 'Eclipse' | 'Heaven' | 'Healing' | 'Master' | 'Tem')
     */
    celestial_type: string | null;
    is_obtainable: Generated<number>;
    is_event: Generated<number>;
    /**
     * @kyselyType('red_key_hunt')
     */
    origin_event: 'red_key_hunt' | null;
    is_dlc_required: Generated<number>;
    is_golden: Generated<number>;
};
export type Shop = {
    name: string;
    /**
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Timeline Room')
     */
    location: Generated<'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Timeline Room'>;
};
export type ShopItems = {
    item_name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    item_slot: 'Primary' | 'Secondary' | 'Extra';
    shop_name: string;
    /**
     * @kyselyType('gems' | 'super jumps')
     */
    currency: Generated<'gems' | 'super jumps'>;
    price: Generated<number>;
};
export type DB = {
    boxes: Box;
    enemies: Enemy;
    enemy_drops: EnemyDroppedItems;
    items: Item;
    shop_items: ShopItems;
    shops: Shop;
};
