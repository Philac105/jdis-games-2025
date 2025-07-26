import {run} from "./jdis";
import {goToCenter} from "./jdis/utils-phil.ts";

const token = "c5qpmnfp";

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

        /*const playerPosition = gameState.player.position;
        const direction = moveToCenterDirection(playerPosition);


        if (direction) {
            const action = smartMove(gameState, bot, direction);
            console.log("Action:", action);
            return action;
        } else {
            return bot.doNothing(); // At center, no move needed
        }*/
        const action = goToCenter(gameState, bot);
        console.log("Action:", action);
        return action;
    },
    token,
);
