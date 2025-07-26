import {run} from "./jdis";
import {findClosestChest, goToPosition} from "./jdis/utils-phil.ts";

const token = "c5qpmnfp";

let reachedCenter = false;

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

       // if (gameState.player.position === CENTER) {
      //      reachedCenter = true;
       // }

        console.log(gameState.ground.data);

        const closestChestPosition = findClosestChest(gameState, bot);
        console.log(closestChestPosition);
        if (closestChestPosition) {
            const action = goToPosition(gameState, bot, closestChestPosition);
            if (gameState.player.position === closestChestPosition) {
                console.log("Reached chest at:", closestChestPosition);
                return bot.openChest(closestChestPosition);
            }

            console.log("Walking to chest at:", action);
            return action;
        } else {

        }
        return bot.doNothing();

        // if (!reachedCenter) {
        //     const action = goToPosition(gameState, bot, CENTER);
        //     console.log("Action:", action);
        //     if (action.action === "phase") {
        //         console.log("Phase:", action.direction);
        //       } else {
        //         console.log("Position:", action.position);
        //     }
        //     return action;
        // }
    },
    token,
);
