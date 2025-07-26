import type {GameState, Position} from "./types";

type Direction = "up" | "down" | "left" | "right";
export function moveToCenterDirection(playerPosition: { x: number; y: number }): Direction | null {
    const center = { x: 62, y: 62 };
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;

    if (dx === 0 && dy === 0) {
        return null; // Already at center
    }

    // Prioritize horizontal or vertical move if needed
    if (dx !== 0 && dy === 0) {
        return dx === 1 ? "right" : "left";
    }
    if (dy !== 0 && dx === 0) {
        return dy === 1 ? "down" : "up";
    }

    // If both dx and dy are non-zero, pick one direction (e.g., horizontal first)
    return dx === 1 ? "right" : "left";
}

const CENTER = { x: 62, y: 62 };

// Cardinal direction mapping
const directions = [
    { x: 0, y: -1, name: "up" },
    { x: 0, y: 1, name: "down" },
    { x: -1, y: 0, name: "left" },
    { x: 1, y: 0, name: "right" },
];

function posKey(pos: Position) {
    return `${pos.x},${pos.y}`;
}

function isValid(cell: string): boolean {
    return !!cell && cell !== "firewall" && cell !== "via";
}

function getDirection(from: Position, to: Position) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return directions.find(d => d.x === dx && d.y === dy)?.name;
}

// DFS recursive helper
function dfs(bot: any, current: Position, target: Position, path: Position[], visited: Set<string>): boolean {
    if (current.x === target.x && current.y === target.y) return true;

    visited.add(posKey(current));

    for (const dir of directions) {
        const next = { x: current.x + dir.x, y: current.y + dir.y };
        const key = posKey(next);
        if (visited.has(key)) continue;

        const cell = bot.getGlobalCell(next);
        if (!isValid(cell)) continue;

        if (dfs(bot, next, target, path, visited)) {
            path.push(next);
            return true;
        }
    }

    return false;
}

export function goToCenter(gameState: GameState, bot: any, visited: Set<string>) {
    const playerPosition = gameState.player.position;
    const path: Position[] = [];

    if (dfs(bot, playerPosition, CENTER, path, visited)) {
        const nextStep = path[path.length - 1];
        if (!nextStep) return bot.doNothing();

        const cell = bot.getGlobalCell(nextStep);

        const directionName = getDirection(playerPosition, nextStep);
        if (!directionName) return bot.doNothing();

        if (cell === "resistance") {
            bot.phase(directionName);
        } else {
            bot.move({ x: nextStep.x - playerPosition.x, y: nextStep.y - playerPosition.y });
        }
    } else {
        bot.doNothing();
    }
}
