/**
 * Carrot.js 
 *
 * Defines the game spaceship.
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
function Spaceship(x, y) {
    
    this.renderable = new Renderable();
    this.renderable.setColor([1, 1, 1, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(40, 4);

    GameObject.call(this, this.renderable);
    
    //Rigid body
    var r = new RigidRectangle(this.getTransform(), 40, 4);
    this.setRigidBody(r);
    r.setMass(5.5);
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
}
gEngine.Core.inheritPrototype(Spaceship, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Spaceship.fromProperties = function (properties) {
    
    return new Spaceship(
            properties["position"][0], 
            properties["position"][1]);
};


/**
 * Update logic
 */
Spaceship.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
};
