/*
* Developed by Gleb Iakovlev on 4/18/19 11:24 PM.
* Last modified 4/18/19 11:24 PM.
* Copyright (c) Cognoteq Software Solutions 2019.
* All rights reserved
*/

/**
 *
 * @submodule games
 *
 */
import DiscreteBounce from './discreteBounce.js';
import DiscreteCatchLift from './discreteCatchLift.js';
import ButtonPressWindow from './buttonPressWindow.js';
import DiscreteButtonSpatial from './discreteButtonSpatial.js';
import DiscreteCatch from './discreteCatch.js';

/**
 * Game orchestrator to set initial parameters and
 * execute requested game
 * Might have randomization of the games here
 * @class Game
 */
export default class Game {
    /**
     * @method constructor
     * @constructor Game
     * @param context
     * @param document
     * @param gameNumber current game id
     */
    constructor(context, document, gameNumber) {

        let game = {};

        switch (gameNumber) {

            case 0:

                game =   new ButtonPressWindow(context, document);

                break;

            case 1:

                game = new DiscreteButtonSpatial(context, document);

                break;

            case 2:

                game = new DiscreteCatchLift(context, document);

                break;

            case 3:

                game =   new DiscreteCatch(context, document);

                break;

            case 4:

                game =  new DiscreteBounce(context, document);

                break;

            default:
                game =  new ButtonPressWindow(context, document);
                break;

        }

        game.init();

    }

}
