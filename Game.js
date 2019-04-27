/*
 * Developed by Gleb Iakovlev on 4/18/19 11:24 PM.
 * Last modified 4/18/19 11:24 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */


import FeedCroc from "./feedCroc.js";
import CatchMouse from "./catchMouse.js";
import FeedMouse from "./feedMouse.js";
import FeedMice from "./feedMice.js";
import CatchCheese from "./catchCheese.js";

/**
 *
 * Game orchestrator to set initial parameters and
 * execute requested game
 */
export default class Game{


    /**
     *
     * @param context
     * @param document
     * @param gameNumber current game id
     */
    constructor(context,document,gameNumber){

        switch (gameNumber) {

            case 0:

                new FeedCroc(context,document).init();

                break;

            case 1:

                new CatchCheese(context,document).init();

                break;

            case 2:

                new CatchMouse(context,document).init();


                break;

            case 3:

                new FeedMice(context,document).init();

                break;

            case 4:

                new FeedMouse(context,document).init();

                break;


        }

    }


}
