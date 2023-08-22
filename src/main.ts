import * as csv from "csv";
import prompts from "prompts";
import { bgRed, cyan, gray, green, magenta, yellow } from "colors";
import { Bundlee } from "bundlee";

type Enemy = {
  name: string;
  //location of the enemy
  location: string;
  //level required to kill
  level: number;
  //timelines required to kill
  timelines: number;
  //dust drop
  dust: number;
  //gem drop
  gems: number;
};
type BossKill = {
  name: string;
  location: string;
  count: number;
};
type PromptResponse = {
  level: number,
  dust: number,
  timelines: number,
  targetDust: number,
  path: string,
}

const levelGates = [
  0, //1
  10, // 2
  25, //3
  50, //4
  75, //5
  100, //6
  125, //7
  175, //8
  225, //9
  300, //10
  350, //11
  400, //12
  450, //13
  500, //14
  550, //15
  600, //16
  650, //17
  700, //18
  750, //19
  900, //20
  1000, //21
  1100, //22
  1200, //23
  1300, //24
  1400, //25
  1500, //26
  1600, //27
  1700, //28
  1800, //29
  2000, //30
  2200, //31
  2400, //32
  2600, //33
  2800, //34
  3000, //35
  3200, //36
  3400, //37
  3600, //38
  3800, //39
  4000, //40
  4500, //41
  5000, //42
  5500, //43
  6000, //44
  6500, //45
  7000, //46
  7500, //47
  8500, //48
  9000, //49
  10000, //50
  11000, //51
  12000, //52
  13000, //53
  14000, //54
  15000, //55
  16000, //56
  17000, //57
  18000, //58
  19000, //59
  24000, //60
  26000, //61
  28000, //62
  30000, //63
  32000, //64
  34000, //65
  36000, //66
  38000, //67
  40000, //68
  42000, //69
  50000, //70
  55000, //71
  60000, //72
  70000, //73
  75000, //74
  80000, //75
  90000, //76
  100000, //77
  105000, //78
  110000, //79
  120000, //80
  130000, //81
  140000, //82
  150000, //83
  160000, //84
  170000, //85
  180000, //86
  190000, //87
  200000, //88
  210000, //89
  250000, //90
  320000, //91
  360000, //92
  380000, //93
  400000, //94
  450000, //95
  480000, //96
  520000, //97
  570000, //98
  620000, //99
  750000, //100
];

const inDev = Deno.args.includes("--dev");
const inDebug = Deno.args.includes("--debug");

// prompts.inject([1, 0, 0, 351, 'custom'])

const staticData = inDev
  ? await Bundlee.load("bundles/data.json")
  : await Bundlee.load("URL HERE SOON ISH", "fetch");

const questions = [
  {
    type: "number",
    message: "What is your current level?",
    name: "level",
    initial: 1,
  },
  {
    type: "number",
    message: "How much dust do you have?",
    name: "dust",
    initial: 0,
  },
  {
    type: "number",
    message: "How many timelines do you have?",
    name: "timelines",
    initial: 0,
  },
  {
    type: "number",
    message: "How much dust do you want?",
    name: "targetDust",
    initial: 750000,
  },
  {
    type: "select",
    name: "path",
    message: "Which path do you want to take?",
    choices: [
      { title: "Fastest", value: "fastest" },
      { title: "No survival", value: "no surv" },
      { title: "All", value: "all" },
      { title: "Custom", value: "custom" },
    ],
  },
];

async function getData(path: string, local: boolean): Promise<string> {
  if (local) {
    if (!await Deno.stat(csvFilePath)) {
      console.error(bgRed(`No file found in "${path}"!`));
      await waitForEnter();
      Deno.exit();
    }
    return await Deno.readTextFile(path);
  } else {
    if (!staticData.has(path)) {
      console.log(bgRed(`${path} is missing in static data!`));
      await waitForEnter();
      Deno.exit();
    }
    return (await staticData.get(path)).content;
  }
}

function debugPrint(message: any) {
  if (inDebug) {
    console.log(message);
  }
}

