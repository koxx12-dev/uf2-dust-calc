export type Box = {
    item_name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    item_slot: 'Primary' | 'Secondary' | 'Extra';
    /**
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell')
     */
    location: 'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell';
};

export type Enemy = {
    name: string;
    /**
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Main Menu')
     */
    location: 'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Main Menu';
    level: number;
    timelines: number;
    dust: number;
    gems: number;
    is_boss: number;
    is_survival: number;
    is_rng: number;
    is_event: number;
    origin_event: string | null;
    is_dlc_required: number;
};

export type EnemyDroppedItems = {
    item_name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    item_slot: 'Primary' | 'Secondary' | 'Extra';
    enemy_name: string;
    drop_chance: number;
    drop_amount_min: number;
    drop_amount_max: number;
};

export type Item = {
    name: string;
    /**
     * @kyselyType('Primary' | 'Secondary' | 'Extra')
     */
    slot: 'Primary' | 'Secondary' | 'Extra';
    is_celestial: number;
    /**
     * @kyseleyType('Nova' | 'Eclipse' | 'Heaven' | 'Healing' | 'Master' | 'Tem')
     */
    celestial_type: string | null;
    is_obtainable: number;
    is_event: number;
    /**
     * @kyselyType('red_key_hunt')
     */
    origin_event: 'red_key_hunt' | null;
    is_dlc_required: number;
    is_golden: number;
};

export type Shop = {
    name: string;
    /**>
     * @kyselyType('Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Timeline Room')
     */
    location: 'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell' | 'Timeline Room';
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
    currency: 'gems' | 'super jumps';
    price: number;
};