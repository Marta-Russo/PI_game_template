/*
 * Developed by Gleb Iakovlev on 5/3/19 9:09 PM.
 * Last modified 4/29/19 10:46 PM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */
import Utils from './utils.js';

/**
 *
 * @submodule games
 *
 */

let dataLoop = {};
let gameLoop = {};
let mouseY = 0;
let gameOver = false;
let paddleWidth = 0;
let paddleHeight = 0;
let paddleBox = {x:0,y:0};
let currentRounds = 0;
let initBallY = 0.0;
let  initX = 0.52;
let initV = 0;
let gravity = 0;
let ballvx = 0;

// let INITIAL_SCREEN_WIDTH = this.canvas.width/1024; // X  screen from matlab
// let INITIAL_SCREEN_HEIGHT = this.canvas.height/768; // Y screen from matlab
const PADDLE_REST_TIME_MS = 500;

/**
 * Base class for common game functions
 * @class Base
 */
export default class Base {


    /**
     * @method Constructor to get parameters from caller
     * @constructor Constructor to get parameters from caller
     * @param context from component
     * @param document object from component
     */
    constructor(context, document) {
        this.context = context;
        this.document = document;
        this.canvas = this.document.getElementById('gamesCanvas');
        let height  =  768;
        this.canvas.height = height;
        this.canvas.width = 1024;
        this.ctx = this.canvas.getContext('2d');
        this.currentScore = 0;
        this.canvas.style.cursor = 'none';
        paddleWidth = this.canvas.width / 20;
        paddleHeight = this.canvas.width / 15;
        // Event listener for mouse and keyboard here
        document.addEventListener('keydown', this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);
        document.addEventListener('mousemove', this.onMouseMove);

    }


    /**
     * Initialize or start the game loop here
     * @method init
     */
    init() {
        this.currentScore = 0;
        this.currentRounds = 0;
        clearInterval(dataLoop);
        clearInterval(gameLoop);

    }

    /**
     * Get standard paddle width
     * @method paddleWidth
     * @return {number}
     */
    get paddleWidth(){

        return paddleWidth;
    }

    /**
     * Get standard paddle height
     * @method paddleHeight
     * @return {number}
     */
    get paddleHeight(){

        return paddleHeight;
    }

    /**
     * Draw paddle according to the location parameters
     * @method drawPaddle
     *
     */
    drawPaddle(paddle) {
        this.ctx.beginPath();
        this.ctx.rect(paddle.position.x, paddle.position.y, paddle.dimensions.width, paddle.dimensions.height);
        this.ctx.fillStyle = Utils.whiteColor;
        this.ctx.fill();
        this.ctx.closePath();
    }

    //TODO: Control uniform distribution for height
    generateHeights(){

        return Array.from({length: Utils.gameRounds}, () => Math.floor(Math.random() * (3-1))+1).map((value,index)=>value*4-3);
    }


    /**
     * Generate main trajectory parameters per trial
     * @method generateTrajectoryParams
     * @param hArr array of equally distributed height
     * @param height height correction coefficient
     * @param Tf Flight time coefficient
     */
    generateTrajectoryParams(hArr,height,Tf){

        let currentHeight = hArr[currentRounds]*0.05+height;
        gravity = 2*currentHeight/Math.pow(Tf,2);
        ballvx = (1.0310+0.02)/Tf;
        initV = 0.5*gravity*Tf;

    }

    /**
     * The box symbolizes initial paddle location
     * @method createPaddleBox
     */
    createPaddleBox(x,y) {
        this.ctx.beginPath();
        paddleBox = {x:x,y:y};
        let leftBorder = (1.8560-0.6525)*Utils.SCALE ;
        let topBorder = (1.3671-0.05+0.05)*Utils.SCALE;
        let rightBorder = (2.1110-0.6525)*Utils.SCALE;
        let downBorder =  (1.3671+0.15+0.05)*Utils.SCALE ;

        this.ctx.rect(leftBorder,  downBorder, rightBorder - leftBorder, topBorder - downBorder);
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.lineWidth = '8';
        this.ctx.strokeStyle = Utils.blueColor;
        this.ctx.stroke();


    }