function getDustToNextLevel(level: number) {
  if (level < 100) {
    // console.log(`${level+1}: ${levelGates[level]}`);
    return levelGates[level];
  } else {
    // console.log(`${level+1}: ${(Math.pow(level+1, 3.3)*1.3)-4500000}`);
    return (Math.pow(level + 1, 3.3) * 1.3) - 4500000;
  }
}

async function waitForEnter() {
  await prompts({
    type: "text",
    name: "exit",
    message: "Press enter to exit",
  });
}

const response: PromptResponse = await prompts(questions);

if (!response) Deno.exit();

let currentLevel = response.level;
let currentDust = response.dust;

const timelines = response.timelines;
const targetDust = response.targetDust;
const csvFilePath = response.path == "custom"
  ? `${Deno.cwd()}/data/bosses.csv`
  : `data/${response.path}.csv`;

const fileContent = await getData(csvFilePath, response.path == "custom")

// console.log(`loading ${csvFilePath}`);
const raw = csv.parse(fileContent, {
  columns: ["name", "location", "level", "timelines", "xp", "gems"],
});

const data = raw.map((row) => {
  return {
    name: row.name,
    location: row.location,
    level: parseInt(row.level),
    timelines: parseInt(row.timelines),
    dust: parseInt(row.xp),
    gems: parseInt(row.gems),
  };
});

const bosses = new Array<Enemy>();

//get the fastest path to the target dust, accounting for the current level
while (currentDust < targetDust) {
  let nextEnemy: Enemy | undefined;

  debugPrint(magenta(`\nCurrent level: ${yellow(currentLevel.toString())}`));

  data.forEach((boss) => {
    if (
      boss.level <= currentLevel &&
      (!nextEnemy || nextEnemy.dust < boss.dust) &&
      boss.timelines <= timelines
    ) {
      nextEnemy = boss;
    }
    debugPrint(
      green(
        `Boss ${yellow(boss.name)}, (${
          yellow((boss.level <= currentLevel).toString())
        }, ${yellow((boss.timelines <= timelines).toString())})`,
      ),
    );
  });

  if (nextEnemy) {
    debugPrint(magenta(`Chose ${yellow(nextEnemy.name)}`));
    // console.log(`Killing ${nextEnemy.name} at level ${currentLevel} for ${nextEnemy.dust} dust and ${nextEnemy.gems} gems`);
    bosses.push(nextEnemy);
    currentDust += nextEnemy.dust;
    debugPrint(
      magenta(
        `Current dust: ${yellow(currentDust.toString())}, dust to next level: ${
          yellow(getDustToNextLevel(currentLevel).toString())
        }`,
      ),
    );
    while (getDustToNextLevel(currentLevel) <= currentDust) {
      currentLevel++;
      debugPrint(magenta(`Leveling up to ${yellow(currentLevel.toString())}`));
      debugPrint(
        magenta(
          `Current dust: ${yellow(currentDust.toString())}, dust to next level: ${
            yellow(getDustToNextLevel(currentLevel).toString())
          }`,
        ),
      );
    }
  } else {
    console.error(bgRed(`No enemy found for level ${currentLevel}`));
    break;
  }
}

console.log(magenta(`\nSummary:`));
console.log(green(`Target dust: ${yellow(targetDust.toString())}\n`));

console.log(green(`Result dust: ${yellow(currentDust.toString())}`));
console.log(green(`Result level: ${yellow(currentLevel.toString())}\n`));

console.log(green(`Timelines: ${yellow(timelines.toString())}\n`));

console.log(magenta(`Steps:`));
//compress the output format to boss name and number of kills
const output = new Array<BossKill>();
bosses.forEach((boss) => {
  const bossKill = output.find((b) => b.name === boss.name);
  if (bossKill) {
    bossKill.count++;
  } else {
    output.push({ name: boss.name, location: boss.location, count: 1 });
  }
});

let lastLocation = "";

output.forEach((boss) => {
  if (lastLocation == "") {
    console.log(cyan(`Spawn at ${yellow(boss.location)}`));
    lastLocation = boss.location;
  } else if (boss.location !== lastLocation) {
    console.log(cyan(`Go to ${yellow(boss.location)}`));
    lastLocation = boss.location;
  }
  console.log(
    green(`${boss.name} ${gray("x")}${yellow(boss.count.toString())}`),
  );
});

await waitForEnter();
