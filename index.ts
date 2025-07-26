import { run } from "./jdis";

const token = "c5qpmnfp";

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

        const playerPosition = gameState.player.position;
        return moveToCenter(playerPosition, bot);
    },
    token,
);

function moveToCenter(playerPosition: { x: number; y: number }, bot: any) {
    const center = { x: 62, y: 62 };
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;
    if (dx !== 0 || dy !== 0) {
        return bot.move({ x: dx, y: dy });
    }
    return bot.doNothing();
}