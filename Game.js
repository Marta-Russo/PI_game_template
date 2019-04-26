/*
 * Developed by Gleb Iakovlev on 4/18/19 11:24 PM.
 * Last modified 4/18/19 11:24 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */


import FeedCroc from "./feedCroc";
import catchMouse from "./catchMouse";
import feedMouse from "./feedMouse";
import feedMice from "./feedMice";
import catchCheese from "./catchCheese";

/**
 * TODO : might need a config json file for each game and potentially randomization
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

                new catchMouse(context,document).init();

            case 1:

                new feedMouse(context,document).init();

            break;

                new feedMice(context,document).init();

            case 2:

                new catchCheese(context,document).init();

            break;


        }

    }


}