import {run} from "./jdis";
import {moveToCenterDirection} from "./jdis/utils-phil.ts";
import {smartMove} from "./jdis/xama-utils.ts";


const token = "c5qpmnfp";

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

        const playerPosition = gameState.player.position;
        const direction = moveToCenterDirection(playerPosition);

        if (direction) {
            return smartMove(bot, direction);
        } else {
            return bot.doNothing(); // At center, no move needed
        }
    },
    token,
);
