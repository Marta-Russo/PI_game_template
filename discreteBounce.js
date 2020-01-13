/*
 * Developed by Gleb Iakovlev on 5/3/19 9:09 PM.
 * Last modified 4/27/19 3:26 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */
import PaddleGames from './paddleGames.js';

/**
 *
 * @submodule games
 *
 */
let target = {}; // Target parameters object
let alpha = 0.7; // Restitute factor
let hArray = []; // Actual height parameters are calculated from the Initial height by multiplying the  uniformly randomized  values in  vector
let jitterT = 0; // Time jitter (variates from 500 ms to 1500 ms), time between sound start and ball starting to fly
let Height = 0.65; // Current trajectory height
let token = {}; // Token parameters object
let tokenReached = {}; // Token parameters object when target is reached
let bricks = {}; // Bricks positions parameters object
// Media arrays for loading
let sounds = [];
let soundURLs = [];
let imageURLs = [];
let images = [];

// Media mapping as Enum
const gameSound = {
    START: 0,
    BOUNCING: 1,
    CATCH_GREAT: 2,
    CATCH_GOOD: 3,
    FAIL:4
};

const gameImage = {
    PADDLE: 0,
    WALL_INITIAL: 1,
    WALL_MISSED: 2,
    BALL: 3,
    BALLBOX: 4,
    BRICKS_SMALL: 5,
    BRICKS_LARGE: 6,
    TOKEN: 7
};





/**
 * Main implementation of Bounce  game.
 * The user will operate with paddle to bounce the ball into the object target.
 * The trajectory is randomized with various values in trajectories array
 * @class DiscreteBounce
 * @extends Base
 *
 */
export default class DiscreteBounce extends PaddleGames {


    /**
     * Constructor to get parameters from caller
     * @method constructor
     * @constructor constructor
     * @param context from component
     * @param document object from component
     */
    constructor(context, document) {

        super(context, document);
        soundURLs = [super.Utils.drumRollSound, super.Utils.bouncingSound, super.Utils.brickHitlarge, super.Utils.brickHitsmall, super.Utils.ballcatchFailSound];
        imageURLs = [this.Utils.paddleImage, super.Utils.wallInitial, super.Utils.wallMissed, super.Utils.basketBall, super.Utils.basketBalls, super.Utils.smallbricksImage, super.Utils.largebricksImage, super.Utils.tokenImage];

    }

    /**
     * Main point to start the game.
     * Initialize static parameters and preload sounds here
     * @method init
     */
    init() {
        document.addEventListener("mousemove", super.onMouseMove);

        if(this.context.trialType === 'demo'){
            hArray =   this.context.demoTrajectories;
        }else{
            hArray = super.generateHeights();
        }



        let leftBorder = (1.75) * super.Utils.SCALE;
        let downBorder = (0.35) * super.Utils.SCALE;

        target = {

            dimensions: {width: 0.4 * super.Utils.SCALE, height: 0.43 * super.Utils.SCALE},
            position: {x: leftBorder, y: downBorder}
        };


        bricks = {

            dimensions: {width: 0.2 * super.Utils.SCALE, height: 0.2 * super.Utils.SCALE},
            position: {x: 1.7 * super.Utils.SCALE, y: 1.367 * super.Utils.SCALE}

        };


        token = {

            dimensions: {width: 0.147 * super.Utils.SCALE, height: 0.14 * super.Utils.SCALE},
            position: {x: 2.05 * super.Utils.SCALE, y: 0.28 * super.Utils.SCALE}

        };

        tokenReached = {

            dimensions: {width: token.dimensions.width * 2, height: token.dimensions.height * 2},
            position: {
                x: 2 * super.Utils.SCALE,
                y: 0.25 * super.Utils.SCALE
            }
        };

        super.fillAudioArray(soundURLs,sounds);
        super.fillImageArray(imageURLs,images);

        sounds[gameSound.START].addEventListener('canplaythrough', this.initGame(), false);
        sounds[gameSound.START].addEventListener('playing', super.onSoundEvent);
        super.init();
    }


