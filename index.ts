import {run} from "./jdis";
import {moveToCenter} from "./jdis/utils-phil.ts";

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
