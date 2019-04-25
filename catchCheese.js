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
let audio = {};
let goodJob = {};
let initSoundPlaying = true;
let ballCatchFail = {};
let targetStars = {};
let trajectories = [

    {velocity : {x: 5.8, y:-6.6}},
    {velocity : {x: 4.8, y:-7.6}},
    {velocity : {x: 5.0, y:-7.0}},
    {velocity : {x: 5.2, y:-6.8}}
];



export default class catchCheese extends Base{


    constructor(context,document) {
        super(context,document);
        paddleWidth = this.canvas.width/20;
        paddleHeight = this.canvas.width/15;
        obstructionVals = this.context.obstructionNumber;

    }




    init() {
        super.init();


        basket = {
            dimensions: {width: paddleWidth,height: paddleWidth},
            position: {x: this.canvas.width/2 + paddleWidth*3,y: (this.canvas.height/2+paddleHeight*2) },
            velocity: this.context.paddle_speed,
            imageURL: 'Resource/images/netball.png'
        };



        goodJob  = new Audio("Resource/sounds/goodcatch.mp3");
        goodJob.load();
        ballCatchFail = new Audio("Resource/sounds/BallCatchFail.mp3");
        ballCatchFail.load();
        audio  = new Audio("Resource/sounds/rattling_sound.mp3");
        audio.load();
        audio.addEventListener('onloadeddata', this.initGame(),false);



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



        ball = {

            position : {x: paddleWidth*5 + 20, y:(this.canvas.height-paddleWidth*2)},
            velocity : {x: 5.8, y:-6.6},
            mass: this.context.ball_mass/10,
            radius: 10,
            restitution: -1 - this.context.restitution/10,
            color:"#dadd0f"

        };






        obstructions =  Array(Math.floor(Math.random()*3)).fill({}).map((value,index) =>

            ({  dimensions: {width:paddleWidth*3.5, height: this.canvas.height / 1.5 },
                position: {x: this.canvas.width/2 -(index+1)*paddleWidth,y: this.canvas.height/2.5  - paddleWidth*1.5 },
                imageURL: 'https://i.ibb.co/tMS8VhL/Fir-Tree-PNG-Transparent-Image.png'
            })

        );


        initSoundPlaying = true;
        ballCatchFail.src = "Resource/sounds/BallCatchFail.mp3";
        goodJob.src = "Resource/sounds/goodcatch.mp3";
        audio.src = "Resource/sounds/rattling_sound.mp3";
        audio.play();
        audio.addEventListener("ended", function () {

            initSoundPlaying = false;
        });



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


    starsLocationUpdate(){

        targetStars = {

            position : {x: basket.position.x + paddleWidth , y: basket.position.y - paddleHeight/2},
            dimensions : {width: paddleWidth/1.5, height: paddleWidth/1.5},
            imageURL : 'Resource/images/Stars.png'

        };

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

                if(hitTheTarget) {

                    if(!super.gameOver && goodJob.readyState === 4) {

                        goodJob.play();
                    }

                }else{
                    if(!super.gameOver) {

                        ballCatchFail.play();
                    }

                }
                // Remove ball and show in the starting point,
                //User should set the paddle to initial position , call stop after that
                super.moveBallToStart(ball,true);
                super.paddleAtZero(basket,hitTheTarget);
                if(hitTheTarget) {
                    this.starsLocationUpdate();
                    this.drawImage(targetStars);
                }

        }else{

            if(initSoundPlaying) {

                super.moveBallToStart(ball,false);

            }else{

                super.ballTrajectory(ball);

            }
        }

        this.createPaddleBox();
        super.paddleMove(basket);
        this.drawImage(basket);




        obstructions.forEach(obstruction => this.drawImage(obstruction));


    }



    drawImage(object){
        let image = new Image();
        image.src = object.imageURL;
        this.ctx.drawImage(image,object.position.x,object.position.y,object.dimensions.width,object.dimensions.height);
    }



}