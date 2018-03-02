/**
 * Player.js 
 *
 * Defines the game player (BunBun).
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


/**
 * Creates a new player based on its location in the world.
 * 
 * @param x  The x position
 * @param y  The Y position
 */
function Player(x, y) {
    
    gEngine.Physics.setRelaxationCount(30);
    
    this.moveDelta = 2;
    this.speedMultiplier = 1;

    this.renderable = new Renderable();
    this.renderable.setColor([0, 0, 1, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(4, 4);
    GameObject.call(this, this.renderable);
    
    var r = new RigidCircle(this.getTransform(), 2);
    this.setRigidBody(r);
    r.setMass(0.2);
    r.setDragConstant(.1);
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
    r.setFriction(0);
    
    this.jumpTimeout = 0;
    
    //Store camera references for later
    this.mainCameraRef = gEngine.GameLoop.getScene().getCamera("main");
    this.miniCameraRef = gEngine.GameLoop.getScene().getCamera("minimap");
    this.mainCameraRef.configInterpolation(.1, 1);
    
    //Laser
    this.laser = new LineRenderable();
    this.laser.setColor([1, 0, 0, 1]);
    this.laserEnabled = false;
    this.laserDistance = 35;
}
gEngine.Core.inheritPrototype(Player, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Player.fromProperties = function (properties) {    
    return new Player(
            properties["position"][0], 
            properties["position"][1]);
};


/**
 * Draw the laser and draw the parent.
 */
Player.prototype.draw = function (camera) {
    
    GameObject.prototype.draw.call(this, camera);
    if (this.laserEnabled)
        this.laser.draw(camera);
};


/**
 * Take user input and update rigid body.
 */
Player.prototype.update = function (camera) {
    
    GameObject.prototype.update.call(this);
    var xform = this.getTransform();

    //Laser usage
    this.laserEnabled = false;
    if (gEngine.Input.isButtonPressed(0)) {
        
        //Get our pos and the mouse pos
        var myPos = this.getTransform().getPosition();
        var toPos = [
                camera.mouseWCX(),
                camera.mouseWCY()];
        
        //Correct the laser based on the ideal length
        toPos[0] = toPos[0] - myPos[0];
        toPos[1] = toPos[1] - myPos[1];
        var distance = (toPos[0] * toPos[0]) + (toPos[1] * toPos[1]);
        distance = Math.sqrt(distance);
        var correction = this.laserDistance / distance;
        toPos[0] *= correction;
        toPos[1] *= correction;
        
        toPos[0] = myPos[0] + toPos[0];
        toPos[1] = myPos[1] + toPos[1];
        
        //Set the renderable state
        this.laserEnabled = true;
        this.laser.setFirstVertex(myPos[0], myPos[1]);
        this.laser.setSecondVertex(toPos[0], toPos[1]);
    }

    //Kill any engine rotation
    xform.setRotationInRad(0);
    this.getRigidBody().setAngularVelocity(0);

    //Determine if we are under water
    var underWater = false;
    var waterObject = gEngine.GameLoop.getScene().getObjectsByClass("Water")[0];
    
    if (waterObject.getWaterLevel() > xform.getYPos())
        underWater = true;
    
    var speedMultiplier = 1;
    if (underWater)
        speedMultiplier = 1/3;
    
    //Set gravity accordingly
    this.getRigidBody().setAcceleration([0, -90 * speedMultiplier * speedMultiplier]);

    //If the normal isn't zero, normalize it and determine jump speed.
    var norm = this.getCollisionInfo().getNormal();
    
    if (norm[0] !== 0.0 || norm[1] !== 0.0)
    {
        var max = Math.max(Math.abs(norm[0]), Math.abs(norm[1]));
        var normNorm = [norm[0] / max, norm[1] / max];

        //If the normalized normal force is positive, jump
        if (normNorm[1] > 0) {
            
            if (this.jumpTimeout <= 0 && gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                var jumpSpeed = 50 * normNorm[1] * speedMultiplier;
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0], jumpSpeed);

                console.log("Jump speed is " + jumpSpeed);
                this.jumpTimeout = 30; // Make player wait 30 cycles to jump
            }
        }
    }
    
    //Handle left right motion
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {

        this.getRigidBody().setVelocity(
                -12 * speedMultiplier, 
                this.getRigidBody().getVelocity()[1]);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {

        this.getRigidBody().setVelocity(
                12 * speedMultiplier, 
                this.getRigidBody().getVelocity()[1]);
    }

    //The player's jump timeout is controlled by this timer
    if (this.jumpTimeout > 0)
        this.jumpTimeout--;
    
    //Center both cameras on the player
    var panThresh = [10, 2];
    var myPos = this.getTransform().getPosition();
    var camPos = this.mainCameraRef.getWCCenter();
    if (camPos[0] < myPos[0] - panThresh[0])
        camPos[0] = myPos[0] - panThresh[0];
    if (camPos[0] > myPos[0] + panThresh[0])
        camPos[0] = myPos[0] + panThresh[0];
    if (camPos[1] < myPos[1] - panThresh[1])
        camPos[1] = myPos[1] - panThresh[1];
    if (camPos[1] > myPos[1] + panThresh[1])
        camPos[1] = myPos[1] + panThresh[1]; 
};
