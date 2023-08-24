import { MostDustResult } from "../implementations/Calculators/MostDustCalculator";
import { Result } from "./ICalculator";

export interface IOutput {
    outputMostDust(result: MostDustResult): Promise<void>;
}