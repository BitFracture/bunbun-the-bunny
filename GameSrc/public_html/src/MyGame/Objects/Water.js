/**
 * Water.js
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteAnimateRenderable */
/*find out more about jslint: http://www.jslint.com/help.html */

"use strict"; 


/**
 * Creates a new water based on the height in the world
 * 
 * @param x  The x position
 * @param y  The y position
 */
function Water(x, y) {
    
    this.riseRate = 0.05;
    this.waterLevel = y;
    this.renderable = new Renderable();
    this.renderable.setColor([0.25, 0.5, 1, 0.2]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(220, 200);    
    
    GameObject.call(this, this.renderable);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    
    //Store camera references for later
    this.mainCameraRef = gEngine.GameLoop.getScene().getCamera("main");
    this.mainCameraRef.configInterpolation(.1, 1);
}
gEngine.Core.inheritPrototype(Water, GameObject);

/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Water.fromProperties = function (properties) {    
    return new Water(
            properties["position"][0], 
            properties["position"][1]);
};

/**
 * Update logic
 */
Water.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
    
    var xform = this.getTransform();    
    this.waterLevel += this.riseRate;
    xform.setYPos(this.waterLevel);
    if (xform.getYPos() >= this.mainCameraRef.getWCCenter()[1]) {
        xform.setYPos(this.mainCameraRef.getWCCenter()[1]);
    }    
    var center = this.mainCameraRef.getWCCenter();
    xform.setXPos(center[0]);
    
    if (this.waterLevel >= this.mainCameraRef.getWCCenter()[1] - 100) {
        // player is slowed
        // change Player's this.speedMultiplier to < 1
    } else {
        // reset this.speedMultiplier to 1
    }
    
};
