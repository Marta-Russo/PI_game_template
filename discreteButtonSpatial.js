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
const INITIAL_DELAY = 2.5;
let ball = {};
let targets = [];
let pressed = {};
let keys = ['y', 'g', 'v']; //Keyboard keys for upper,middle and lower windows
let currentTargetIndex = 0;
let initialTime = 0; // initial time for current game trial
let initVmatrix = []; //Initial velocity matrix uniformly distributed and randomized
let obstructions = []; // Array of possible obstructions parameters
let jitterT = 0; // Time jitter (variates from 500 ms to 1500 ms), time between sound start and ball starting to fly
let startTime = 0; // start of the game to wait before music playing
let buttonPressDelay = 0;
// Media arrays for loading
let windowImgs = [];
let windowImageURLS = [];
let obstrImgs = [];
let obstrImageURLS = [];
let sounds = [];
let soundURLs = [];
let imageURls = [];
let images = [];

// Media mapping as Enum
const gameSound = {
    START: 0,
    LAUNCH: 1,
    CATCH: 2,
    FAIL: 3
};

const gameImage = {
    LAUNCHER: 0,
    BALL: 1,
    TARGET: 2,
    window: {
        WINDOW1: 0,
        WINDOW2: 1,
        WINDOW3: 2
    },
    shuttle: {
        SMALL: 0,
        MIDDLE: 1,
        LARGE: 2
    }
};



/**
 * The user will operate with keyboard keys to predict which ball trajectory will hit which window
 * in the obstruction (shuttle).
 * The trajectory is randomized with various values in trajectories array
 * @class DiscreteButtonSpatial
 * @extends Base
 */
export default class DiscreteButtonSpatial extends Base {

    /**
     * @method constructor
     * @constructor constructor
     * @param context
     * @param document
     */
    constructor(context, document) {
        super(context, document);
        imageURls = [super.Utils.slimeMonster, super.Utils.slimeBall, super.Utils.splat];
        windowImageURLS = [super.Utils.openWindowYellow, super.Utils.openWindowGreen, super.Utils.openWindowViolet];
        obstrImageURLS = [super.Utils.shuttleNarrow, super.Utils.shuttle, super.Utils.shuttleWide];
        soundURLs = [super.Utils.monsterGrowl, super.Utils.monsterLaunch, super.Utils.good3MouseSound, super.Utils.bad3MouseSound];

    }

    /**
     * Get Current window position and align it according to possible obstruction (shuttle) size
     * @method getWindow
     * @param index of the target (shuttle) in array of objects
     * @return {{image: *, position: {x: number, y: number}, radius: number, dimensions: {width: number, height: number}}}
     */
    getWindow(index) {
        index = index + 1;
        let top = 1.12;
        let leftBorder = (1.5450) * super.Utils.SCALE;
        let windowPosition = gameImage.window.WINDOW1;
        switch (index) {

            case 2:

                top = 1.25;
                windowPosition = gameImage.window.WINDOW2;
                leftBorder = (1.555) * super.Utils.SCALE;

                break;

            case 3:

                top = 1.39;
                windowPosition = gameImage.window.WINDOW3;
                leftBorder = (1.555) * super.Utils.SCALE;
                break;

        }

        let topBorder = top * super.Utils.SCALE;

        return {
            dimensions: {width: 0.10238 * super.Utils.SCALE, height: 0.075 * super.Utils.SCALE},
            position: {
                x: leftBorder,
                y: topBorder
            },
            radius: 0.00956 * super.Utils.SCALE,
            image: windowImgs[windowPosition]
        };

    }



    /**
     * Draw target  according to coordinates
     * @method createBackground
     */
    createShuttle() {

        let leftBorder = 0.798 * super.Utils.SCALE;
        let topBorder = 0.78 * super.Utils.SCALE;

        let targetParams = {

            dimensions: {width: 1.19 * super.Utils.SCALE, height: 1.135 * super.Utils.SCALE},
            position: {x: leftBorder, y: topBorder}
        };


        this.getShuttle(targetParams);

    }


