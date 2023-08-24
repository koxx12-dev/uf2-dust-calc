import { App } from "../../App";
import { Actions, Result } from "../../interfaces/ICalculator";
import { IOutput } from "../../interfaces/IOutput";
import { yellow, green, gray, magenta, cyan, bgRed } from "kleur";
import { MostDustResult } from "../Calculators/MostDustCalculator";
import { IInput } from "../../interfaces/IInput";

export class TerminalOutput implements IOutput {
    private Logger = App.Logger.getSubLogger({ name: "TerminalOutput" })

    constructor(private input: IInput) { }

    async outputMostDust(result: MostDustResult): Promise<void> {
        if (!result) {
            console.error(bgRed(`No result`));
            await this.input.waitForInput();
            return;
        }

        if (result.targetDust > result.resultDust) {
            console.error(bgRed(`Failed to reach target dust, reached ${result.resultDust} dust, please fix the database`));
            await this.input.waitForInput();
            return;
        }
        console.log(magenta(`Calculation took ${yellow(result.executionTime)}ms`));

        console.log(magenta(`\nSummary:`));
        console.log(green(`Target level: ${yellow(result.targetLevel)}`));
        console.log(green(`Target dust: ${yellow(result.targetDust)}\n`));

        console.log(green(`Result level: ${yellow(result.resultLevel)}`));
        console.log(green(`Result dust: ${yellow(result.resultDust)}\n`));

        console.log(magenta(`Steps:`));

        const compressedActions = new Array<Actions>();

        result.actions
            .filter(v => result.visibleActions.includes(v.type))
            .forEach(v => {
                if (v.type === "kill") {
                    // if the same enemy is killed multiple times in a row, compress them into one and add the amount
                    const lastAction = compressedActions[compressedActions.length - 1];
                    if (lastAction && lastAction.type === "kill" && lastAction.enemy === v.enemy) {
                        lastAction.count = (lastAction.count || 1) + 1;
                    } else {
                        compressedActions.push(v);
                    }
                } else {
                    compressedActions.push(v);
                }
            });

        this.Logger.debug(`compressed actions`, compressedActions);

        compressedActions
            .forEach(action => {
                switch (action.type) {
                    case 'kill':
                        console.log(green(`${action.enemy} ${gray("x")}${yellow(action.count ?? 1)}`));
                        break;
                    case 'level':
                        console.log(cyan(`Level up to ${yellow(action.level)}`));
                        break;
                    case 'timeline':
                        console.log(magenta(`Jumped a timeline`))
                        break;
                    case 'travel':
                        console.log(cyan(`Go to ${yellow(action.location)}`));
                        break;
                }
            })
        await this.input.waitForInput();
    }
}