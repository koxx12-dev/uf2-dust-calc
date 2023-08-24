import prompts, { PromptObject } from "prompts";
import { IInput } from "../../interfaces/IInput";
import kleur from "kleur";
import { App } from "../../App";
import { MostDustInput } from "../Calculators/MostDustCalculator";
import { LevelUtils } from "../../utils/LevelUtils";

export class PromptsInput implements IInput {

    private Logger = App.Logger.getSubLogger({ name: "PromptsInput" })

    async getCalculatorMode(): Promise<string> {
        const prompt: PromptObject<string>[] = [
            {
                type: 'select',
                name: 'calculator',
                message: 'What calculator do you want to use?',
                choices: [
                    { title: 'Most Dust', value: 'mostDust' },
                ],
                initial: 0
            },
        ];

        const resp = await prompts(prompt, {
            onCancel: () => {
                console.log(kleur.red("Canceled"))
                process.exit(0)
            }
        })

        return resp.calculator;
    }

    async getMostDustData(): Promise<MostDustInput> {
        const prompt: PromptObject<string>[] = [
            {
                type: 'number',
                name: 'startingLevel',
                message: 'What is your current level?',
                initial: 1,
            },
            {
                type: 'number',
                name: 'startingDust',
                message: 'How much dust do you have?',
                initial: 0,
            },
            {
                type: 'select',
                name: 'targetType',
                message: 'What is your target?',
                choices: [
                    { title: 'Level', value: 'level' },
                    { title: 'Dust', value: 'dust' },
                ],
                initial: 0
            },
            {
                type: 'number',
                name: 'targetValue',
                message: prev => `What is your target ${prev}?`,
                initial: (prev) => prev === 'level' ? 100 : LevelUtils.levelToDust(100),
            },
            {
                type: 'number',
                name: 'timelines',
                message: 'How many timelines do you have?',
                initial: 0,
            },
            {
                type: 'multiselect',
                name: 'killTarget',
                message: 'What kind of enemies do you want to kill',
                choices: [
                    { title: 'Survival (eg Asgore)', value: 'travel' },
                    { title: 'RNG (eg Gaster Door)', value: 'rng' },
                    { title: 'Bosses (anything that is a fight)', value: 'boss', selected: true },
                ],
            },
            {
                type: 'multiselect',
                name: 'visibleActions',
                message: 'What actions do you want to see?',
                choices: [
                    { title: 'Travel', value: 'travel', selected: true },
                    { title: 'Kill', value: 'kill', selected: true },
                    { title: 'Level', value: 'level' },
                    { title: 'Timeline', value: 'timeline' },
                ],
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Is this correct?',
            }
        ]

        const resp = await prompts(prompt, {
            onCancel: () => {
                console.log(kleur.red("Canceled"))
                process.exit(0)
            }
        })

        this.Logger.debug("got response", resp)

        if (!resp.confirm) {
            console.log(kleur.red("Exiting"))
            process.exit(0)
        }

        return {
            startingLevel: resp.startingLevel,
            startingDust: resp.startingDust,

            targetType: resp.targetType,
            targetValue: resp.targetValue,

            timelines: resp.timelines,

            killSurvival: resp.killTarget.includes('travel'),
            killRng: resp.killTarget.includes('rng'),
            killBosses: resp.killTarget.includes('boss'),

            visibleActions: resp.visibleActions,
        }
    }

    async waitForInput(): Promise<void> {
        await prompts({
            type: 'invisible',
            name: 'wait',
            message: 'Press enter to continue',
        })
    }
}