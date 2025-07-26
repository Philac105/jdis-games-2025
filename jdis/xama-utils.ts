export function getZone20x20(bot: any): string[][] {
    const radius = 10;
    const max = 125;
    const botPos = bot.position;

    // Initialize 20x20 array filled with "void"
    const grid: string[][] = Array.from({ length: 20 }, () => Array(20).fill("void"));

    for (let dx = -radius; dx < radius; dx++) {
        for (let dy = -radius; dy < radius; dy++) {
            const x = botPos.x + dx;
            const y = botPos.y + dy;

            // Check if position is inside the map
            if (x >= 0 && x <= max && y >= 0 && y <= max) {
                const type = bot.getGlobalCell({ x, y });
                // Added non-null assertion to tell TypeScript this is safe
                grid[dy + radius]![dx + radius] = type;
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
    // Get the 20x20 grid centered on the bot
    const grid = getZone20x20(bot);
    const offset = directionVectors[direction];
    const radius = 10;

    const targetX = radius + offset.x;
    const targetY = radius + offset.y;

    const targetCell = grid?.[targetY]?.[targetX];

    if (!targetCell) {
        return bot.doNothing();
    }

    // 🔥 Avoid Firewall and Via
    if (targetCell === "firewall" || targetCell === "via") {
        // Try to sidestep around the via
        const alternatives = ["left", "right", "up", "down"].filter(dir => dir !== direction) as Direction[];
        for (const altDir of alternatives) {
            const altOffset = directionVectors[altDir];
            const altCell = grid?.[radius + altOffset.y]?.[radius + altOffset.x];
            if (altCell === "pcb" || altCell === "chest") {

                return bot.move(altOffset);
            }
        }

        return  bot.doNothing();
    }

    // 🟨 If it's a wall, phase through it
    if (targetCell === "resistance") {

        return bot.phase(direction);
    }

    // ✅ Safe to move
    return bot.move(offset);
}


