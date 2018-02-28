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
    
    this.moveDelta = 2;
    this.speedMultiplier = 1;

    this.renderable = new Renderable();
    this.renderable.setColor([0, 0, 1, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(3, 4);
    GameObject.call(this, this.renderable);
    
    var r = new RigidRectangle(this.getTransform(), 3, 4);
    this.setRigidBody(r);
    r.setMass(0.2);
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
    
    this.jumpTimeout = 0;
    
    //Store camera references for later
    this.mainCameraRef = gEngine.GameLoop.getScene().getCamera("main");
    this.miniCameraRef = gEngine.GameLoop.getScene().getCamera("minimap");
    this.mainCameraRef.configInterpolation(.1, 1);
    
    //Laser
    this.laser = new LineRenderable();
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
 * Take user input and update rigid body.
 */
Player.prototype.update = function (camera) {
    
    GameObject.prototype.update.call(this);   
    //xform.setRotationInRad(0);
    var xform = this.getTransform();

    xform.setRotationInRad(0);
    this.getRigidBody().setAngularVelocity(0);

    if (this.jumpTimeout <= 0 && gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        
        //If the normal isn't zero, normalize it and determine jump speed.
        var norm = this.getCollisionInfo().getNormal();
        if (norm[0] !== 0.0 || norm[1] !== 0.0)
        {
            var max = Math.max(Math.abs(norm[0]), Math.abs(norm[1]));
            var normNorm = [norm[0] / max, norm[1] / max];
            
            //If the normalized normal force is positive, jump
            if (normNorm[1] > 0) {
                var jumpSpeed = 25 * normNorm[1];
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0], jumpSpeed);

                console.log("Jump speed is " + jumpSpeed);
                this.jumpTimeout = 30; // Make player wait 30 cycles to jump
            }
        }
    }
    else {
        this.jumpTimeout--;
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (this.getRigidBody().getVelocity()[0] > -30)
            this.getRigidBody().incVelocity(-this.moveDelta * this.speedMultiplier, 0);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (this.getRigidBody().getVelocity()[0] < 30)
            this.getRigidBody().incVelocity(this.moveDelta * this.speedMultiplier, 0);
    }
    
    this.getRigidBody().userSetsState();
    
    //Center both cameras on the player
    var myPos = this.getTransform().getPosition();
    this.mainCameraRef.setWCCenter(myPos[0], myPos[1]);
    this.miniCameraRef.setWCCenter(myPos[0], myPos[1]);    
    
    //Fetch a list of all carrots
    var carrotList = gEngine.GameLoop.getScene().getObjectsByClass("CarrotPickup");
};