    /**
     *
     * Get shuttle image from sources and display according to position parameters
     * @param targetParams target position parameters
     * @method getShuttle
     */
    getShuttle(targetParams) {

        let index = obstructions[super.currentRounds]; // Get current shuttle case
        let shuttle = {};
        targetParams.position.x = {};

        switch (index) {

            case 2:
                targetParams.position.x = 0.798 * super.Utils.SCALE;
                shuttle = obstrImgs[gameImage.shuttle.MIDDLE];
                break;
            case 3:
                targetParams.position.x = 0.77 * super.Utils.SCALE;
                shuttle = obstrImgs[gameImage.shuttle.LARGE];
                break;
            default:
                targetParams.position.x = 0.81 * super.Utils.SCALE;
                shuttle = obstrImgs[gameImage.shuttle.SMALL];
                break;


        }

        super.drawImageObject(targetParams, shuttle);

    }


    /**
     * Create the window in the target
     * @method createTargetWindow
     * @param target
     */
    createWindow(target) {

        super.drawImageObject(target, target.image);

    }




    /**
     * Main point to start the game.
     * Initialize static parameters and preload sounds here
     * @method init
     */
    init() {
        startTime = new Date().getTime();
        initVmatrix = super.uniformArr([1, 2, 3]);
        // Randomize trajectory for each obstruction
        obstructions = [1,2,3].flatMap(  () => super.uniformArr([1, 2, 3], initVmatrix.length/3));
        super.fillAudioArray(soundURLs,sounds);
        super.fillImageArray(imageURls,images);
        super.fillImageArray(windowImageURLS,windowImgs);
        super.fillImageArray(obstrImageURLS,obstrImgs);


        sounds[gameSound.START].addEventListener('onloadeddata', this.initGame(), false);
        sounds[gameSound.START].addEventListener('playing', function () {
            initialTime = new Date().getTime();
        });
        super.init();
    }


    /**
     * Initialize each game round with initial object parameters
     * Randomize number of obstructions (obstructions)
     * Reset the sounds sources for older browser versions
     * Wait for start sound and start the main game loop
     * @method initGame
     */
    initGame() {
        initialTime = 0;
        pressed = Array(3).fill(false);
        jitterT = super.trialStartTime();
        buttonPressDelay = 0;
        ball = {
            position: {x: 0, y: 0},
            radius: 0.02385 * super.Utils.SCALE,
            restitution: super.Utils.restitution,
            timeReached: new Date().getTime()

        };

        ball = super.ballObject();

        if(super.currentRounds > 0 ){
            sounds[gameSound.START].play();
        }

        targets = Array(3).fill({}).map((_, index) =>

            (this.getWindow(index))
        );
        if(super.getElapsedTime(startTime) >= 2) {
            sounds[gameSound.START].play();
        }

        super.initGame();

    }


    /**
     * Show the ball location in window.
     * Center the ball location.
     * @method showBallLocation
     * @param index Index of the object in array
     */
    showBallLocation(index) {

        //Put the ball in the center of target once it hits window constraints
        let target = targets[index];

        let splat = {

            dimensions: {width: 0.09645 * super.Utils.SCALE, height: 0.09107 * super.Utils.SCALE},
            position: {x: target.position.x - 0.0238 * super.Utils.SCALE, y: target.position.y}
        };

        super.drawImageObject(splat, images[gameImage.TARGET]);


    }


    /**
     * Set appropriate index value in pressed array, according to index of the key pressed
     * @method  keyDownHandler
     * @param e {object} event
     */
    keyDownHandler(e) {

        if (ball.state !== 'hit' && ball.state !== 'hit target') {
            pressed = pressed.fill(false);
            pressed = pressed.map((val, index) => keys[index] === e.key );
        }

    }

    /**
     * Display launcher
     * @method discreteLauncher
     * @param image of the Launcher
     */
    discreteLauncher(image) {


        let leftBorder = (0.701) * super.Utils.SCALE;
        let topBorder = (1.3671) * super.Utils.SCALE;

        let launcher = {

            dimensions: {width: 0.19 * super.Utils.SCALE, height: 0.273 * super.Utils.SCALE},
            position: {x: leftBorder, y: topBorder}
        };
        super.drawImageObject(launcher, image);


    }


