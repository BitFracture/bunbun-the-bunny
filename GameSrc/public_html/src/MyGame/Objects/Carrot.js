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
    
    this.idealSize = 8;
    this.currentSize = .01;
    
    this.renderable = new SpriteRenderable("assets/textures/carrotSlice.png");
    this.renderable.setColor([1, .37, 0, 0]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(this.currentSize, this.currentSize);
    this.renderable.setElementPixelPositions(0, 379, 0, 379);

    GameObject.call(this, this.renderable);
    
    //Rigid body
    var r = new RigidCircle(this.getTransform(), this.currentSize / 2); 
    
    //Some random size and position logic
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20;
    r.setVelocity(-speed, 0);
    this.setRigidBody(r);
    r.setMass(20);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    this.setDrawRigidShape(false);
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
            properties["position"][0], 
            properties["position"][1]);
};


/**
 * Update logic
 */
Carrot.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
    
    //Enlarge!
    this.currentSize += .2 * (this.idealSize - this.currentSize);
    this.renderable.getTransform().setSize(this.currentSize, this.currentSize);
    this.getRigidBody().setShapeSize(this.currentSize / 2);
};
