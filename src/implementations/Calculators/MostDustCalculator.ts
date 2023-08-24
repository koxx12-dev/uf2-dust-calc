import { Enemy } from "../../types";
import { Result, ICalculator } from "../../interfaces/ICalculator";
import { IDatabase } from "../../interfaces/IDatabase";
import { IInput, Input } from "../../interfaces/IInput";
import { LevelUtils } from "../../utils/LevelUtils";
import { App } from "../../App";

export type MostDustResult = Result & {
    startingLevel: number,
    startingDust: number,

    targetLevel: number,
    targetDust: number,

    resultLevel: number,
    resultDust: number,
}

export type MostDustInput = Input & {
    startingLevel: number,
    startingDust: number,

    targetType: 'level' | 'dust',
    targetValue: number,

    timelines: number,

    killSurvival: boolean,
    killRng: boolean,
    killBosses: boolean,
}

export class MostDustCalculator implements ICalculator {
    private Logger = App.Logger.getSubLogger({ name: "MostDustCalc" })

    constructor(private db: IDatabase, private input: IInput) { }

    async calculate(): Promise<MostDustResult> {
        const input = await this.input.getMostDustData();

        this.Logger.debug("got input", input)

        const enemies = (await this.db.getFuzzyEnemies(input.killBosses, input.killSurvival, input.killRng)).filter(e => e.dust > 0)
        const result: MostDustResult = {
            startingLevel: input.startingLevel,
            startingDust: input.startingDust,

            targetDust: input.targetType == 'dust' ? input.targetValue : LevelUtils.levelToDust(input.targetValue),
            targetLevel: input.targetType == 'level' ? input.targetValue : LevelUtils.dustToLevel(input.targetValue),

            resultDust: 0,
            resultLevel: 0,

            actions: [],
            visibleActions: input.visibleActions,
            executionTime: 0,
        }

        let currentLevel = input.startingLevel;
        let currentDust = input.startingDust;

        let currentLocation = undefined;
        let prevLevel = currentLevel;

        this.Logger.debug(`starting with`, result)
        const executionTimeStart = process.hrtime.bigint();

        while (currentDust < result.targetDust) {
            var nextEnemy: Enemy | undefined;

            enemies.forEach(enemy => {
                if (enemy.level <= currentLevel && (!nextEnemy || nextEnemy.dust < enemy.dust) && enemy.timelines <= input.timelines) {
                    nextEnemy = enemy;
                }
            });

            if (nextEnemy) {
                this.Logger.debug(`found optimal enemy ${nextEnemy.name}`)
                if (nextEnemy.location != currentLocation) {
                    result.actions.push({
                        type: 'travel',
                        location: nextEnemy.location,
                    });
                    currentLocation = nextEnemy.location;
                    this.Logger.debug(`traveling to ${nextEnemy.location}`)
                }

                result.actions.push({
                    type: 'kill',
                    enemy: nextEnemy.name,
                });
                this.Logger.debug(`killed, ${nextEnemy.name}!`)

                currentDust += nextEnemy.dust;
                while (LevelUtils.levelToDust(currentLevel + 1) <= currentDust) {
                    currentLevel++;
                }

                if (prevLevel != currentLevel) {
                    result.actions.push({
                        type: 'level',
                        level: currentLevel,
                        dust: currentDust,
                    });
                    this.Logger.debug(`got to level, ${currentLevel}`)
                    prevLevel = currentLevel;
                }
            } else {
                this.Logger.debug("next enemy wasnt selected, breaking out")
                break;
            }
        }
        const executionTimeEnd = process.hrtime.bigint();

        result.executionTime = Number(executionTimeEnd - executionTimeStart) / 1000000;
        result.resultLevel = currentLevel
        result.resultDust = currentDust

        this.Logger.debug(`ended with`, result)

        return result;
    }
}