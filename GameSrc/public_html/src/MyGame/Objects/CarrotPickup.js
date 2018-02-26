/**
 * Carrot.js 
 *
 * Defines the game carrot behavior. Rolling carrot enemies.
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/*find out more about jslint: http://www.jslint.com/help.html */

"use strict"; 


/**
 * Constructs a new terrain block. This object is intended to be added to the 
 * list of physics-enabled objects, as it contains a rigid body. 
 * 
 * @param x  X position
 * @param y  Y position
 */
function CarrotPickup(x, y) {
    
    this.renderable = new TextureRenderable("assets/textures/carrotPickup.png");
    //this.renderable.setColor([1, .37, 0, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(2, 8);

    GameObject.call(this, this.renderable);
    
    //Visibility toggled on
    this.setDrawRenderable(true);
}
gEngine.Core.inheritPrototype(CarrotPickup, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
CarrotPickup.fromProperties = function (properties) {
    
    return new CarrotPickup(
            properties["position"][0], 
            properties["position"][1]);
};


/**
 * Update logic
 */
CarrotPickup.prototype.update = function (camera) {
    
    GameObject.prototype.update.call(this);
};
