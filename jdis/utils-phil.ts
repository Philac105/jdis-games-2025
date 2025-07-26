import type {CardinalDirection, Cell, GameState, Position} from "./types";

const MAX_SIZE = 125;

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
    console.log("PLS");
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
            console.log("PLS");
            const next = { x: current.x + dir.x, y: current.y + dir.y };

            if (
                next.x < 0 || next.x >= MAX_SIZE ||
                next.y < 0 || next.y >= MAX_SIZE
            ) {
                continue;
            }

            const key = posKey(next);
            if (visited.has(key)) continue;

            const cell = bot.getGlobalCell(next);
            if (!isValid(cell)) continue;
            console.log("Is valid!", next);

            queue.push(next);
            visited.add(key);
            cameFrom.set(key, current);
        }
    }

    return [];
}

export function goToPosition(gameState: GameState, bot: any, position: Position): any {
    console.log("PLS");
    const playerPosition = gameState.player.position;
    const path = bfs(gameState, bot, playerPosition, position);

    if (path.length === 0) {
        console.log("No path found!");
        const fallback = moveToDirectionDeprecated(playerPosition, position);
        if (fallback) return bot.phase(fallback);
        else return bot.doNothing();
    }

    const nextStep = path[0];
    const direction = getDirection(playerPosition, nextStep!);
    if (!direction || !nextStep) {
        console.log("No direction or nextStep found!");
        return bot.doNothing();
    }

    const cell = bot.getGlobalCell(nextStep);
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

    for (let x = 0; x < MAX_SIZE; x++) {
        for (let y = 0; y < MAX_SIZE; y++) {
            const pos: Position = { x, y };
           // console.log(pos);
          //  console.log(bot.getGlobalCell(pos));
            if (bot.getGlobalCell(pos) === "chest") {
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