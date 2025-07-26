import type {MoveAction} from "./types";

export function moveToCenter(playerPosition: { x: number; y: number }, bot: any): MoveAction {
    const center = { x: 62, y: 62 };
    console.log("playerPosition", playerPosition);
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    console.log("dx", dx);
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;
    console.log("dy", dy);
    if (dx !== 0 || dy !== 0) {
        return bot.move({ x: dx, y: dy });
    }
    return bot.doNothing();
}