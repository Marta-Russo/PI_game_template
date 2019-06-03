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

let ball = {};
let targets = [];
let pressed = {};
let keys = ['o', 'k', 'm']; //Might need to set as super parameter
let imageURLS = [];
let audio = {};
let ballCatchFail = {};
let goodJob = {};
let initSoundPlaying = false;
let currentTargetIndex = 0;
let initialTime = 0;
let initX = 0.7510;
let initVmatrix = [];
let walls = [];


/**
 * Main implementation of feed  the mice in the house game.
 * The user will operate with keyboard keys to predict which ball trajectory will hit which window
 * in the house.
 * The trajectory is randomized with various values in trajectories array
 * Initialize the mice image for each mouse as an array
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
        imageURLS = [super.Utils.blueMouseImage, super.Utils.greenMouseImage, super.Utils.redMouseImage];

    }

    /**
     * Draw image object according to object positions
     * @method drawImage
     * @param object
     */
    drawImage(object) {
        let image = new Image();
        image.src = object.imageURL;
        this.ctx.drawImage(image, object.position.x, object.position.y, object.dimensions.width, object.dimensions.height);
    }



    createRect(x,y,width,height,color){

        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.rect(x, y, width, height);
        this.ctx.fill();
        this.ctx.closePath();
    }


    targetCoord(index){
        index = index+1;
        let top = 1.01 + index/10+index*2/100;
        let leftBorder = (1.5310)*super.Utils.SCALE ;
        let topBorder =  top*super.Utils.SCALE;
        let rightBorder = (1.1+0.5310)*super.Utils.SCALE;


        let target = {

            dimensions: {width: rightBorder-leftBorder , height: 0.10*super.Utils.SCALE},
            position: {
                x: leftBorder,
                y: topBorder
            },
            radius: 4,
            color: super.Utils.grayColor,
            roofcolor: super.Utils.redColor,
            windowbackground: super.Utils.blackColor,
            imageURL: imageURLS[index-1]

        }

        return target;

    }



    wallSize(){

        return 0.5/3*walls[super.currentRounds];
    }

    /**
     * Draw house with roof according to coordinates
     * @method createHouse
     */
    createHouse() {


        //Draw House
        let leftBorder = (0.8+0.5310-this.wallSize())*super.Utils.SCALE ;
        let topBorder = (0.8)*super.Utils.SCALE;
        let rightBorder = (0.8+0.32+0.5310)*super.Utils.SCALE;
        let downBorder =  (1.3671+0.15)*super.Utils.SCALE ;

        this.createRect(leftBorder, topBorder, rightBorder-leftBorder, downBorder-topBorder,super.Utils.grayColor);



        //Draw roof
        this.ctx.beginPath();
        this.ctx.fillStyle = super.Utils.redColor;
        this.ctx.moveTo(((1.3310-this.wallSize()-0.1+1.7510)/2)*super.Utils.SCALE, 0.5*super.Utils.SCALE);
        this.ctx.lineTo((1.3310-this.wallSize()-0.1)*super.Utils.SCALE, 0.8*super.Utils.SCALE);
        this.ctx.lineTo(1.7510*super.Utils.SCALE, 0.8*super.Utils.SCALE);
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
        initVmatrix = super.uniformArr([1,2,3]);
        walls = super.uniformArr([1,2]);
        goodJob = new Audio(super.Utils.good3MouseSound);
        goodJob.load();

        ballCatchFail = new Audio(super.Utils.bad3MouseSound);
        ballCatchFail.load();

        audio = new Audio(super.Utils.rattleSound);
        audio.load();
        goodJob.src = super.Utils.good3MouseSound;
        ballCatchFail.src = super.Utils.bad3MouseSound;
        audio.src = super.Utils.rattleSound;
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
        initialTime =0;
        pressed = Array(3).fill(false);

        ball = {
            position: {x: 0, y: 0},
            mass: super.Utils.ballMass,
            radius: 10,
            restitution: super.Utils.restitution,
            color: super.Utils.yellowColor,
            timeReached:new Date().getTime()

        };

        ball = super.ballObject();

        targets = Array(3).fill({}).map((_, index) =>

          (this.targetCoord(index))
        );

        initSoundPlaying = true;
        audio.play();
        audio.addEventListener('ended', function () {
            initSoundPlaying = false;
            initialTime = new Date().getTime();
        });

        super.initGame();

    }


    /**
     * Show the ball location in window.
     * Center the ball location.
     * @method showBallLocation
     * @param target
     */
    showBallLocation(index){

        //Put the ball in the center of target once it hits window constraints
        this.ctx.beginPath();
        let target = targets[index];
        ball.position.x = target.position.x + target.dimensions.width / 2 - ball.radius / 2;
        ball.position.y = target.position.y + target.dimensions.height / 2 - ball.radius / 2;
        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.closePath();



    }



    /**
     * Set appropriate index value in pressed array, according to index of the key pressed
     * @method  keyDownHandler
     * @param e {object} event
     */
    keyDownHandler(e) {

        pressed = pressed.map((val, index) => keys[index] === e.key ? true : false);
    }



    createBallBox() {

        this.ctx.beginPath();
        this.ctx.lineWidth = '8';
        this.ctx.strokeStyle = super.Utils.blueColor;

        let leftBorder = (initX-0.07)*super.Utils.SCALE ;
        let topBorder = (1.3471-0.05)*super.Utils.SCALE;
        let rightBorder = (initX+0.07)*super.Utils.SCALE;
        let downBorder =  (1.3671+0.15)*super.Utils.SCALE ;

        this.ctx.rect(leftBorder,  downBorder, rightBorder - leftBorder, topBorder - downBorder);
        this.ctx.fillStyle = super.Utils.blackColor;
        this.ctx.lineWidth = '8';
        this.ctx.strokeStyle = super.Utils.blueColor;
        this.ctx.stroke();
        this.ctx.closePath();


        let InnerleftBorder = (initX+0.05)*super.Utils.SCALE ;
        let InnertopBorder = (1.2971)*super.Utils.SCALE;
        let InnerrightBorder = (initX+0.07)*super.Utils.SCALE;
        let InnerdownBorder =  (1.5171-0.12)*super.Utils.SCALE ;

        this.ctx.beginPath();
        this.ctx.rect(InnerleftBorder,  InnerdownBorder, InnerrightBorder - InnerleftBorder, InnertopBorder - InnerdownBorder);
        this.ctx.fillStyle = super.Utils.blackColor;
        this.ctx.strokeStyle = super.Utils.blackColor;
        this.ctx.lineWidth = '8';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
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
        super.generateTrajectoryParamsDiscreteSpatial(initVmatrix);
        this.createBallBox();


        let index = pressed.findIndex(item => item != false);

        if (ball.state === 'hit target') {

            super.waitSeconds(2500);
            super.finishGame(false);

        } else {


            if (ball.state === 'fall') {


                if (initSoundPlaying) {
                    super.moveBallToStart(ball, false);
                } else {
                    //Ball  is not flying past the house walls

                        super.trajectory(ball, initialTime);
                        super.drawBall(ball);

                }

            }
            this.createHouse();
            targets.forEach(target => this.createWindow(target));


            if(initialTime >0 &&  super.getElapsedTime(initialTime) >= 0.4 ){

                ball.state = 'hit house'
            }



            // Wait TIME_ALLOWED seconds to get the response
            if (initialTime > 0 && (index >= 0 || super.getElapsedTime(initialTime) >= 5.2)) {

                let pressed_target = targets[index];
                if (pressed_target) {
                    pressed_target.windowbackground = super.Utils.whiteColor;
                    this.createWindow(pressed_target);

                }

                let indexArr = [2,1,0];
                currentTargetIndex = indexArr[initVmatrix[super.currentRounds]-1];

                //Show ball only on button press
                if(index >=0) {
                    this.showBallLocation(currentTargetIndex);
                }
                super.waitSeconds(600);


                // Check if current index of the pressed item corresponds to the actual target index
                if (index === currentTargetIndex) {

                    goodJob.play();

                } else {

                    ballCatchFail.play();
                }

                ball.state = 'hit target';

            }




        }





    }

    /**
     * @method dataCollection Data collection
     */
    dataCollection() {

    }

}