    paddleBoxParameters() {
        let leftBorder = (1.2035) * super.Utils.SCALE;
        let topBorder = (1.42) * super.Utils.SCALE;
        let rightBorder = (1.4585) * super.Utils.SCALE;
        let downBorder = (1.5671) * super.Utils.SCALE;
        let paddleBox = {
            position: {x: 0, y: 0},
            dimensions: {width: 0, height: 0}
        };

        paddleBox.position.x = leftBorder;
        paddleBox.position.y = topBorder;
        paddleBox.dimensions.width = rightBorder - leftBorder;
        paddleBox.dimensions.height = downBorder - topBorder;
        super.paddleBox = paddleBox;
    }

    /**
     *
     * Main loop of the game.
     * Set initial position of the ball in a box and starting  sound .
     * After that  start ball trajectory.
     * If ball hits the target or missed the target (hits any screen edge) wait util user places the paddle to starting position and move
     * the ball to initial position.
     * Increase the score if ball hits the target.
     * Currently game has 2 states when ball hits the target : good (hits the target within the window), very good
     * (hits exact target)
     * @method loop
     */
    loop() {
        super.loop();
        super.paddleObject();
        let paddleBoxColor = super.Utils.blueColor;
        super.createPaddleBox(paddleBoxColor);
        super.generateTrajectoryParams(hArray[super.currentRounds], Height);
        super.createLauncher(images[gameImage.BALLBOX]);
        super.drawImageObject(super.paddle,images[gameImage.PADDLE]);
        super.paddleMove();
        this.paddleBallCollision();
        let hitTheTarget = this.collisionDetection();
        let hitTheWall = super.wallCollision();

        if (super.gameState.initialTime === 0  ) {

            sounds[gameSound.START].play();
        }

        if (super.ball.state === 'start') {
            super.moveBallToStart( images[gameImage.BALL]);
            if (super.gameState.initialTime > 0 && super.isOutsideBox(super.paddle.dimensions.height*7)) {
                super.gameState.initialTime = 0;
                sounds[gameSound.START].pause();
                sounds[gameSound.START].currentTime = 0;
                paddleBoxColor = super.Utils.redColor;
                super.createPaddleBox(paddleBoxColor);
            }
            if (super.gameState.initialTime > 0 && super.getElapsedTime() > jitterT) {
                sounds[gameSound.START].pause();
                sounds[gameSound.START].currentTime = 0;
                super.ball.state = 'fall';
                super.gameState.initialTime = new Date().getTime();
            }

        }

        if ((hitTheTarget || hitTheWall) && super.ball.state !== 'done') {

            super.ball.state = 'hit';
        }


        if (super.ball.state === 'fall') {
            if (super.gameState.initialTime > 0 && super.getElapsedTime() < 1.2) {
                super.trajectory();
            }

            if (super.gameState.initialTime > 0 && super.ballIsOnFloor()) {
                super.ball.state = 'hit';
            }
            super.drawBall(images[gameImage.BALL]);
        }

        if (super.ball.state === 'bounce') {
            this.bounceTrajectory();
            super.drawBall(images[gameImage.BALL]);

        }
        this.createBackTriangle();
        super.drawImageObject(token, images[gameImage.TOKEN]);



        if (super.ball.state === 'hit') {
            // Remove ball and show in the starting point,
            //User should set the paddle to initial position , call stop after that
            super.drawImageObject(token, images[gameImage.TOKEN]);
            if (super.ball.hitstate === 'very good') {
                sounds[gameSound.CATCH_GREAT].play();
                super.increaseScore();

            } else if (super.ball.hitstate === 'good') {
                sounds[gameSound.CATCH_GOOD].play();
                super.increaseScore();

            } else {
                sounds[gameSound.FAIL].play();
            }

            this.dataCollection();
            super.ball.state = 'done';

        }


        if (super.ball.state === 'done') {

            if (super.ball.hitstate === 'very good') {
                super.drawImageObject(bricks, images[gameImage.BRICKS_LARGE]);
                super.drawImageObject(tokenReached, images[gameImage.TOKEN]);
            } else if (super.ball.hitstate === 'good') {
                super.drawImageObject(target, images[gameImage.WALL_MISSED]);
                super.drawImageObject(bricks, images[gameImage.BRICKS_SMALL]);
            } else {
                super.drawImageObject(target, images[gameImage.WALL_INITIAL]);
            }

            super.paddleAtZero( false);


        }

        if (super.ball.state !== 'done') {

            super.drawImageObject(target, images[gameImage.WALL_INITIAL]);
        }

        super.paddleMove();
        this.createWallBoarders();

    }



