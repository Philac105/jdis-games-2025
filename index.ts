import {run} from "./jdis";
import {CENTER, goToCenter} from "./jdis/utils-phil.ts";

const token = "c5qpmnfp";

let reachedCenter = false;

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

        if (gameState.player.position === CENTER) {
            reachedCenter = true;
        }

        if (!reachedCenter) {
            const action = goToCenter(gameState, bot);
            console.log("Action:", action);
            return action;
        }
    },
    token,
);
