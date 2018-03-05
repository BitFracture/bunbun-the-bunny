/**
 * HeadsUpDisplay.js 
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, SpriteAnimateRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


/**
 * Creates a new player based on its location in the world.
 * 
 * @param x  The x position
 * @param y  The Y position
 * @param lowerLeftX  The lower left X of the texture crop box
 * @param lowerLeftY  The lower left Y of the texture crop box
 * @param upperRightX  The upper right X of the texture crop box
 * @param upperRightY  The upper right Y of the texture crop box
 * @param textureAsset  The asset ID of the overlay texture
 */
function HeadsUpDisplay(x, y, lowerLeftX, lowerLeftY, upperRightX, upperRightY,
        textureAsset) {
    
    this.moveDelta = 2;
    this.speedMultiplier = 1;

    this.renderable = new SpriteRenderable(textureAsset);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(4, 4);
    this.renderable.setElementPixelPositions(
            lowerLeftX, upperRightX,
            lowerLeftY, upperRightY);
    GameObject.call(this, this.renderable);
}
gEngine.Core.inheritPrototype(HeadsUpDisplay, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
HeadsUpDisplay.fromProperties = function (properties) {    
    return new HeadsUpDisplay(
            properties["position"][0], 
            properties["position"][1],
            properties["lowerLeft"][0], 
            properties["lowerLeft"][1], 
            properties["upperRight"][0], 
            properties["upperRight"][1],
            properties["textureId"]);
};


/**
 * Draw the laser and draw the parent.
 *  @param camera
 */
HeadsUpDisplay.prototype.draw = function (camera) {
    
    GameObject.prototype.draw.call(this, camera);
};


/**
 * Take user input and update rigid body.
 * 
 * @param camera
 */
HeadsUpDisplay.prototype.update = function (camera) {
    
    GameObject.prototype.update.call(this, camera);
};

