/*
 * Developed by Gleb Iakovlev on 5/3/19 9:09 PM.
 * Last modified 4/29/19 8:18 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

import Base from './base.js';
/**
 *
 * @submodule games
 *
 */
let paddleWidth = 0;
let ball = {};
let targets = [];
let pressed = {};
let keys = ['o', 'k', 'm']; //Might need to set as super parameter
let imageURLS = [];
let audio = {};
let ballCatchFail = {};
let goodJob = {};
let initSoundPlaying = false;

/**
 * Main implementation of feed  the mice in the house game.
 * The user will operate with keyboard keys to predict which ball trajectory will hit which window
 * in the house.
 * The trajectory is randomized with various values in trajectories array
 * Initialize the mice image for each muse as an array
 * @class FeedMice
 * @extends Base
 */
export default class FeedMice extends Base {

    /**
     * @method constructor
     * @constructor
     * @param context
     * @param document
     */
    constructor(context, document) {
        super(context, document);
        paddleWidth = this.canvas.width / 20;
        imageURLS = [super.Utils.blueMouseImage, super.Utils.greenMouseImage, super.Utils.redMouseImage];

    }

    /**
     * Draw image object according to object locations
     * @method drawImage
     * @param object
     */
    drawImage(object) {
        let image = new Image();
        image.src = object.imageURL;
        this.ctx.drawImage(image, object.position.x, object.position.y, object.dimensions.width, object.dimensions.height);
    }


    /**
     * Draw house with roof according to coordinates
     * @method createHouse
     */
    createHouse() {

        let houseX = this.canvas.width / 2 - paddleWidth;
        let houseY = this.canvas.height / 2.5;
        let houseWidth = this.canvas.width / 3.5;
        let houseHeight = this.canvas.height / 2;
        let roofSpace = 20;

        this.ctx.beginPath();
        this.ctx.fillStyle = super.Utils.grayColor;
        this.ctx.rect(houseX, houseY, houseWidth, houseHeight);
        this.ctx.fill();
        this.ctx.closePath();

        //Draw roof
        this.ctx.beginPath();
        this.ctx.fillStyle = super.Utils.redColor;
        this.ctx.moveTo(houseX - roofSpace, houseY);
        this.ctx.lineTo(houseX + houseWidth / 2, houseY - houseHeight + 100);
        this.ctx.lineTo(houseX + houseWidth + roofSpace, houseY);
        this.ctx.fill();
        this.ctx.closePath();
    }

    /**
     * Create the window in the house
     * @method createWindow
     * @param target
     */
    createWindow(target) {
        this.ctx.beginPath();
        this.ctx.fillStyle = target.windowbackground;
        this.ctx.rect(target.position.x, target.position.y, target.dimensions.width, target.dimensions.height);
        this.ctx.fill();
        this.ctx.closePath();

        // Add mouse to window

        this.drawImage(target);

    }

    /**
     * Main point to start the game.
     * Initialize static parameters and preload sounds here
     * @method init
     */
    init() {
        super.init();

        goodJob = new Audio(super.Utils.good3MouseSound);
        goodJob.load();

        ballCatchFail = new Audio(super.Utils.bad3MouseSound);
        ballCatchFail.load();

        audio = new Audio(super.Utils.rattleSound);
        audio.load();
        audio.addEventListener('onloadeddata', this.initGame(), false);
    }


