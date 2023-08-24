import path from "path";
import { MostDustCalculator } from "./implementations/Calculators/MostDustCalculator";
import { SQLiteDatabase } from "./implementations/Databases/SQLiteDatabase";
import { PromptsInput } from "./implementations/Inputs/PromptsInput";
import { TerminalOutput } from "./implementations/Outputs/TerminalOutput";
import { MockInput } from "./implementations/Inputs/MockInput";
import { ILogObj, Logger } from "tslog";

export class App {
    public static Logger: Logger<ILogObj> = new Logger({ minLevel: process.env.TRACE ? 1 : process.env.DEBUG ? 2 : 4, hideLogPositionForProduction: true });

    public start() {
        const db = new SQLiteDatabase(path.join(process.cwd(), "bosses.db"));
        const input = new PromptsInput();
        const mostDust = new MostDustCalculator(db, input);
        const output = new TerminalOutput(input);

        input.getCalculatorMode().then(mode => {
            switch (mode) {
                case 'mostDust':
                    mostDust.calculate().then(result => {
                        output.outputMostDust(result);
                    });
                    break;
                default:
                    App.Logger.error("Invalid calculator mode");
                    process.exit(1);
            }
        });
    }
}