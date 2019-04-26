/*
 * Developed by Gleb Iakovlev on 4/6/19 11:11 AM.
 * Last modified 4/6/19 11:11 AM.
 * Copyright (c) Cognoteq Software Solutions 2019.
 * All rights reserved
 */

/**
 * Utility class for project static methods and constants
 */


export default class Utils{

    static get  frameRate(){  return  1/100; } // Seconds
    static get  frameDelay() { return  this.frameRate * 1000; } // ms

    //Sound Resources
    static get  bucketImageResource(){return "https://s3.us-east-2.amazonaws.com/piproject/Resources/images/";}
    static get  bucketSoundResources(){return "https://s3.us-east-2.amazonaws.com/piproject/Resources/sounds/";}
    static get  bouncingSound(){return this.bucketSoundResources+"BallBouncing.mp3"}
    static get  rattleSound(){return this.bucketSoundResources+"rattling_sound.mp3"}
    static get  doorbellSound(){return this.bucketSoundResources+"doorbell.mp3"}
    static get  ballcatchFailSound(){return this.bucketSoundResources+"BallCatchFail.mp3"}
    static get  bad3MouseSound(){return this.bucketSoundResources+"bad_3mouse.mp3"}
    static get  crocSlurpSound(){return this.bucketSoundResources+"croc_slurp.mp3"}
    static get  good3MouseSound(){return this.bucketSoundResources+"good_3mouse.mp3"}
    static get  goodCatchSound(){return this.bucketSoundResources+"goodcatch.mp3"}


    //Image Resources
    static get  treeImage(){return this.bucketImageResource+"tree.png"}
    static get  crocdoneImage(){return this.bucketImageResource+"croc_done.png"}
    static get  crocStartImage(){return this.bucketImageResource+"crocodile_start.png"}
    static get  cheeseMissedImage(){return this.bucketImageResource+"cheese_missed.jpg"}
    static get  miceImage(){return this.bucketImageResource+"mice.png"}
    static get  basketStarsImage(){return this.bucketImageResource+"Stars.png"}
    static get  cheeseImage(){return this.bucketImageResource+"Slide1.jpg"}
    static get  basketImage(){return this.bucketImageResource+"netball.png"}
    static get  blueMouseImage(){return this.bucketImageResource+"mouse-blue.png"}
    static get  redMouseImage(){return this.bucketImageResource+"mouse-red.png"}
    static get  greenMouseImage(){return this.bucketImageResource+"mouse-green.png"}


}