/*
 * Developed by Gleb Iakovlev on 4/2/19 2:45 PM.
 * Last modified 4/2/19 2:45 PM.
 * Copyright (c) 2019 . All rights reserved.
 */

import Game from './game.js';
import catchMouse from './catchMouse.js';


export default  class testGame{

    constructor(document) {
        this.game_rounds = 10;
        this.paddle_speed = 4;
        this.ball_mass = 1;
        this.gravity_factor = 1;
        this.restitution = 2;
        this.x_velocity = 27;
        this.y_velocity = 38;
        this.paddle_restitution = 2;
        this.export_arr = [];
        this.document = document;
    }

    init() {

      // new Game(this, this.document).init();
        new catchMouse(this,this.document).init();
    }

}
