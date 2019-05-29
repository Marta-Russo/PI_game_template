/*
 * Developed by Gleb Iakovlev on 4/2/19 2:45 PM.
 * Last modified 4/2/19 2:45 PM.
 * Copyright (c) 2019 . All rights reserved.
 */
import Game from "./Game.js";

export default  class testGame{

    constructor(document) {

        this.export_arr = [];
        this.document = document;
    }


    init() {

        new Game(this,this.document,1);
    }

}
