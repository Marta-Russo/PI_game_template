/*
 * Developed by Gleb Iakovlev on 4/6/19 11:11 AM.
 * Last modified 4/6/19 11:11 AM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

/**
 * @class Utils
 * Shared Utility class for project static methods and constants
 */
export default class Utils{

    static get  frameRate() {  return 1 / 200; } // Seconds
    static get  frameDelay() { return 10; } // ms
    static get  paddleSpeed() {return 1;}
    static get  ballMass() {return 0.1;}
    static get  restitution() {return -1.2;}
    static get  gameRounds() {return 20;}
    static get  gravityFactor() {return 1;}
    static get  SCALE(){return 420;}


    //Sound Resources
    //static get  bucketImageResource() {return 'https://piproject.s3.us-east-2.amazonaws.com/Resources/images/';}
    static get  bucketImageResource() {return 'Resources/images/';}
    //static get  bucketSoundResources() {return 'https://piproject.s3.us-east-2.amazonaws.com/Resources/sounds/';}
    static get  bucketSoundResources() {return 'Resources/sounds/';}
    static get  bouncingSound() {return this.bucketSoundResources + 'BallBouncing.mp3';}
    static get  rattleSound() {return this.bucketSoundResources + 'rattling_sound.mp3';}
    static get  doorbellSound() {return this.bucketSoundResources + 'doorbell.mp3';}
    static get  ballcatchFailSound() {return this.bucketSoundResources + 'BallCatchFail.mp3';}
    static get  bad3MouseSound() {return this.bucketSoundResources + 'bad_3mouse.mp3';}
    static get  crocSlurpSound() {return this.bucketSoundResources + 'croc_slurp.mp3';}
    static get  crocEatSound() {return this.bucketSoundResources + 'crocodile_eating.mp3';}
    static get  good3MouseSound() {return this.bucketSoundResources + 'good_3mouse.mp3';}
    static get  goodCatchSound() {return this.bucketSoundResources + 'goodcatch.mp3';}
    static get  drumRollSound() {return this.bucketSoundResources + 'drumroll.mp3';}
    static get  yaySound() {return this.bucketSoundResources + 'ChildrenYayShort.mp3';}
    static get  swooshSound() {return this.bucketSoundResources + 'Swoosh.mp3';}
    static get  cheese_ser1Sound() {return this.bucketSoundResources + 'cheese_ser1.mp3';}
    static get  cheese_ser2Sound() {return this.bucketSoundResources + 'cheese_ser2.mp3';}
    static get  cheese_ser3Sound() {return this.bucketSoundResources + 'cheese_ser3.mp3';}
    static get  wrongSound() {return this.bucketSoundResources + 'wrongSound.mp3';}
    static get  failcatchSound(){return this.bucketSoundResources + 'failcatch.mp3';}

    // Brick smasher Sounds

    static get  brickHitsmall(){return this.bucketSoundResources + 'brickhit_small.mp3';}
    static get  brickHitlarge(){return this.bucketSoundResources + 'brickhit_big.mp3';}
    static get  brickHitwall(){return this.bucketSoundResources + 'brickhit_wall_impact.mp3';}



    // Firewworks Sounds

    static get  firework_big(){return this.bucketSoundResources + 'firework_big.mp3';}
    static get  firework_small(){return this.bucketSoundResources + 'firework_small.mp3';}
    static get  firework_hidden(){return this.bucketSoundResources + 'firework_hidden.mp3';}
    static get  firework_whistle(){return this.bucketSoundResources + 'firework_whistle.mp3';}
    static get  fuse(){return this.bucketSoundResources + 'fuse.mp3';}




    //Image Resources
    static get  treeImage() {return this.bucketImageResource + 'tree_original.png';}
    static get  tree2Image() {return this.bucketImageResource + 'tree2.png';}
    static get  tree3Image() {return this.bucketImageResource + 'tree3.png';}
    static get  crocdoneImage() {return this.bucketImageResource + 'croc_done.png';}
    static get  croctongImage() {return this.bucketImageResource + 'croc_tong.png';}
    static get  crocclosednotongImage() {return this.bucketImageResource + 'croc_closed_notong.png';}
    static get  crocStartImage() {return this.bucketImageResource + 'crocodile_start.png';}
    static get  cheeseMissedImage() {return this.bucketImageResource + 'cheese_missed.jpg';}
    static get  miceImage() {return this.bucketImageResource + 'mice.png';}
    static get  basketStarsImage() {return this.bucketImageResource + 'Stars.png';}
    static get  cheeseImage() {return this.bucketImageResource + 'Slide1.jpg';}
    static get  basketImage() {return this.bucketImageResource + 'netball.png';}
    static get  blueMouseImage() {return this.bucketImageResource + 'mouse-blue.png';}
    static get  redMouseImage() {return this.bucketImageResource + 'mouse-red.png';}
    static get  greenMouseImage() {return this.bucketImageResource + 'mouse-green.png';}


    // Brick smasher Images
    static get paddleImage() {return this.bucketImageResource + 'Paddle1.png';}
    static get wallInitial() {return this.bucketImageResource + 'wall_hor.png';}
    static get wallMissed() {return this.bucketImageResource + 'wall_hor_clip.png';}
    static get basketBalls() {return this.bucketImageResource + 'BasketballsPile2.png';}
    static get basketBall() {return this.bucketImageResource + 'basketball.png';}
    static get tokenImage() {return this.bucketImageResource + 'coin.png';}
    static get smallbricksImage() {return this.bucketImageResource + 'SmallBricksPile.png';}
    static get largebricksImage() {return this.bucketImageResource + 'LargeBricksPile.png';}


    // Firewworks Images


    static get skyline() {return this.bucketImageResource + 'skyline_clipped.png';}
    static get Explosion_big_blue() {return this.bucketImageResource + 'Explosion_big_blue.png';}
    static get Explosion_big_green() {return this.bucketImageResource + 'Explosion_big_green.png';}
    static get Explosion_big_red() {return this.bucketImageResource + 'Explosion_big_red.png';}
    static get Explosion_big() {return this.bucketImageResource + 'Explosion_big.png';}
    static get Explosion_small() {return this.bucketImageResource + 'Explosion_small.png';}
    static get Fireball() {return this.bucketImageResource + 'Fireball.png';}



    static get robotImage() {return this.bucketImageResource + 'Robot.png';}




    //Colors
    static  get redColor() {return '#ff2d23';}
    static  get grayColor() {return '#808080';}
    static  get blackColor() {return '#020102';}
    static  get yellowColor() {return '#dadd0f';}
    static  get whiteColor() {return '#dde5d7';}
    static  get blueColor() {return '#1931dd';}
    static  get greenColor() {return '#3CB371';}
    static  get scoreColor() {return '#09b4dd';}
}
