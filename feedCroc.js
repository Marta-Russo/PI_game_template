/*
 * Developed by Gleb Iakovlev on 5/3/19 9:09 PM.
 * Last modified 4/27/19 3:26 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */
import Base from './base.js';
/**
 *
 * @submodule games
 *
 */

let paddle = {};
let ball = {};
let target = {};
let audio = {};
let bounceSound = {};
let ballCatchFail = {};
let goodJob = {};
let initSoundPlaying = true;
let initialTime = 0;
let ballvx = 1.4013 ;
let initV = 0.9333;
let gravity = 2.4889;
let alpha = 0.7;

/**
 * @class FeedCroc
 * @extends Base
 * Main implementation of Feed the crocodile game.
 * The user will operate with paddle to bounce the ball into the crocodile mouth.
 * The trajectory is randomized with various values in trajectories array
 *
 */
export default class FeedCroc extends Base {


    /**
     * Constructor to get parameters from caller
     * @method constructor
     * @constructor constructor
     * @param context from component
     * @param document object from component
     */
    constructor(context, document) {

        super(context, document);

    }

    /**
     * Main point to start the game.
     * Initialize static parameters and preload sounds here
     * @method init
     */
    init() {
        super.init();

        paddle = {

            position: {x: 0, y: 0},
            dimensions: {width: 0 , height:0},
            prevposition:{x: this.canvas.width / 2 + super.paddleWidth * 3, y: (this.canvas.height / 2 + super.paddleHeight * 2)},
            paddleLastMovedMillis: 100,
            velocity: super.Utils.paddleSpeed,
            releaseVelocity:1,
            positions:[],
            times:[]

        };

        let targetLocH = 1.72;
        let targetLocV = 0.5;
        let SCALE  = 420;
        //targetLocH-0.15, 1.3671-(targetLocV+0.21)-0.2, targetLocH+0.6-0.15, 1.3671-(targetLocV-0.21)-0.2

        let leftBorder = (targetLocH-0.15)*SCALE ;
        let topBorder = (1.3671-(targetLocV+0.21)-0.2)*SCALE;
        let rightBorder = (targetLocH+0.6-0.15)*SCALE;
        let downBorder =  (1.3671-(targetLocV-0.21)-0.2)*SCALE ;

        target = {

            dimensions: {width: rightBorder-leftBorder, height: topBorder-downBorder},
            position: {x: leftBorder, y: downBorder},
            imageURL: super.Utils.crocStartImage,
            imageTargetReachedURL: super.Utils.crocdoneImage

        };

        paddle = super.paddleObject(paddle);
        bounceSound = new Audio(super.Utils.bouncingSound);
        bounceSound.load();

        goodJob = new Audio(super.Utils.crocSlurpSound);
        goodJob.load();

        ballCatchFail = new Audio(super.Utils.ballcatchFailSound);
        ballCatchFail.load();

        audio = new Audio(super.Utils.rattleSound);
        audio.load();
        goodJob.src = super.Utils.crocSlurpSound;
        ballCatchFail.src = super.Utils.ballcatchFailSound;
        bounceSound.src = super.Utils.bouncingSound;
        audio.src = super.Utils.rattleSound;
        audio.addEventListener('onloadeddata', this.initGame(), false);

    }

    /**
     * @method paddleHistory
     * Store paddle position and time history for velocity calculation
     */
    paddleHistory(){
        // Keep only 9 previous values to calculate velocity
        if(paddle.positions.length > 50){
            paddle.positions = [];
            paddle.times = [];

        }
        paddle.times.push(super.getElapsedTime(initialTime));
        paddle.positions.push(paddle.position.y/420);

    }


    /**
     *
     * Main loop of the game.
     * Set initial position of the ball in a box and starting rattling sound (initSoundPlaying).
     * After that  start ball trajectory.
     * If ball hits the target or missed the target (hits any screen edge) wait util user places the paddle to starting position and move
     * the ball to initial position.
     * Increase the score if ball hits the target.
     * @method loop
     */
    loop() {

        super.loop();

        super.createBallBox();
        super.createPaddleBox(super.paddleWidth * 10, this.canvas.height / 2.5 + this.canvas.height / 2 - super.paddleWidth*1.3);
        this.paddleHistory();
        paddle.prevposition.y = paddle.position.y;
        super.drawPaddle(paddle);
        super.paddleMove(paddle);
        this.drawImage(target, target.imageURL);

        let hitTheTarget = this.collisionDetection();
        let hitTheWall = super.wallCollision(ball);

        if (hitTheTarget || hitTheWall || super.gameOver) {
            // Remove ball and show in the starting point,
            //User should set the paddle to initial position , call stop after that

            if (hitTheTarget) {
                if (!super.gameOver && goodJob.readyState === 4) {

                    goodJob.play();
                }
                this.drawImage(target, target.imageTargetReachedURL);

            } else {
                if (!super.gameOver) {

                    ballCatchFail.play();
                }
            }

            super.moveBallToStart(ball, true);
            super.paddleAtZero(paddle, hitTheTarget);

        } else {

            if (initSoundPlaying) {

                super.moveBallToStart(ball, false);

            } else {
                if(ball.state == 'bounce'){
                    super.bounceTrajectory(ball,paddle,ballvx,initV,gravity,initialTime);

                }else{

                    super.trajectory(ball,ballvx,initV,gravity,initialTime);
                }

                super.drawBall(ball);
            }
        }

        this.paddleBallCollision();

    }



