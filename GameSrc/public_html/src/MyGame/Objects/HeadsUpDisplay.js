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
 * Creates a new HUD in the world.
 */
function HeadsUpDisplay() {
    
    this.renderable = new Renderable();

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
    return new HeadsUpDisplay();
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