    /**
     * Trajectory of the ball after bounce event
     * @method bounceTrajectory
     */
    bounceTrajectory() {
        let Xiterator = super.getElapsedTime();
        let Yiterator = super.getElapsedTime(super.ball.impactTime);

        this.ctx.beginPath();
        let positionY = super.ball.impactPosition + super.paddle.releaseVelocity * (Yiterator) + 0.5 * -super.TrajectoryVars.gravity * Math.pow(Yiterator, 2);
        let positionX = super.TrajectoryVars.initX + super.TrajectoryVars.ballvx * (Xiterator);
        let leftBorder = (positionX - 0.0175) * super.Utils.SCALE;
        // CLear past ball  positions
        if(super.ball.positions.length > 80){
            super.ball.positions = super.ball.positions.slice(-80);
        }
        super.ball.positions.push(super.ball.position);
        super.ball.position.x = leftBorder;
        super.ball.position.y = this.canvas.height - positionY * super.Utils.SCALE ;


    }


    /**
     *
     * Handle paddle collision here
     * Adjust velocity to the ball by restitution factor
     * Release velocity calculation ,  alpha : restitute factor = 0.7
     * ball_velocity  =   initV  -  gravity *  t  , where t is the time since start of the trajectory
     * paddleVelocity  :  calculated from n past  vector values of paddle y coordinates (in pixel values)  and time in
     * seconds
     * @method paddleBallCollision
     */
    paddleBallCollision() {

        //Detect the ball position on X axis , if the ball is between paddle edges
        if (super.ball.position.x >= (1.256) * super.Utils.SCALE - 0.04 * super.Utils.SCALE && super.ball.position.x <= (1.406) * super.Utils.SCALE) {

            //Check if paddle actually moved on Y axis and delta is significant enough
            let paddleDelta = super.paddle.positions[super.paddle.positions.length - 1] - super.paddle.positions[super.paddle.positions.length - 20];
            if (paddleDelta < 0.1) {
                paddleDelta = 0.1;
            }
            //Detect the ball position on Y axes, if the ball is within range  on Y axis
            if (Math.abs(super.ball.position.y - super.paddle.position.y) <= paddleDelta * super.Utils.SCALE && super.ball.position.y - super.paddle.position.y >= 0) {
                sounds[gameSound.BOUNCING].play();

                this.releaseVelocity(paddleDelta);

                //Fix for abrupt trajectory, make sure the trajectory is not negative
                if (super.paddle.releaseVelocity > 2.5) {
                    super.paddle.releaseVelocity = 2.5;
                }


                super.ball.state = 'bounce';
                // Update initial position of ball according to trajectory to prevent possible gap
                this.bounceTrajectory();
            }
        }

    }

    /**
     * Calculates release velocity and paddle velocity
     * @method releaseVelocity
     * @param {int} paddleDelta  Check if paddle actually moved on Y axis
     */
    releaseVelocity(paddleDelta) {
        let paddleVelocity = super.Utils.getPaddleVelocity(super.paddle.times, super.paddle.positions);
        super.paddle.paddleLastMovedMillis = new Date().getTime();
        super.ball.impactTime = new Date().getTime();
        super.ball.impactPosition = (this.canvas.height - (super.paddle.position.y - super.paddle.dimensions.height - paddleDelta)) / super.Utils.SCALE;
        let iterator = super.getElapsedTime();
        super.ball.velocity = super.TrajectoryVars.initV - super.TrajectoryVars.gravity * iterator;
        super.paddle.releaseVelocity = -alpha * (super.ball.velocity - paddleVelocity) + paddleVelocity;
    }

    /**
     * Set gray boarders to symbolize upper and lower bounds for wall targets
     */
    createWallBoarders(){

        this.ctx.beginPath();

        //Upper bound
        this.ctx.moveTo(this.getXBoundValues(0.1 ), 0.1);
        this.ctx.lineTo(this.getXBoundValues(0.49 * super.Utils.SCALE), 0.49 * super.Utils.SCALE);
        this.ctx.lineTo(this.getXBoundValues(0.367 * super.Utils.SCALE) + 0.248 * super.Utils.SCALE, 0.367 * super.Utils.SCALE);
        this.ctx.lineTo(this.getXBoundValues(0 ) + 0.248 * super.Utils.SCALE, 0);
        this.ctx.fillStyle = super.Utils.grayColor;
        this.ctx.fill();



        //Lower bound
        this.ctx.moveTo(this.getXBoundValues(0.768 * super.Utils.SCALE ), 0.768 * super.Utils.SCALE);
        this.ctx.lineTo(this.getXBoundValues(screen.height), screen.height);
        this.ctx.lineTo(this.getXBoundValues(screen.height ) + 0.248 * super.Utils.SCALE, screen.height);
        this.ctx.lineTo(this.getXBoundValues(0.645 * super.Utils.SCALE ) + 0.248 * super.Utils.SCALE, 0.645 * super.Utils.SCALE);

        this.ctx.fillStyle = super.Utils.grayColor;
        this.ctx.fill();


    }

