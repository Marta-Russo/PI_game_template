/*
 * Developed by Gleb Iakovlev on 4/6/19 12:12 PM.
 * Last modified 4/6/19 12:12 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

/**
 * Main implementation for catch cheese with obstruction game
 */
import Base from "./base.js";

let paddleWidth = 0;
let paddleHeight = 0;
let basket = {};

export default class catchCheese extends Base{


    constructor(context,document) {
        super(context,document);
        paddleWidth = this.canvas.width/9;
        paddleHeight = this.canvas.width/9;

    }

    createBallBox() {

        this.ctx.beginPath();
        this.ctx.fillStyle= "#020102";
        this.ctx.lineWidth = "4";
        this.ctx.strokeStyle = "#1931dd";
        this.ctx.strokeRect(10,basket.height-basket.dimensions.width*1.56,basket.dimensions.width/2,basket.dimensions.width*1.2);
        this.ctx.fill();
        this.ctx.closePath();
    }




    init() {
        super.init();


    }


    initGame() {
        super.initGame();
        basket = {
            dimensions: {width: paddleWidth,height: paddleHeight},
            position: {x: this.canvas.width/2 + paddleWidth*2,y: (this.canvas.height-paddleHeight)/2 },
            velocity: this.context.paddle_speed,
            imageURL: 'https://i.ibb.co/3vtD1T1/Screen-Shot-2019-04-05-at-5-10-26-PM.png'
        };


    }

    dataCollection() {

        super.storeData();
    }

    loop() {
        super.loop();
        self.createBallBox()




    }






}