/*
 * Developed by Gleb Iakovlev on 5/3/19 9:08 PM.
 * Last modified 4/29/19 4:36 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

/**
 *
 * @submodule games
 *
 */
import FeedCroc from './feedCroc.js';
import CatchMouse from './catchMouse.js';
import FeedMouse from './feedMouse.js';
import FeedMice from './feedMice.js';
import CatchCheese from './catchCheese.js';

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

            game =   new FeedCroc(context, document);

        break;

        case 1:

            game = new CatchCheese(context, document);

        break;

        case 2:

            game = new CatchMouse(context, document);

        break;

        case 3:

            game =   new FeedMice(context, document);

        break;

        case 4:

            game =  new FeedMouse(context, document);

        break;

        default:
            game =  new FeedCroc(context, document);
        break;

    }

        game.init();

    }

}
