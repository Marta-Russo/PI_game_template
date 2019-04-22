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
let ball = {};
let obstructionVals = 2;
let obstructions = [];
let interrupt = false;

export default class catchCheese extends Base{


    constructor(context,document) {
        super(context,document);
        paddleWidth = this.canvas.width/20;
        paddleHeight = this.canvas.width/15;
        obstructionVals = this.context.obstructionNumber;

    }




    init() {
        super.init();
        this.initGame();
    }





    initGame() {
        super.initGame();




        basket = {
            dimensions: {width: paddleWidth,height: paddleWidth},
            position: {x: this.canvas.width/2 + paddleWidth*2,y: (this.canvas.height/2+paddleHeight) },
            velocity: this.context.paddle_speed,
            imageURL: 'https://i.ibb.co/4RBWcsf/netball-clipart-icon-213577-7948745.png'
        };

        ball = {

            position : {x: paddleWidth*5 + 20, y:(this.canvas.height-paddleWidth*2)},
            velocity : {x: 5.8, y:-6.6},
            mass: this.context.ball_mass/10,
            radius: 10,
            restitution: -1 - this.context.restitution/10,
            color:"#dadd0f"

        };


        obstructions =  Array(obstructionVals).fill({}).map((value,index) =>

            ({  dimensions: {width:paddleWidth*3, height: this.canvas.height / 1.5 },
            position: {x: this.canvas.width/2 -(index+1)*paddleWidth/1.5,y: this.canvas.height/2.5  - paddleWidth*1.5 },
            imageURL: 'https://i.ibb.co/tMS8VhL/Fir-Tree-PNG-Transparent-Image.png'
             })

        );

        super.mouseY = basket.position.y;

    }

    dataCollection() {

        super.storeData();
    }

    collisionDetection(){


        super.wallCollision(ball);

        if(ball.position.y > basket.position.y && ball.position.y + ball.radius < basket.position.y + basket.dimensions.height ){

            if(ball.position.x > basket.position.x && ball.position.x- ball.radius <ball.position.x + basket.dimensions.width){
                super.increaseScore();
                super.finishGame();
            }

        }


    }

    /**
     * TODO: randomize appearing objects number and trajectory a bit
     */
    loop() {
        super.loop();

        if(interrupt == false){
            interrupt =  super.drawCircle();
        }

        if(interrupt) {
            this.collisionDetection();

            super.createBallBox(paddleWidth);
            super.ballTrajectory(ball);
            super.drawImage(basket);

            obstructions.forEach(obstruction => super.drawImage(obstruction));
            super.paddleMove(basket);

        }

    }






}