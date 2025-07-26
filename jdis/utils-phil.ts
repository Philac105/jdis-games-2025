import type {CardinalDirection, Cell, GameState, Position} from "./types";

const MAX_SIZE = 7;

const directions = [
    { x: 0, y: -1, name: "up" },
    { x: 0, y: 1, name: "down" },
    { x: -1, y: 0, name: "left" },
    { x: 1, y: 0, name: "right" },
];

export function moveToDirectionDeprecated(playerPosition: Position, targetPosition: Position): CardinalDirection | null {
    const dx = playerPosition.x < targetPosition.x ? 1 : playerPosition.x > targetPosition.x ? -1 : 0;
    const dy = playerPosition.y < targetPosition.y ? 1 : playerPosition.y > targetPosition.y ? -1 : 0;

    if (dx === 0 && dy === 0) return null;
    if (dx !== 0) return dx === 1 ? "right" : "left";
    return dy === 1 ? "down" : "up";
}

function posKey(pos: Position): string {
    return `${pos.x},${pos.y}`;
}

function isValid(cell: Cell | undefined): boolean {
    return !!cell && cell !== "firewall" && cell !== "via";
}

function getDirection(from: Position, to: Position): string | null {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return directions.find(d => d.x === dx && d.y === dy)?.name ?? null;
}

function bfs(gameState: GameState, bot: any, start: Position, goal: Position): Position[] {
    const queue: Position[] = [start];
    const visited = new Set<string>([posKey(start)]);
    const cameFrom = new Map<string, Position>();

    while (queue.length > 0) {
        console.log("Queue length:", queue.length);
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

            if (
                next.x < 0 || next.x >= MAX_SIZE ||
                next.y < 0 || next.y >= MAX_SIZE
            ) {
                continue;
            }

            const key = posKey(next);
            if (visited.has(key)) continue;

            console.log("HAHA:", next.y * MAX_SIZE + next.x);
            const cell = gameState.ground.data[next.y * MAX_SIZE + next.x];
            if (!isValid(cell)) continue;
            console.log("Is valid!", next);

            queue.push(next);
            visited.add(key);
            cameFrom.set(key, current);
        }
    }

    return [];
}

export function goToPosition(gameState: GameState, bot: any, position: Position): any {;
    const path = bfs(gameState, bot, {x: 3, y: 3}, position);

    if (path.length === 0) {
        console.log("No path found!");
        const fallback = moveToDirectionDeprecated({x: 3, y: 3}, position);
        if (fallback) return bot.phase(fallback);
        else return bot.doNothing();
    }

    const nextStep = path[0];
    const direction = getDirection({x: 3, y: 3}, nextStep!);
    if (!direction || !nextStep) {
        console.log("No direction or nextStep found!");
        return bot.doNothing();
    }

    console.log("GROUND WIDTH", gameState.ground.width);
    console.log("HIHI:", nextStep.y * MAX_SIZE + nextStep.x);
    const cell = gameState.ground.data[nextStep.y * MAX_SIZE + nextStep.x];
    if (cell === "resistance") {
        return bot.phase(direction);
    } else {
        return bot.move(nextStep);
    }
}

export function findClosestChest(gameState: GameState, bot: any) {
    const myPos = gameState.player.position;
    let closestChest: Position | null = null;
    let minDist = Infinity;

    for (let y = 0; y < MAX_SIZE; y++) {
        for (let x = 0; x < MAX_SIZE; x++) {
            const pos: Position = { x, y };
            if (gameState.ground.data[y * MAX_SIZE + x] === "chest") {
                console.log("Chest found at:", pos);
                const dist = Math.abs(myPos.x - x) + Math.abs(myPos.y - y);
                if (dist < minDist) {
                    minDist = dist;
                    closestChest = { x, y };
                }
            }
        }
    }

    return closestChest;
}