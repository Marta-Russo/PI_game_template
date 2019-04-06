/*
 * Developed by Gleb Iakovlev on 4/6/19 3:11 PM.
 * Last modified 4/6/19 3:11 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

/**
 * Implementation for feed the mouse in the house game
 */
import Base from "./base.js";

let paddleWidth = 0;
let paddleHeight = 0;

export default class feedMouse extends Base{

    constructor(context,document){

        super(context,document);
        paddleWidth = this.canvas.width/9;
        paddleHeight = this.canvas.width/9;

    }


    createBallBox() {

        this.ctx.beginPath();
        this.ctx.fillStyle= "#020102";
        this.ctx.lineWidth = "4";
        this.ctx.strokeStyle = "#1931dd";
        this.ctx.strokeRect(10,(this.canvas.height/2+paddleHeight*1.5),basket.dimensions.width/2,basket.dimensions.width*1.2);
        this.ctx.fill();
        this.ctx.closePath();
    }


    createHouse(){

        let houseX = this.canvas.width - paddleWidth*2 - this.canvas.width/3.2;
        let houseY = this.canvas.height/3;
        let houseWidth = this.canvas.width/3.2;
        let houseHeight = this.canvas.height/2;
        let roofSpace = 20;

        this.ctx.beginPath();
        this.ctx.fillStyle= "#8f909c";
        this.ctx.rect(houseX,houseY,houseWidth,houseHeight);
        this.ctx.fill();
        this.ctx.closePath();
        //Draw roof

        this.ctx.beginPath();
        this.ctx.fillStyle= "#ff2d23";
        this.ctx.moveTo(houseX - roofSpace  ,houseY);
        this.ctx.lineTo(houseX + houseWidth/2 ,houseY - houseHeight + 100);
        this.ctx.lineTo(houseX+houseWidth +roofSpace ,houseY);
        this.ctx.fill();
        this.ctx.closePath();
    }




    init() {
        super.init();
        this.initGame();
    }

    initGame() {
        super.initGame();
    }

    dataCollection() {

    }

    loop() {
        super.loop();

        this.createHouse();

    }


}