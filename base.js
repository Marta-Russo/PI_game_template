/*
 * Developed by Gleb Iakovlev on 3/31/19 8:15 PM.
 * Last modified 3/31/19 8:11 PM.
 * Copyright (c) 2019 . All rights reserved.
 */

/**
 * Initial base class for common game functions
 */

import Utils from "./utils.js";


let dataLoop ={};
let gameLoop = {};



export default  class Base {


/**
   * Constructor to get parameters from caller
   * @param context from component
   * @param document object from component
   */
    constructor(context, document) {
        this.context = context;
        this.document = document;
        this.canvas = this.document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentRounds=0;
        this.currentScore = 0;
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);

    }


    init(){
        this.currentScore=0;
    }

    /**
     * Down Key handler abstract method
     * @param e
     */
    keyDownHandler(e) {


    }

    /**
     * Up key handler abstract method
     * @param e
     */
    keyUpHandler(e) {

    }



    /**
     * Data collection abstract method
     */
    dataCollection(){

    }



    increaseScore(){
        this.currentScore++;
    }


    drawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#09b4dd";
        this. ctx.fillText("Score: "+this.currentScore, 8, 20);
    }


    /**
     * Main game loop
     */
    loop(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#020102";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        this.drawScore();
    }




    translateKeyPressed(e,bool) {

        if (e.key === "Up" || e.key === "ArrowUp") {
            bool = true;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            bool = true;
        }

        return bool;

    }
   
    drawImage(object){
        let image = new Image();
        image.src = object.imageURL;
        this.ctx.drawImage(image,object.position.x,object.position.y,object.dimensions.width,object.dimensions.height);

    }

    /**
     * Store data in proposed array
     * @param exportData array
     */
    storeData(exportData){

       // this.context.get('export_arr').addObject(exportData);
       // this.context.export_arr.push(exportData);
    }



    initGame(){

        this.loopTimer = function () {
            let inst = this;
            gameLoop = setInterval( function (){
                inst.loop();
            }, Utils.frameDelay);


            dataLoop = setInterval( function (){
                inst.dataCollection();
            }, 10);

        };


        this.loopTimer();

    }



    /**
     * Finish current round and check for rounds left
     */
    finishGame(){

        this.currentRounds++;
        clearInterval(dataLoop);
        clearInterval(gameLoop);

        if(this.currentRounds < this.context.game_rounds){

            this.initGame();

        }


    }


}