    /**
     * Tree object with coordinates
     * @method treeObject
     * @param treeIndex
     * @returns {{imageURL: *, position: {x: number, y: number}, dimensions: {width: number, height: number}}}
     */
    treeObject(treeIndex = 1){

        let leftBorder = 400-50-55*treeIndex+0.25*Utils.SCALE;
        let topBorder = 384;
        let rightBorder = 400+0.25*Utils.SCALE;
        let downBorder =  768-96-24 ;

        return {position: {x: leftBorder, y:downBorder}, dimensions: {width:rightBorder-leftBorder,height:topBorder - downBorder},imageURL: Utils.treeImage};

    }



    /**
     * Stop all the game functions
     * @method stop
     */
    stop() {

        clearInterval(dataLoop);
        clearInterval(gameLoop);

    }

    /**
     * Abstract method
     * Triggered when participant pressed some key on keyboard
     * @method keyDownHandler
     * @param e event
     */
    keyDownHandler(e) {

        console.log(e);
    }

    /**
     * Abstract method
     * Triggered when participant released some key on keyboard
     * @method keyUpHandler
     * @param e event
     */
    keyUpHandler(e) {

        console.log(e);
    }


    /**
     * Data collection abstract method
     * @method dataCollection
     */
    dataCollection() {


        this.loopTimer = function () {
            let inst = this;
            dataLoop = setTimeout(function () {
                inst.dataCollection();
            }, 50);

        };

        this.loopTimer();

    }

    increaseScore() {
        this.currentScore++;
    }


    /**
     * Draw the game score
     * @method drawScore
     */
    drawScore() {
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = Utils.scoreColor;
        this.ctx.fillText('Score: ' + this.currentScore, 8, 20);

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = Utils.scoreColor;
        this.ctx.fillText('Round: ' + this.currentRounds, 100, 20);
    }


    /**
     * Abstract Main game loop method
     * @method loop
     */
    loop() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        this.drawScore();
        this.loopTimer = function () {
            let inst = this;
            gameLoop = setTimeout(function () {
                inst.loop();
            }, Utils.frameDelay);
        };

