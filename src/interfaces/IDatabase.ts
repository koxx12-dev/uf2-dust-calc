import { Enemy, Item } from "../types";

type Location = 'Ancient Hall' | 'Undertale' | 'X-Tale' | 'Outertale' | 'Underswap' | 'Underfell'

export interface IDatabase {
    getEnemies(): Promise<Enemy[]>
    getBosses(): Promise<Enemy[]>
    getItems(): Promise<Item[]>

    getEnemyFromName(name: string): Promise<Enemy | undefined>
    getItemFromName(name: string): Promise<Item | undefined>

    getSpecificEnemies(isBoss: boolean, isSurvival: boolean, isRng: boolean): Promise<Enemy[]>
    getFuzzyEnemies(onlyBosses: boolean, killSurvival: boolean, killRng: boolean): Promise<Enemy[]>

    getGemEnemies(): Promise<Enemy[]>
    getDustEnemies(): Promise<Enemy[]>
    getTimelineEnemies(): Promise<Enemy[]>

    getEnemiesWithTimelines(timeline: number): Promise<Enemy[]>
    getBossesWithTimelines(timeline: number): Promise<Enemy[]>

    getEnemiesWithLevel(timeline: number): Promise<Enemy[]>
    getBossesWithLevel(timeline: number): Promise<Enemy[]>
}