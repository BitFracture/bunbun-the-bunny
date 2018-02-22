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
function Carrot(x, y) {
    
    this.renderable = new Renderable();
    this.renderable.setColor([1, .37, 0, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(6, 6);

    GameObject.call(this, this.renderable);
    
    //Rigid body
    var r = new RigidCircle(this.getTransform(), 3); 
    
    //Some random size and position logic
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
}
gEngine.Core.inheritPrototype(Carrot, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Carrot.fromProperties = function (properties) {
    
    return new Carrot(
            properties["x"], 
            properties["y"]);
};


/**
 * Update logic
 */
Carrot.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
};
