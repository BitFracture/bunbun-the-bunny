/**
 * BunAnimation.js 
 *
 * Defines a Bun animation
 * 
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


/**
 * Creates a new player based on its location in the world.
 * 
 * @param x  The x position
 * @param y  The Y position
 * @param w  The width in WC
 * @param h  The height in WX
 * @param {Number} topPixel Top of the sprite row in pixel
 * @param {Number} leftPixel left most pixel of the first animation frame in pixel
 * @param {Number} elmWidthInPixel width of the animation in pixel
 * @param {Number} elmHeightInPixel height of the animation in pixel
 * @param {Number} numElements number of animation frames
 * @param {Number} wPaddingInPixel pixel padding between animation frames
 * @param speed animation speed
 * @param textureAsset  The asset ID of the overlay texture
 */
function BunAnimation(x, y) {
    
    //Texture crop box
    var lowerLeft = [23, 23];
    var upperRight = [489, 489];

    this.renderable = new SpriteRenderable("assets/textures/BunSprite1.png");
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(4, 4);
    this.renderable.setElementPixelPositions(
            lowerLeft[0], upperRight[0],
            lowerLeft[1], upperRight[1]);
    
    GameObject.call(this, this.renderable);
    
    this.setDrawRenderable(true);
    
    //Configurable
    this.acceleration = -.05;
    this.jumpInterval = 120;
    this.jumpVelocity = 1.1;
    
    //State
    this.velocity = 0;
    this.floor = y;
    this.jumpTimer = 30;
}
gEngine.Core.inheritPrototype(BunAnimation, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
BunAnimation.fromProperties = function (properties) {
    
    return new BunAnimation(
            properties["position"][0], 
            properties["position"][1]);
};

BunAnimation.prototype.update = function () {
    
    var transform = this.renderable.getTransform();
    
    this.velocity += this.acceleration;
    transform.incYPosBy(this.velocity);
    
    //If we landed, can't fall further
    if (transform.getYPos() < this.floor)
        transform.setYPos(this.floor);
    
    //Jump!
    this.jumpTimer -= 1;
    if (this.jumpTimer <= 0) {
        this.jumpTimer = this.jumpInterval;
        this.velocity = this.jumpVelocity;
    }
};