    getArraysum(a){

        return a.reduce((t,n)=>t+n);

    }

    getArrayMean(a){

        return this.getArraysum(a)/a.length;

    }

    subtractFromEachElement(a,val){

       return  a.map((v,index)=>v-val);

    }

    arrayProduct(a1,a2){

        return a1.map((value,index)=> value*a2[index]);

    }

    vectorCalculation(a){

        return this.subtractFromEachElement(a,this.getArrayMean(a))

    }

    /**
     * @method getPaddleVelocity
     * sum((time-mean(time)).*(position-mean(position)))/sum((time-mean(time)).*(time-mean(time)))
     * @param time
     * @param position
     * @returns {number}
     */
    getPaddleVelocity(time,position){

        let timeVector = this.vectorCalculation(time.slice(time.length-20,time.length));
        let positionVector = this.vectorCalculation(position.slice(position.length-20,position.length));

        return  this.getArraysum(this.arrayProduct(timeVector,positionVector))/this.getArraysum(this.arrayProduct(timeVector,timeVector));
    }



    /**
     *
     * Handle paddle collision here
     * Adjust velocity to the ball by restitution factor
     * @method paddleBallCollision
     */
    paddleBallCollision() {

        if ((ball.position.x > paddle.position.x - ball.radius && ball.position.x <= paddle.position.x + super.paddleWidth*1.3 + ball.radius)) {
            if (paddle.position.y <= paddle.prevposition.y &&  ball.position.y > paddle.position.y  - ball.radius*2 && ball.position.y <= paddle.position.y + ball.radius*3  ) {

                    bounceSound.play();
                    ball.impactTime = new Date().getTime();
                    ball.impactPosition = paddle.position.y/420;
                    let paddleVelocity = this.getPaddleVelocity(paddle.times,paddle.positions);
                    let iterator = super.getElapsedTime(initialTime);
                    ball.velocity = initV - gravity*iterator;
                    paddle.releaseVelocity = -alpha *(ball.velocity - paddleVelocity)+ paddleVelocity;

                    ball.state = 'bounce';

            }
        }
    }


    /**
     *
     * Check if ball reached the target
     * @method collisionDetection
     * @return {boolean}
     */
    collisionDetection() {

        if ((ball.position.y < target.position.y + target.dimensions.height) && (ball.position.y > target.position.y + target.dimensions.height / 1.6) && ball.position.x > target.position.x + 40 && ball.position.x < target.position.x + 80) {
            return true;
        }

        return false;
    }


    /**
     *
     * Initialize each game round with initial object parameters
     * Randomize number of obstructions
     * Reset the sounds sources for older browser versions
     * @method initGame
     */
    initGame() {
        let Angle = (65*(Math.PI)/180);
        const  trajectories = [
            {velocity: {x: 5.7* (45*(Math.PI)/180), y: -6.1*Math.sin(Angle)}},
            {velocity: {x: 5.5* (45*(Math.PI)/180), y: -6.3*Math.sin(Angle)}},
            {velocity: {x: 5.4* (45*(Math.PI)/180), y: -6.2*Math.sin(Angle)}}
        ];

        let index = Math.floor(Math.random() * trajectories.length);
        let trajectory = trajectories[index];

        ball = {

            position: {x: super.paddleWidth * 5 + 20, y: (this.canvas.height - super.paddleWidth * 2)},
            velocity: 0,
            mass: super.Utils.ballMass,
            radius: 10,
            state: 'fall',
            restitution: -1.15,
            impactTime: 0,
            impactPosition:0,
            color: '#dadd0f'

        };

        initSoundPlaying = true;
        audio.play();
        audio.addEventListener('ended', function () {

            initSoundPlaying = false;
            initialTime = new Date().getTime();
        });

        super.initGame();

    }

    /**
     *
     * Export data
     * @method dataCollection
     */
    dataCollection() {
        super.dataCollection();
        let exportData = {

            ball_position_x: ball.position.x,
            ball_position_y: ball.position.y,
            paddle_position_x: paddle.position.x,
            paddle_position_y: paddle.position.y,

        };

        // this.context.get('export_arr').addObject(exportData);
        super.storeData(exportData);

    }

}
