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
    if (playerPosition.x < center.x) {
        return bot.moveRight();
    } else if (playerPosition.x > center.x) {
        return bot.moveLeft();
    } else if (playerPosition.y < center.y) {
        return bot.moveDown();
    } else if (playerPosition.y > center.y) {
        return bot.moveUp();
    }
    return bot.doNothing();
}