    /**
     *  Triangle behind the wall to make sure the ball is not visible
     */
    createBackTriangle(){
        this.ctx.beginPath();
        this.ctx.moveTo(this.getXBoundValues(screen.height ) + 0.248 * super.Utils.SCALE, screen.height);
        this.ctx.lineTo(screen.width, 0);
        this.ctx.lineTo(this.getXBoundValues(0 ) + 0.248 * super.Utils.SCALE, 0);
        this.ctx.fillStyle = super.Utils.blackColor;
        this.ctx.fill();



    }


    /**
     *
     * Check if ball reached the target
     * @method collisionDetection
     * @return {boolean}
     */
    collisionDetection() {



        let YL = (0.46 ) * super.Utils.SCALE;
        let YH = (0.4 + 0.35) * super.Utils.SCALE;

        let targetx  = this.getXBoundValues(super.ball.position.y);

        if((super.ball.position.y < YL && super.ball.position.x > this.getXBoundValues(YL) )|| (super.ball.position.y > YH && super.ball.position.x > this.getXBoundValues(YH))){

            return true;
        }

        if (super.ball.state !== 'done' && super.ball.position.y > YL && super.ball.position.y < YH && super.ball.position.x > targetx) {
            let currenImpactCoord = Math.abs(super.ball.position.y - 0.6 * super.Utils.SCALE);
            if (currenImpactCoord < 0.27 * super.Utils.SCALE) {

                super.ball.hitstate  = (currenImpactCoord < 0.015 * super.Utils.SCALE)?'very good':'good';

            } else {

                super.ball.hitstate = 'hit';

            }


            return true;

        }


        return false;
    }

    /**
     * Get target  bounds for x coordinate according to slope equation
     * @param y position
     * @returns {number} x position
     */
    getXBoundValues(y) {
        return (y + 1.44 * super.Utils.SCALE) / 1.1;
    }

    /**
     *
     * Initialize each game round with initial object parameters
     * Randomize number of obstructions
     * @method initGame
     */
    initGame() {

        super.initX = 0.52;
        super.initBallY = 0;
        this.paddleBoxParameters();
        jitterT = super.trialStartTime();
        super.ballObject();
        super.paddle.times = [];
        super.paddle.positions = [];

        token.dimensions = {width: 0.21 * super.Utils.SCALE, height: 0.2 * super.Utils.SCALE};
        //For first trial wait for paddle to start in Box position, make sure the paddle is not moved
        if (super.currentRounds > 0 || (super.currentRounds === 0 && !super.paddleIsMoved())) {
            sounds[gameSound.START].play();
        }

        super.initGame();

    }


    /**
     *
     * Export data
     * trajectory : 1,2,3 (high, medium or low trajectory).
     * @method dataCollection
     */
    dataCollection() {
        if(super.ball.state === 'hit' || super.ball.state === 'bounce' || super.ball.state === 'fall') {
            let exportData = {
                game_type: 'BounceGame',
                trajectory: hArray[super.currentRounds],
                ball_position_x: super.convertXvalue(super.ball.position.x),
                ball_position_y: super.convertYvalue(super.ball.position.y),
                ball_timestamp: super.ball.timestamp,
                paddle_center_x: super.convertXvalue(super.paddle.position.x   +  (super.paddle.dimensions.width / 2)) ,
                paddle_x: super.convertXvalue(super.paddle.position.x),
                paddle_position_y: super.convertYvalue(super.paddle.position.y),
                paddle_timestamp: super.paddle.time,
                trial: super.currentRounds,
                trialType: this.context.trialType,
                feedback: super.ballState(),
                scale: super.Utils.scale,
                window_height: screen.height,
                window_width: screen.width,
                timestamp: super.getElapsedTime()

            };


            super.storeData(exportData);
        }
        super.dataCollection();
    }

}
