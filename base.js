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
let upPressed = false;
let downPressed = false;
let roundDelay = 20;
let mouseY = 0;

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
        this.canvas.style.cursor = 'none';
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        document.addEventListener("mousemove", this.onMouseMove);

    }



    init(){
        this.currentScore=0;
        this.currentRounds = 0 ;
        clearInterval(dataLoop);
        clearInterval(gameLoop);
    }

    /**
     * Triggered when participant pressed some key on keyboard
     * @param e event
     */
    keyDownHandler(e) {

        if(e.key === "Up" || e.key === "ArrowUp") {
            upPressed = true;
        }
        else if(e.key === "Down" || e.key === "ArrowDown") {
            downPressed = true;
        }

    }

    /**
     * Triggered when participant released some key on keyboard
     * @param e event
     */
    keyUpHandler(e) {

        if(e.key === "Up" || e.key ==="ArrowUp") {
            upPressed = false;
        }
        else if(e.key === "Down" || e.key === "ArrowDown") {
            downPressed = false;
        }

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




    set mouseY(val){

        mouseY = val;
    }


    get mouseY(){

        return mouseY;
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

        this.waitSeconds(roundDelay);

        if (this.currentRounds < this.context.game_rounds) {

            this.initGame();

        }

    }




    /**
     * Create ball movement up to some trajectory
     * @param ball
     */
    ballTrajectory(ball) {
        let gravity = this.context.gravity_factor * 9.81;  // m / s^2
        let rho = 1.22; // kg/ m^3
        let Cd = 0.47;  // Dimensionless
        let A = Math.PI * ball.radius * ball.radius / (10000); // m^2
        let Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
        let Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        let ax = Fx / ball.mass;
        let ay = gravity + (Fy / ball.mass);

        ball.velocity.x += ax * Utils.frameRate;
        ball.velocity.y += ay * Utils.frameRate;
        ball.position.x += ball.velocity.x * Utils.frameRate * 100;
        ball.position.y += ball.velocity.y * Utils.frameRate * 100;

        this.ctx.translate(ball.position.x, ball.position.y);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }



    waitSeconds(iMilliSeconds) {
        var counter= 0
            , start = new Date().getTime()
            , end = 0;
        while (counter < iMilliSeconds) {
            end = new Date().getTime();
            counter = end - start;
        }
    }

    /**
     * Set paddle coordinates up to velocity
     * @param paddle object
     */
    paddleMove(paddle) {


            paddle.position.y = this.mouseY;

    }

    /**
     * Walls and target collisions detection
     */
    wallCollision(ball){

        if(ball.position.y > this.canvas.height - ball.radius || ball.position.x > this.canvas.width - ball.radius || ball.position.x < ball.radius){


            this.finishGame();
        }

    }


    onMouseMove(e) {

        mouseY = e.clientY;
    }



}
