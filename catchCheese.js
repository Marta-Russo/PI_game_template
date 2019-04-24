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
let gameOver = false;




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


    createPaddleBox() {
        this.ctx.beginPath();
        this.ctx.rect(this.canvas.width/2 + paddleWidth*3,this.canvas.height/2.5 + this.canvas.height/2 - paddleWidth,basket.dimensions.width,basket.dimensions.width);
        this.ctx.fillStyle= "#020102";
        this.ctx.lineWidth = "8";
        this.ctx.strokeStyle = "#1931dd";
        this.ctx.stroke();
    }


    initGame() {


        super.gameOver = false;
        super.initGame();




        basket = {
            dimensions: {width: paddleWidth,height: paddleWidth},
            position: {x: this.canvas.width/2 + paddleWidth*3,y: (this.canvas.height/2+paddleHeight*2) },
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





    }

    dataCollection() {

        super.storeData();
    }

    collisionDetection(){



        if(ball.position.y > basket.position.y && ball.position.y - ball.radius < basket.position.y + basket.dimensions.height ){

            if(ball.position.x > basket.position.x && ball.position.x + ball.radius <ball.position.x + basket.dimensions.width){

                return true;
            }

        }

        return  false;

    }






    /**
     * TODO: randomize appearing objects number and trajectory a bit
     */
    loop() {
        super.loop();

        super.createBallBox(paddleWidth);

        let hitTheTarget = this.collisionDetection();
        let hitTheWall = super.wallCollision(ball);


        if(hitTheTarget || hitTheWall || super.gameOver ){

                // Remove ball and show in the starting point,
                //User should set the paddle to initial position , call stop after that
                super.moveBallToStart(ball);
                super.paddleAtZero(basket,hitTheTarget);

        }else{

            super.ballTrajectory(ball);
        }

        this.createPaddleBox();
        super.paddleMove(basket);
        super.drawImage(basket);
        obstructions.forEach(obstruction => super.drawImage(obstruction));


    }






}