    /**
     * Initialize each game round with initial object parameters
     * Randomize number of obstructions
     * Reset the sounds sources for older browser versions
     * Wait for start sound and start the main game loop
     * @method initGame
     */
    initGame() {
        super.initGame();
        pressed = Array(3).fill(false);

        const  trajectories = [

          {velocity: {x: 5.8, y: -7.0 }},
          {velocity: {x: 5.8, y: -6.5 }},
          {velocity: {x: 5.8, y: -5.8 }}

        ];
        let trajectory = trajectories[Math.floor(Math.random() * 3)];
        trajectory.velocity  = super.velocityToScale(trajectory.velocity);

        ball = {
            position: {x: paddleWidth * 5 + 20, y: (this.canvas.height - paddleWidth * 2)},
            velocity: trajectory.velocity,
            mass: super.Utils.ballMass,
            radius: paddleWidth / 6.5,
            restitution: super.Utils.restitution,
            color: super.Utils.yellowColor

        };

        targets = Array(3).fill({}).map((_, index) =>

          ({

            dimensions: {width: paddleWidth / 1.5, height: paddleWidth / 1.5},
            position: {
                x: (this.canvas.width / 2 - paddleWidth * 0.3) + this.canvas.width / 5.0,
                y: this.canvas.height / 2.6 + this.canvas.height / 4 + index * paddleWidth * 0.8
            },
            radius: 4,
            color: super.Utils.grayColor,
            roofcolor: super.Utils.redColor,
            windowbackground: super.Utils.blackColor,
            imageURL: imageURLS[index]

        })
        );

        initSoundPlaying = true;
        goodJob.src = super.Utils.good3MouseSound;
        ballCatchFail.src = super.Utils.bad3MouseSound;
        audio.src = super.Utils.rattleSound;
        audio.play();
        audio.addEventListener('ended', function () {

            initSoundPlaying = false;
        });

        super.initGame();

    }

    /**
     * Check collision of appropriate key and window
     * When ball hits the window set coordinates of the ball to the center of the reached window
     * @method  collisionDetection
     * @param index
     * @return {int} 2: key pressed matches the window target, 1: key pressed doesn't match the window,
     * 0: no window reached (might be redundant)
     */
    collisionDetection(index) {

        // Window collision detection
        let target = targets[index];
        if (ball.position.x > target.position.x && ball.position.x - ball.radius < target.position.x + target.dimensions.width ) {

            if (ball.position.y > target.position.y && ball.position.y - ball.radius < target.position.y + target.dimensions.height ) {

                //Put the ball in the center of target once it hits window constraints
                ball.position.x = target.position.x + target.dimensions.width / 2 - ball.radius / 2;
                ball.position.y = target.position.y + target.dimensions.height / 2 - ball.radius / 2;

                if (pressed[index]) {

                    return 2;

                }

                return 1;

            }

        }

        return 0;
    }


    /**
     * Set appropriate index value in pressed array, according to index of the key pressed
     * @method  keyDownHandler
     * @param e {object} event
     */
    keyDownHandler(e) {

        pressed = pressed.map((val, index) => keys[index] === e.key ? true : false);
    }


    /**
     * Main loop of the game
     * Set initial position of the ball in a box and starting rattling sound (initSoundPlaying).
     * After that  start ball trajectory.
     * If ball hits the target or missed the target(window) show the ball in the window and selected window
     * clicked by user (indicate the window background with color).
     * Increase the score if ball hits the target.
     * Move the ball to initial position.
     * Wait for some time until rattle sound played.
     * @method keyDownHandler
     */
    loop() {
        super.loop();

        super.createBallBox(paddleWidth);

        let collisionArray = Array(3).fill(0).map((_, index) => this.collisionDetection(index));
        let didHitWindow = collisionArray.some(item => item > 0);
        let didHitCorrectWindow = collisionArray.some(item => item === 2);
        if (super.gameOver) {
            super.waitSeconds(1500);
            super.finishGame(false);

        } else {

            if (!didHitWindow) {
                if (initSoundPlaying) {
                    super.moveBallToStart(ball, false);
                } else {

                    super.ballTrajectory(ball);
                }
            }

            this.createHouse();
            targets.forEach(target => this.createWindow(target));

            if (didHitWindow) {

                let index = pressed.findIndex(item => item != false);
                let target = targets[index];
                if (target) {
                    target.windowbackground = super.Utils.whiteColor;
                    this.createWindow(target);

                }

                if (didHitCorrectWindow) {
                    goodJob.play();

                } else {
                    ballCatchFail.play();

                }

                super.ballTrajectory(ball);
                super.moveBallToStart(ball, true);
                super.waitSeconds(600);

            }

        }

    }

    /**
     * @method dataCollection Data collection
     */
    dataCollection() {

    }

}
