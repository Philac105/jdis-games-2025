import type { GameState, Position } from "./types";

type Direction = "up" | "down" | "left" | "right";

export function moveToCenterDirection(playerPosition: Position): Direction | null {
    const center = { x: 62, y: 62 };
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;

    if (dx === 0 && dy === 0) return null;
    if (dx !== 0) return dx === 1 ? "right" : "left";
    return dy === 1 ? "down" : "up";
}

const CENTER = { x: 62, y: 62 };

const directions = [
    { x: 0, y: -1, name: "up" },
    { x: 0, y: 1, name: "down" },
    { x: -1, y: 0, name: "left" },
    { x: 1, y: 0, name: "right" },
];

function posKey(pos: Position): string {
    return `${pos.x},${pos.y}`;
}

function isValid(cell: string): boolean {
    return !!cell && cell !== "firewall" && cell !== "via";
}

function getDirection(from: Position, to: Position): string | null {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return directions.find(d => d.x === dx && d.y === dy)?.name ?? null;
}

function bfs(bot: any, start: Position, goal: Position): Position[] {
    const queue: Position[] = [start];
    const visited = new Set<string>([posKey(start)]);
    const cameFrom = new Map<string, Position>();

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.x === goal.x && current.y === goal.y) {
            const path: Position[] = [];
            let cur = current;
            while (posKey(cur) !== posKey(start)) {
                path.push(cur);
                cur = cameFrom.get(posKey(cur))!;
            }
            path.reverse();
            return path;
        }

        for (const dir of directions) {
            const next = { x: current.x + dir.x, y: current.y + dir.y };
            const key = posKey(next);
            if (visited.has(key)) continue;

            const cell = bot.getGlobalCell(next);
            if (!isValid(cell)) continue;

            queue.push(next);
            visited.add(key);
            cameFrom.set(key, current);
        }
    }

    return [];
}

export function goToCenter(gameState: GameState, bot: any) {
    const playerPosition = gameState.player.position;
    const path = bfs(bot, playerPosition, CENTER);

    if (path.length === 0) {
        // Fallback: try any step toward center, even if blocked
        const fallback = moveToCenterDirection(playerPosition);
        if (fallback) return bot.phase(fallback);
        else return bot.doNothing();
    }

    const nextStep = path[0];
    const direction = getDirection(playerPosition, nextStep!);
    if (!direction) return bot.doNothing();

    const cell = bot.getGlobalCell(nextStep);
    if (cell === "resistance") {
        return bot.phase(direction);
    } else {
        return bot.move(nextStep!);
    }
}
