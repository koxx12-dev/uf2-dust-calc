import { IInput } from "../../interfaces/IInput";
import { MostDustInput } from "../Calculators/MostDustCalculator";

export class MockInput implements IInput {
    async getCalculatorMode(): Promise<string> {
        return 'mostDust'
    }

    async getMostDustData(): Promise<MostDustInput> {
        return {
            startingLevel: 1,
            startingDust: 0,

            targetType: 'level',
            targetValue: 100,

            timelines: 60,

            killSurvival: true,
            killRng: true,
            killBosses: true,

            visibleActions: ['kill', 'travel']
        }
    }

    async waitForInput(): Promise<void> {
        return
    }
}