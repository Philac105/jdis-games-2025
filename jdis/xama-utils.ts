import { type Position } from "./index.ts";

const MAP_MAX = 125;

export function getZone20x20(bot: any): string[][] {
    const radius = 10;
    const botPos = bot.position;

    const grid: string[][] = Array.from({ length: 20 }, () => Array(20).fill("void"));

    for (let dx = -radius; dx < radius; dx++) {
        for (let dy = -radius; dy < radius; dy++) {
            const x = botPos.x + dx;
            const y = botPos.y + dy;

            if (x >= 0 && x <= MAP_MAX && y >= 0 && y <= MAP_MAX) {
                grid[dy + radius]![dx + radius] = bot.getGlobalCell({x, y});
            }
        }
    }

    return grid;
}

type Direction = "up" | "down" | "left" | "right";

const directionVectors = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

export function smartMove(bot: any, direction: Direction) {
    const grid = getZone20x20(bot);

    const offset = directionVectors[direction];

    const targetX = bot.position.x + offset.x;
    const targetY = bot.position.y + offset.y;

    const targetCell = grid?.[targetX]?.[targetY];

    if (!targetCell) {
        return bot.doNothing();
    }

    if (targetCell === "firewall" || targetCell === "via") {
        const alternatives = ["left", "right", "up", "down"].filter(dir => dir !== direction) as Direction[];

        for (const altDir of alternatives) {
            const altOffset = directionVectors[altDir];
            const altPosition: Position = {
                x: bot.position.x + altOffset.x,
                y: bot.position.y + altOffset.y
            };

            const altCell = grid?.[altPosition.x]?.[altPosition.y];
            if (altCell !== "firewall" && altCell !== "via") {
                if (altCell === "resistance") {
                    return bot.phase(altDir);
                } else {
                    return bot.move(altPosition);
                }
            }
        }

        return bot.doNothing();
    }
}


