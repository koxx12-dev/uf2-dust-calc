export type Result = {
    actions: Actions[],
    visibleActions: string[],
    executionTime: number,
}

export type Actions = KillAction | TimelineAction | TravelAction | LevelAction

type KillAction = {
    type: 'kill',
    enemy: string,
    count?: number,
}

type TimelineAction = {
    type: 'timeline',
}

type TravelAction = {
    type: 'travel',
    location: string,
}

type LevelAction = {
    type: 'level',
    level: number,
    dust: number,
}

export interface ICalculator {
    calculate(): Promise<Result>
}