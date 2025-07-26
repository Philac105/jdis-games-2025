import {type Position, run} from "./jdis";
import {findClosestChest, goToPosition} from "./jdis/utils-phil.ts";

const token = "c5qpmnfp";

let reachedCenter = false;

const CENTER = { x: 62, y: 62 };

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


        const closestChestPosition = findClosestChest(gameState, bot);
        console.log("CLOSESTCHESSI:", closestChestPosition);
        if (closestChestPosition) {
            const x: Position = {x: 3, y: 3}
            console.log("yoo");
            if (closestChestPosition.x === 3 && closestChestPosition.y === 3) {
                console.log("Reached chest at:", closestChestPosition);


                return bot.openChest(gameState.player.position);
            }

            let action = goToPosition(gameState, bot, closestChestPosition);

            console.log("Walking to chest at:", action);
            return action;
        } else {
            const action = goToPosition(gameState, bot, CENTER);
            console.log("Walking to center:", action);
            return action;
        }

        // if (!reachedCenter) {
        //
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
