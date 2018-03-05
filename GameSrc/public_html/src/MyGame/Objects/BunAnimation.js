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
function BunAnimation(x, y, w, h, topPixel, leftPixel, elmWidthInPixel, 
        elmHeightInPixel, numElements, wPaddingInPixel, speed, textureAsset) {
    
    this.renderable = new SpriteAnimateRenderable(textureAsset);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(w, h);
    this.renderable.setSpriteSequence(
            topPixel,
            leftPixel,
            elmWidthInPixel,
            elmHeightInPixel,
            numElements,
            wPaddingInPixel
            );
    this.renderable.setAnimationSpeed(speed);
    this.renderable.setAnimationType(2);
            
    GameObject.call(this, this.renderable);
    
    this.setDrawRenderable(true);
    
  
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
            properties["position"][1],
            properties["size"][0], 
            properties["size"][1], 
            properties["offset"][0], 
            properties["offset"][1], 
            properties["dimensions"][0], 
            properties["dimensions"][1],
            properties["elements"],
            properties["padding"],
            properties["speed"],
            properties["textureId"]);
};

BunAnimation.prototype.update = function () {
    this.renderable.updateAnimation();
};
