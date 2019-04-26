/*
 * Developed by Gleb Iakovlev on 4/2/19 2:45 PM.
 * Last modified 4/2/19 2:45 PM.
 * Copyright (c) 2019 . All rights reserved.
 */


import catchMouse from './catchMouse.js';
import catchChese from './catchCheese.js'
import feedMouse from './feedMouse.js';
import feedMice from "./feedMice.js";
import FeedCroc from './feedCroc.js';

export default  class testGame{

    constructor(document) {

        this.export_arr = [];
        this.document = document;
    }




    init() {

      //  new FeedCroc(this, this.document).init();
    // new catchMouse(this,this.document).init();
      //  new catchChese(this,this.document).init();
      //  new feedMouse(this,this.document).init();
        new feedMice(this,this.document).init();
    }

}
