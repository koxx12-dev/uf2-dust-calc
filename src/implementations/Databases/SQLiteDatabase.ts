import { Kysely, SqliteDialect } from "kysely";
import { IDatabase } from "../../interfaces/IDatabase";
import Database from "better-sqlite3";
import { DB } from "../../db/types";
import { Enemy, Item } from "../../types";
import { App } from "../../App";

export class SQLiteDatabase implements IDatabase {
    private db: Kysely<DB>
    private Logger = App.Logger.getSubLogger({ name: "SQLiteDatabase" });

    constructor(dbPath: string) {
        this.Logger.debug(`Using database at ${dbPath}`);
        const dialect = new SqliteDialect({
            database: new Database(dbPath, {
                readonly: true,
                verbose: (msg) => this.Logger.trace(msg),
            }),
        });

        this.db = new Kysely<DB>({
            dialect,
        });
    }

    getEnemies(): Promise<Enemy[]> {
        this.Logger.debug("Getting enemies")
        return this.db.selectFrom('enemies')
            .selectAll()
            .execute();
    }

    getBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .execute();
    }

    getItems(): Promise<Item[]> {
        this.Logger.debug("Getting items")
        return this.db.selectFrom('items')
            .selectAll()
            .execute();
    }

    getEnemyFromName(name: string): Promise<Enemy | undefined> {
        this.Logger.debug(`Getting enemy from name ${name}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('name', '=', name)
            .executeTakeFirst();
    }

    getItemFromName(name: string): Promise<Item | undefined> {
        this.Logger.debug(`Getting item from name ${name}`)
        return this.db.selectFrom('items')
            .selectAll()
            .where('name', '=', name)
            .executeTakeFirst();
    }

    getSurvivalBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting survival bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_survival', '=', 1)
            .execute();
    }

    getNonSurvivalBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting non survival bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_survival', '=', 0)
            .execute();
    }

    getRngBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting rng bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_rng', '=', 1)
            .execute();
    }

    getNonRngBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting non rng bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_rng', '=', 0)
            .execute();
    }

    getNonSurvivalNonRngBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting non survival non rng bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_survival', '=', 0)
            .where('is_rng', '=', 0)
            .execute();
    }

    getSurvivalRngBosses(): Promise<Enemy[]> {
        this.Logger.debug("Getting survival rng bosses")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('is_survival', '=', 1)
            .where('is_rng', '=', 1)
            .execute();
    }

    getGemEnemies(): Promise<Enemy[]> {
        this.Logger.debug("Getting gem enemies")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('gems', '>', 0)
            .execute()
    }

    getDustEnemies(): Promise<Enemy[]> {
        this.Logger.debug("Getting dust enemies")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('dust', '>', 0)
            .execute()
    }

    getTimelineEnemies(): Promise<Enemy[]> {
        this.Logger.debug("Getting timeline enemies")
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('timelines', '>', 0)
            .execute()
    }

    getSpecificEnemies(isBoss: boolean, isSurvival: boolean, isRng: boolean): Promise<Enemy[]> {
        this.Logger.debug(`Getting specific enemies isBoss: ${isBoss} isSurvival: ${isSurvival} isRng: ${isRng}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', isBoss ? 1 : 0)
            .where('is_survival', '=', isSurvival ? 1 : 0)
            .where('is_rng', '=', isRng ? 1 : 0)
            .execute()
    }

    getFuzzyEnemies(onlyBosses: boolean, killSurvival: boolean, killRng: boolean): Promise<Enemy[]> {
        this.Logger.debug(`Getting fuzzy enemies onlyBosses: ${onlyBosses} killSurvival: ${killSurvival} killRng: ${killRng}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '>=', onlyBosses ? 1 : 0)
            .where('is_survival', '<=', killSurvival ? 1 : 0)
            .where('is_rng', '<=', killRng ? 1 : 0)
            .execute()
    }

    getEnemiesWithTimelines(timeline: number): Promise<Enemy[]> {
        this.Logger.debug(`Getting enemies with timeline ${timeline}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('timelines', '<=', timeline)
            .execute()
    }

    getBossesWithTimelines(timeline: number): Promise<Enemy[]> {
        this.Logger.debug(`Getting bosses with timeline ${timeline}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('timelines', '<=', timeline)
            .execute()
    }

    getEnemiesWithLevel(timeline: number): Promise<Enemy[]> {
        this.Logger.debug(`Getting enemies with level ${timeline}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('level', '<=', timeline)
            .execute()
    }

    getBossesWithLevel(timeline: number): Promise<Enemy[]> {
        this.Logger.debug(`Getting bosses with level ${timeline}`)
        return this.db.selectFrom('enemies')
            .selectAll()
            .where('is_boss', '=', 1)
            .where('level', '<=', timeline)
            .execute()
    }
}

