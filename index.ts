import {run} from "./jdis";
import {goToCenter, moveToCenterDirection, visited} from "./jdis/utils-phil.ts";
import {smartMove} from "./jdis/xama-utils.ts";


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
        const visited = new Set<string>();
        return goToCenter(gameState, bot, visited);
    },
    token,
);