    /**
     * Main loop of the game
     * Set initial position of the ball in a box and starting sound .
     * After that  start ball trajectory.
     * If ball hits the target or missed the target(window) show the ball in the window and selected window
     * clicked by user (indicate the window background with color).
     * Increase the score if ball hits the window.
     * Move the ball to initial position.
     * Wait for some time until rattle sound played.
     * @method keyDownHandler
     */
    loop() {
        super.loop();
        super.generateTrajectoryParamsDiscreteSpatial(initVmatrix);
        this.discreteLauncher(images[gameImage.LAUNCHER]);

        let index = pressed.findIndex(item => item !== false);

        if(initialTime === 0 && super.currentRounds === 0  && super.getElapsedTime(startTime) >= INITIAL_DELAY) {

            sounds[gameSound.START].play();

        }

        if (ball.state === 'start') {
            super.moveBallToStart(ball, images[gameImage.BALL]);
            if (initialTime > 0 && super.getElapsedTime(initialTime) > jitterT) {
                sounds[gameSound.START].pause();
                sounds[gameSound.LAUNCH].play();
                initialTime = new Date().getTime();
                ball.state = 'fall';

            }


        }


        if (ball.state === 'fall') {

            super.trajectory(ball, initialTime);
            super.drawBall(ball, images[gameImage.BALL]);
            if (super.getElapsedTime(initialTime) >= 0.5) {

                ball.state = 'hit house';
            }


        }

        if ((ball.state === 'fall' || ball.state === 'hit house') && index >= 0) {

            ball.state = 'hit';

        }


        if (ball.state === 'hit house') {
            if (super.getElapsedTime(initialTime) >= 2.5) {
                initialTime = new Date().getTime();
                ball.state = 'hit';
            }

        }


        if (ball.state === 'hit') {

            if(buttonPressDelay === 0){
                buttonPressDelay = new Date().getTime();
            }

            if(buttonPressDelay >0 && super.getElapsedTime(buttonPressDelay) >= 0.5) {
                this.checkHitState(index);
            }

        }

        this.createShuttle();

        if (ball.state === 'hit target') {
            if (index >= 0) {
                let target = targets[index];
                this.createWindow(target);
                this.showWindow(index);
            }
            if (super.getElapsedTime(initialTime) >= 3) {
                super.finishGame(false);
            }


        }


    }

    /**
     * Show result after button press
     * @param index index of the selected button
     */
    checkHitState(index) {
        if (index >= 0) {
            let target = targets[index];
            this.createWindow(target);
            this.showWindow(index);
        }
        // Check if current index of the pressed item corresponds to the actual target index
        if (index === currentTargetIndex) {

            sounds[gameSound.CATCH].play();

        } else {
            sounds[gameSound.FAIL].play();
        }


        ball.state = 'hit target';
    }

    /**
     * Show selected window
     * @method showWindow
     * @param index
     */
    showWindow(index) {
        let pressed_target = targets[index];

        if (pressed_target) {
            this.createWindow(pressed_target);

        }

        let indexArr = [2, 1, 0]; //reverse index to get value
        currentTargetIndex = indexArr[initVmatrix[super.currentRounds] - 1];

        //Show ball only on button press
        if (index >= 0) {
            this.showBallLocation(currentTargetIndex);
        }
    }

    /**
     * Columns structure
     * window: 1,2,3 indicating correct location of where the slime will land - top, middle or bottom
     * selected_button : 0,1,2,3 indicating no button or which button was clicked.  0 : Y ,1:G , 2: V, 3 : no button
     * ship : 1,2,3 indicating size of spaceship (from small to bigger)
     * @method dataCollection
     */
    dataCollection() {
        super.dataCollection();


        let target_state = pressed.findIndex(item => item !== false);
        if(keys[target_state] === undefined){
            target_state = 3;
        }


        let exportData = {
            game_type: 'discreteButtonSpatial',
            window: currentTargetIndex+1,
            selected_button: target_state,
            obstruction_number: obstructions[super.currentRounds],
            ball_position_x: ball.position.x / this.canvas.width,
            ball_position_y:(this.canvas.height - ball.position.y)/this.canvas.height,
            trial: super.currentRounds,
            trialType: this.context.trialType,
            timestamp: super.getElapsedTime(initialTime)

        };
        if(ball.state === 'hit' || ball.state === 'fall') {
          //  super.storeData(exportData);
        }
    }

}
