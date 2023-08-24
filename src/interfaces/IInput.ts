import { MostDustInput } from "../implementations/Calculators/MostDustCalculator";

export type Input = {
    visibleActions: string[]
}

export interface IInput {
    getCalculatorMode(): Promise<string>;
    getMostDustData(): Promise<MostDustInput>;
    waitForInput(): Promise<void>;
}