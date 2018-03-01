/**
 * Carrot.js 
 *
 * Defines the game spaceship.
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false*/
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
    this.renderable.getTransform().setSize(25, 4);

    GameObject.call(this, this.renderable);
    
    //Rigid body
    var r = new RigidRectangle(this.getTransform(), 25, 4);
    this.setRigidBody(r);
    r.setMass(0.0);
    r.setVelocity(1, 1);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    this.setDrawRigidShape(false);
    
    this.velocity = [0, 0];
    this.tractorBeam = false;
    
    this.tractorRenderable = new Renderable();
    this.tractorRenderable.setColor([1, 0, 0, .125]);
    this.tractorRenderable.getTransform().setSize(12, 48);
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


Spaceship.prototype.draw = function (camera) {
    
    GameObject.prototype.draw.call(this, camera);
    
    if (this.tractorBeam)
        this.tractorRenderable.draw(camera);
};


/**
 * Update logic
 */
Spaceship.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
    
    var playerList = gEngine.GameLoop.getScene().getObjectsByClass("Player");
    var xform = this.getTransform();
    
    xform.setRotationInRad(0);
    this.getRigidBody().setAngularVelocity(0);
    this.tractorBeam = false;
    
    //Collided with player?
    var colObject = this.getCollisionInfo().getCollidedObject();
    if (colObject !== null && Player.prototype.isPrototypeOf(colObject)) {
        
        gEngine.GameLoop.stop();
    }
    
    //Move towards the player if one exists
    if (playerList.length > 0){
        
        var playerPos = playerList[0].getRenderable().getTransform().getPosition();
        var idealVelocity = [0, 0];
        
        var distanceInX = playerPos[0] - xform.getPosition()[0];
        
        //Move x position towards the camera in a smooth way
        idealVelocity[0] = distanceInX;
        if (idealVelocity[0] > .07)
            idealVelocity[0] = .07;
        if (idealVelocity[0] < -.07)
            idealVelocity[0] = -.07;
        
        if (this.velocity[0] < idealVelocity[0])
            this.velocity[0] += .005;
        if (this.velocity[0] > idealVelocity[0])
            this.velocity[0] -= .005;
        
        //Determine ideal distance
        var offset = 30;
        if (Math.abs(distanceInX) < 10 && playerPos[1] < xform.getPosition()[1]) {
            offset = 0;
            this.tractorBeam = true;
            this.tractorRenderable.getTransform().setPosition(xform.getXPos(), xform.getYPos() - 24);
        }
        
        //Move y position towards camera in a constant way
        idealVelocity[1] = playerPos[1] - (xform.getPosition()[1] - offset);
        if (idealVelocity[1] !== 0.0) {
            idealVelocity[1] = idealVelocity[1] / Math.abs(idealVelocity[1]);
            this.velocity[1] = idealVelocity[1] / 10;
        } else {
            
            this.velocity[1] = 0.0;
        }
        
        //Tractor beam control
        if (this.tractorBeam && Math.abs(distanceInX) < 6) {
            if (playerList[0].getRigidBody().getVelocity()[1] < 15)
                playerList[0].getRigidBody().incVelocity(0, 2);
        }
    }
    
    xform.incXPosBy(this.velocity[0]);
    xform.incYPosBy(this.velocity[1]);
};