        this.loopTimer();
    }


    /**
     * Create initial ball box object to start from
     * @method createBallBox
     * @param {int} paddleWidth
     */
    createBallBox() {

        this.ctx.beginPath();
        this.ctx.lineWidth = '8';
        this.ctx.strokeStyle = Utils.blueColor;

        let leftBorder = 0.45*Utils.SCALE ;
        let topBorder = (1.3471-0.05)*Utils.SCALE;
        let rightBorder = (0.59)*Utils.SCALE;
        let downBorder =  (1.3671+0.15+0.05)*Utils.SCALE ;

        this.ctx.rect(leftBorder,  downBorder, rightBorder - leftBorder, topBorder - downBorder);
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.lineWidth = '8';
        this.ctx.strokeStyle = Utils.blueColor;
        this.ctx.stroke();
        this.ctx.closePath();


        let InnerleftBorder = (0.52)*Utils.SCALE ;
        let InnertopBorder = (1.2971)*Utils.SCALE;
        let InnerrightBorder = (0.59)*Utils.SCALE;
        let InnerdownBorder =  (1.5171-0.12)*Utils.SCALE ;

        this.ctx.beginPath();
        this.ctx.rect(InnerleftBorder,  InnerdownBorder, InnerrightBorder - InnerleftBorder, InnertopBorder - InnerdownBorder);
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.strokeStyle = Utils.blackColor;
        this.ctx.lineWidth = '8';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    /**
     * @method mouseY Set current cursor position
     * @param {number} mouse cursor Y coordinate
     */
    set mouseY(val) {

        mouseY = val;
    }

    /**
     * @method  mouseY Get current cursor position
     * @return {number} mouse cursor Y coordinate
     */
    get mouseY() {

        return mouseY;
    }

    /**
     * @method gameOver Set method if game is over
     * @param {boolean} game is over
     */
    set gameOver(val) {

        gameOver = val;
    }

    get currentRounds(){

        return currentRounds;
    }

    set currentRounds(val){

        currentRounds = val;
    }


    /**
     * Get method if game is over
     * @method gameOver
     * @return {boolean} game is over
     */
    get gameOver() {

        return gameOver;
    }

    /**
     * Get shared Utils objects
     * @method Utils
     * Get Utilities game constants
     * @return {Utils}
     * @constructor
     */
    get Utils() {

        return Utils;
    }


    /**
     * Get trajectory parameters per each trial
     * @method TrajectoryVars
     * @returns {{initX: number, ballvx: number, gravity: number, initV: number}}
     * @constructor
     */
    get TrajectoryVars(){

        return {initX:initX,gravity:gravity,ballvx:ballvx,initV:initV};
    }


    /**
     * Show current image
     * @method drawImage
     * @param {object} Current object with x,y position, width , height and URL of the image to show
     * @param {String} URL
     */
    drawImage(object, URL) {
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.fillRect(object.position.x, object.position.y, object.dimensions.width, object.dimensions.height);
        let image = new Image();
        image.src = URL;
        this.ctx.drawImage(image, object.position.x, object.position.y, object.dimensions.width, object.dimensions.height);
    }


    /**
     * Show current image
     * @method drawImage
     * @param {object} Current object with x,y position, width , height and URL of the image to show
     * @param {String} URL
     */
    drawImageAngle(object, URL,angle) {
        this.ctx.save();
        this.ctx.fillStyle = Utils.blackColor;
        this.ctx.fillRect(object.position.x-object.dimensions.width, object.position.y, object.dimensions.width*4, object.dimensions.height*4);
        //find center of rotation
        let x = (object.position.x +object.dimensions.width/2 );
        let y = (object.position.y +object.dimensions.height);
        this.ctx.translate(x, y);
        this.ctx.rotate(angle*Math.PI/180);
        let image = new Image();
        image.src = URL;
        this.ctx.drawImage(image,-(object.dimensions.height/2), -(object.dimensions.width/2),object.dimensions.height, object.dimensions.width);
        this.ctx.restore();
    }

    /**
     * Disabled for now
     * @method storeData Store data in proposed array
     * @param {array} exportData
     */
    storeData(exportData) {

        // this.context.get('export_arr').addObject(exportData);
         this.context.export_arr.push(exportData);
      //  console.log(exportData);
    }


    /**
     * Initialize current round of the game
     * @method initGame
     */
    initGame() {

        this.loopTimer = function () {
            let inst = this;
            gameLoop = setTimeout(function () {
                inst.loop();
            }, Utils.frameDelay);

            dataLoop = setTimeout(function () {
                inst.dataCollection();
            }, 50);

        };

        this.loopTimer();




    }


    /**
     * Finish current round and check for rounds left
     * @method finishGame
     * @param {boolean} should increase score
     */
    finishGame(score) {

        this.currentRounds++;
        console.log('finishGame');
        this.clearInterval();
        if (score) {
            this.increaseScore();
        }
        this.gameOver = false;
        if (this.currentRounds < Utils.gameRounds) {
            this.initGame();

        }else {
          //  this.context.set('showInstructions', true);

            this.context.next();
        }

    }

    /**
     * Clear all current running game loops
     * @method clearInterval
     */
    clearInterval() {
        for (let i = 1; i < 99999; i++) {
            window.clearInterval(i);
        }
    }

    /**
       * Set velocity of moving object to scaling factor of the screen
       * @method velocityToScale
       * @param object
       * @return {{x: number, y: number}}
       */
    velocityToScale(object) {
        let trajectory  = {x: 0, y: 0 };
        let height  =  this.canvas.offsetHeight;
        let width  =  this.canvas.offsetWidth;
        let heightSF =  height / 600;
        let widthSF =  width / 1200;
        trajectory.x =  object.x * widthSF;
        trajectory.y =  object.y * heightSF;
        return trajectory;
    }

    /**
     * Create ball movement up to some trajectory
     * Set time coefficients scaleX,scaleY  as time parameters to control
     * speed in time
     * @method ballTrajectory
     * @param {object} ball
     * @param {number} scaleX
     * @param {number} scaleY
     */
    ballTrajectory(ball,scaleX=1,scaleY=1) {
        let gravity =  9.81;  // m / s^2
        //density of the environment
        let rho = 1; // kg/ m^3
        let Cd = 1;  // Dimensionless/
        // frontal area or frontal projection of the object (ball)
        let A = Math.PI * ball.radius * ball.radius / (10000); // m^2
        //Aerodynamics drag
        let Fx = -0.5 * Cd  * A  * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
        let Fy = -0.5 * Cd  *A  * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        let ax = Fx ;
        let ay = gravity + (Fy );

        ball.velocity.x += ax * Utils.frameRate*scaleX;
        ball.velocity.y += ay * Utils.frameRate*scaleY;
        ball.position.x += ball.velocity.x * Utils.frameRate * 100 * scaleX;
        ball.position.y += ball.velocity.y * Utils.frameRate * 100 * scaleY ;

        this.ctx.translate(ball.position.x, ball.position.y);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

    }

    /**
     * @method basketCenter
     * Center of the basket target
     * @param basket
     * @returns {{color: string, position: {x: number, y: number}, dimensions: {width: number, height: number}}}
     */
    basketCenter(basket){
        let radiusRim = 0.1;
        let leftBorder =  (1.3310-radiusRim/5)*Utils.SCALE;
        let topBorder =  basket.position.y ;
        let rightBorder = (1.3310+radiusRim/5)*Utils.SCALE;


        return {  position : {x:leftBorder,y: topBorder }, dimensions: {width: rightBorder - leftBorder, height:  (radiusRim/5)*Utils.SCALE },color:Utils.redColor}
    }


    /**
     * @method basketObject
     * Basket object per Matlab coordinates
     * @param basket
     * @returns {*}
     */
    basketObject(basket){

        let radiusRim = 0.1;
        let leftBorder = (1.3310-radiusRim)*Utils.SCALE ;
        let topBorder = 1.3671*Utils.SCALE;
        let rightBorder = (1.3310+radiusRim)*Utils.SCALE;
        let downBorder =  (1.3671+0.17)*Utils.SCALE ;

        basket.position = {x: leftBorder,y:downBorder};
        basket.dimensions = {width: rightBorder - leftBorder, height:downBorder -  topBorder };

        return basket;

    }



    /**
     * @method paddleHistory
     * Store paddle position and time history for velocity calculation
     */
    paddleHistory(paddle,initialTime){
        // Keep only 9 previous values to calculate velocity
        if(paddle.positions.length > 50){
            paddle.positions = [];
            paddle.times = [];

        }
        paddle.times.push(this.getElapsedTime(initialTime));
        paddle.positions.push(paddle.position.y/this.canvas.height);

    }

    /**
     * @method basketObject
     * Basket object per Matlab coordinates
     * @param basket
     * @returns {paddle}
     */
    paddleObject(paddle){

        let leftBorder = (1.3310-0.075)*Utils.SCALE ;
        let topBorder = (1.3671-0-paddle.position.y)*Utils.SCALE;
        let rightBorder = (1.3310+0.075)*Utils.SCALE;
        let downBorder =  (1.3671+0.02-paddle.position.y)*Utils.SCALE ;

        paddle.position = {x: leftBorder,y:downBorder};
        paddle.dimensions = {width: rightBorder - leftBorder, height: topBorder - downBorder};

        return paddle;

    }



    ballObject(){

      let  ball = {

            position: {x: (initX)*Utils.SCALE, y:( 1.3571-0.0175)*Utils.SCALE},
            velocity: 0,
            mass: Utils.ballMass,
            radius: (0.04)*Utils.SCALE/2,
            state: 'fall',
            impactTime: 0,
            impactPosition:0,
            positions:[{x:0,y:0}],
            color: Utils.yellowColor

        };

        return ball;
    }

    /**
     * @method getElapsedTime
     * Get elapsed time as iterator in seconds
     * @param intialTime
     * @returns {number}
     */
    getElapsedTime(intialTime){

        return (new Date().getTime()- intialTime)/1000 ;
    }

    /**
     * @method trajectory
     * Projectile motion trajectory per maximum distance
     * @param ball
     * @param ballvx
     * @param initV
     * @param Gravity
     * @param iterator
     */
    trajectory(ball,initialTime){

        let  iterator =  this.getElapsedTime(initialTime);
        this.ctx.beginPath();

        let positionY = 0+initV*(iterator)+0.5*-gravity*Math.pow(iterator,2);
        let positionX  = initX + ballvx*(iterator);


        let leftBorder =  (positionX-.0175)* Utils.SCALE;
        let topBorder = (1.3571-positionY-.0175)*Utils.SCALE;
        let rightBorder = (positionX+.0175)*Utils.SCALE;
        let downBorder =  (1.3571-positionY+.0175)*Utils.SCALE ;
        if(ball.positions.length > 30){
            ball.positions = [];
        }
        ball.positions.push(ball.position);
        ball.position.x = leftBorder;
        ball.position.y = downBorder;

    }


    /**
     * @method bounceTrajectory
     * Trajectory after bounce
     * @param ball
     * @param paddle
     * @param initialTime
     */
    bounceTrajectory(ball,paddle,initialTime){
        let  Xiterator =  this.getElapsedTime(initialTime);
        let  Yiterator =  this.getElapsedTime(ball.impactTime);


        this.ctx.beginPath();
        let positionY = ball.impactPosition+paddle.releaseVelocity*(Yiterator)+0.5*-gravity*Math.pow(Yiterator,2);
        let positionX  = initX + ballvx*(Xiterator);


        let leftBorder =  (positionX-.0175)* Utils.SCALE;
        let topBorder = (1.3571-positionY-.0175)*Utils.SCALE;
        let rightBorder = (positionX+.0175)*Utils.SCALE;
        let downBorder =  (1.3571-positionY+.0175)*Utils.SCALE ;

        if(ball.positions.length > 30){
            ball.positions = [];
        }
        ball.positions.push(ball.position);
        ball.position.x = leftBorder;
        ball.position.y = downBorder;


    }


    /**
     * @method drawBall
     * Draw ball per x,y ball location
     * @param ball
     */
    drawBall(ball){

        this.ctx.translate( ball.position.x,  ball.position.y);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

    }


    /**
     * Set position of the ball to initial coordinates to symbolize the start of the game
     * @method moveBallToStart
     * @param {object} ball object parameters
     * @param {boolean} gameOver set game to be over
     */
    moveBallToStart(ball, gameOver) {

        ball = this.ballObject();
        this.drawBall(ball);

        if (gameOver) {
            this.gameOver = true;
        }
    }

    /**
     * Check if user returned paddle to initial coordinates and call finish of the game to restart
     * current round
     * Check if paddle is stationary for PADDLE_REST_TIME_MS, if yes proceed to the next trial
     * @method paddleAtZero
     * @param {object} paddle
     * @param {boolean} score should increase score
     */
    paddleAtZero(paddle, score) {


        let topBorder = (1.3671-0.05+0.05)*Utils.SCALE;
        let downBorder =  (1.3671+0.15+0.05)*Utils.SCALE ;

        if (paddle.position.y >= topBorder ) {
            // Check if paddle is not moving inside the box
            let paddleTimeArrSize = paddle.positions.length;
            if(paddle.paddleLastMovedMillis === 0 || (paddle.position.y !== paddle.positions[paddleTimeArrSize-1]*this.canvas.height)){
                paddle.paddleLastMovedMillis = new Date().getTime();

            }else if(new Date().getTime() - paddle.paddleLastMovedMillis  >= PADDLE_REST_TIME_MS){
                paddle.paddleLastMovedMillis == 0;
                this.finishGame(score);
            }

        }else{

            paddle.paddleLastMovedMillis === 0;
        }

    }


    /**
     * Minimal implementation of interruption between rounds
     * @method waitSeconds
     * @param {int} iMilliSeconds
     */
    waitSeconds(iMilliSeconds) {
        let counter = 0;
        let start = new Date().getTime();
        let end = 0;

        while (counter < iMilliSeconds) {
            end = new Date().getTime();
            counter = end - start;

        }
    }

    /**
     * Set paddle coordinates up to velocity
     * @method paddleMove
     * @param {object} paddle
     */
    paddleMove(paddle,initialTime) {


        paddle.position.y = this.mouseY;

        this.paddleHistory(paddle,initialTime);


    }


    /**
     * Walls and target collisions detection
     * @method wallCollision
     * @param {object} ball
     * @return {boolean} if hit any edge of the screen
     */
    wallCollision(ball) {

        if (ball.position.y > this.canvas.height + ball.radius || ball.position.x > this.canvas.width + ball.radius || ball.position.x < ball.radius) {

            return true;

        }

        return false;

    }

    onMouseMove(e) {

        mouseY = e.clientY;

    }




}
