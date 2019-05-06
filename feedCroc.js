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
let trajectories = [

  {velocity: {x: 3.2, y: -6.8}},
  {velocity: {x: 3.1, y: -7.2}},
  {velocity: {x: 3.0, y: -7.7}},
  {velocity: {x: 2.8, y: -7.6}}

];


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

            position: {x: super.paddleWidth * 10-5, y: this.canvas.height / 2.5 + this.canvas.height / 2 - super.paddleHeight},
            paddleLastMovedMillis: 100,
            velocity: super.Utils.paddleSpeed

        };

        target = {

            dimensions: {width: this.canvas.width / 5, height: this.canvas.width / 5},
            position: {x: this.canvas.width - this.canvas.width / 3.5, y: 10},
            imageURL: super.Utils.crocStartImage,
            imageTargetReachedURL: super.Utils.crocdoneImage

        };

        bounceSound = new Audio(super.Utils.bouncingSound);
        bounceSound.load();

        goodJob = new Audio(super.Utils.crocSlurpSound);
        goodJob.load();

        ballCatchFail = new Audio(super.Utils.ballcatchFailSound);
        ballCatchFail.load();

        audio = new Audio(super.Utils.rattleSound);
        audio.load();
        audio.addEventListener('onloadeddata', this.initGame(), false);

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
        super.drawPaddle(paddle.position.x + 5, paddle.position.y);
        this.drawImage(target, target.imageURL);
        super.paddleMove(paddle);
        this.paddleBallCollision();

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

                super.ballTrajectory(ball);

            }
        }

    }

    /**
     *
     * Handle paddle collision here
     * Adjust velocity to the ball by restitution factor
     * @method paddleBallCollision
     */
    paddleBallCollision() {
        if (ball.position.y >= (paddle.position.y - super.paddleHeight) && ball.position.y < (paddle.position.y + super.paddleHeight)) {
            if ((ball.position.x > paddle.position.x - super.paddleWidth && ball.position.x < paddle.position.x + super.paddleWidth)) {
                if (new Date().getTime() - paddle.paddleLastMovedMillis > 150) {
                    bounceSound.play();

                    ball.velocity.y *= ball.restitution;
                    ball.velocity.x *= -ball.restitution;
                    ball.position.y = paddle.position.y - ball.radius;
                    paddle.paddleLastMovedMillis = new Date().getTime();
                }
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

        let trajectory = trajectories[Math.floor(Math.random() * trajectories.length)];

        ball = {

            position: {x: super.paddleWidth * 5 + 20, y: (this.canvas.height - super.paddleWidth * 2)},
            velocity: {x: trajectory.velocity.x, y: trajectory.velocity.y},
            mass: super.Utils.ballMass,
            radius: 10,
            restitution: -1.5,
            color: '#dadd0f'

        };

        initSoundPlaying = true;
        goodJob.src = super.Utils.crocSlurpSound;
        ballCatchFail.src = super.Utils.ballcatchFailSound;
        bounceSound.src = super.Utils.bouncingSound;
        audio.src = super.Utils.rattleSound;
        audio.play();
        audio.addEventListener('ended', function () {

            initSoundPlaying = false;
        });

        super.initGame();

    }

    /**
     *
     * Export data
     * @method dataCollection
     */
    dataCollection() {

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
