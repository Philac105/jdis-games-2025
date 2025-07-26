import type {MoveAction} from "./types";

export function moveToCenter(playerPosition: { x: number; y: number }, bot: any): MoveAction {
    const center = { x: 62, y: 62 };
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;

    console.log("dx", dx);
    console.log("dy", dy);
    if (dx !== 0 || dy !== 0) {
        return bot.move({ x: playerPosition.x + dx, y: playerPosition.y + dy });
    }
    return bot.doNothing();
}