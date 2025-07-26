import {type CardinalDirection, type GameState, type Position} from "./index.ts";

const MAP_MAX = 125;
const GRID_RADIUS = 10;

export function getZone20x20(gameState: GameState, bot: any): string[][] {
    const grid: string[][] = Array.from({ length: 20 }, () => Array(20).fill("void"));

    for (let dx = -GRID_RADIUS; dx < GRID_RADIUS; dx++) {
        for (let dy = -GRID_RADIUS; dy < GRID_RADIUS; dy++) {
            const x = gameState.player.position.x + dx;
            const y = gameState.player.position.y + dy;

            if (x >= 0 && x <= MAP_MAX && y >= 0 && y <= MAP_MAX) {
                grid[dx + GRID_RADIUS]![dy + GRID_RADIUS] = bot.getGlobalCell({x, y});
            }
        }
    }

    return grid;
}

const directionVectors = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

export function smartMove(gameState: GameState, bot: any, direction: CardinalDirection) {
    const player = gameState.player;

    const offset = directionVectors[direction];

    const targetPosition: Position = {
        x: player.position.x + offset.x,
        y: player.position.y + offset.y
    };

    const targetCell = bot.getCell(targetPosition);
    console.log('targetPosition:', targetPosition);
    console.log("Target cell:", targetCell);

    if (!targetCell || targetCell === "firewall" || targetCell === "via") {
        const alternatives: CardinalDirection[] = ["left", "right", "up", "down"];

        for (const altDir of alternatives) {
            const altOffset = directionVectors[altDir];
            const altPosition: Position = {
                x: player.position.x + altOffset.x,
                y: player.position.y + altOffset.y
            };

            const altCell = bot.getCell(altPosition);
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

    if (targetCell === "resistance") {
        return bot.phase(direction);
    } else {
        return bot.move(targetPosition);
    }
}

function manhattanDistance(a: Position, b: Position): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function findClosestPlayer(gameState: GameState) {
    const myPos = gameState.player.position;

    let closestPlayer = null;
    let minDist = Infinity;

    for (const other of gameState.enemies) {
        if (other.hp <= 0) continue;     // skip dead bots

        const dist = manhattanDistance(myPos, other.position);
        if (dist < minDist) {
            minDist = dist;
            closestPlayer = other;
        }
    }

    return closestPlayer;
}


