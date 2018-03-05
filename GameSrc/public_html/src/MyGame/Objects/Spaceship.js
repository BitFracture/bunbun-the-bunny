/**
 * Spaceship.js 
 *
 * Defines the game spaceship.
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable, Player: false*/
/*find out more about jslint: http://www.jslint.com/help.html */

"use strict"; 


/**
 * Constructs a new terrain block. This object is intended to be added to the 
 * list of physics-enabled objects, as it contains a rigid body. 
 * 
 * @param x  X position
 * @param y  Y position
 * @param lowerLeftX  The lower left X of the texture crop box
 * @param lowerLeftY  The lower left Y of the texture crop box
 * @param upperRightX  The upper right X of the texture crop box
 * @param upperRightY  The upper right Y of the texture crop box
 * @param textureAsset  The asset ID of the overlay texture
 */
function Spaceship(x, y, lowerLeftX, lowerLeftY, upperRightX, upperRightY,
        textureAsset) {
    
    this.renderable = new SpriteRenderable(textureAsset);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(27.6, 9.9);
    this.renderable.setElementPixelPositions(
            lowerLeftX, upperRightX,
            lowerLeftY, upperRightY);

    GameObject.call(this, this.renderable);
    
    //Rigid body
    var r = new RigidRectangle(this.getTransform(), 27.6, 9.9);
    this.setRigidBody(r);
    r.setMass(0.0);
    r.setVelocity(1, 1);
    
    //Visibility toggled on for now
    this.setDrawRenderable(true);
    this.setDrawRigidShape(false);
    
    this.velocity = [0, 0];
    this.tractorBeam = false;
    
    //Tractor beam
    this.tractorRenderable = new Renderable();
    this.tractorRenderable.setColor([1, 0, 0, .125]);
    this.tractorRenderable.getTransform().setSize(12, 48);
    
    //Zapper
    this.zapperRenderable = new LineRenderable(0, 0, 1, 1);
    this.zapperRenderable.setColor([1, 1, 0, 1]);
    this.pickupTarget = null;
    this.pickupCountdown = 0;
    
    this.laserCollided = false;
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
            properties["position"][1],
            properties["lowerLeft"][0], 
            properties["lowerLeft"][1], 
            properties["upperRight"][0], 
            properties["upperRight"][1],
            properties["textureId"]);
};


Spaceship.prototype.draw = function (camera) {
    
    GameObject.prototype.draw.call(this, camera);
    
    //Draw tractor beam path
    if (this.tractorBeam)
        this.tractorRenderable.draw(camera);
    
    //Draw zapper of carrot pickup
    if (this.pickupTarget !== null) {
        
        var myPos = this.getTransform().getPosition();
        var carrotPos = this.pickupTarget.getTransform().getPosition();
        this.zapperRenderable.setFirstVertex(myPos[0] + 10, myPos[1]);
        this.zapperRenderable.setSecondVertex(carrotPos[0], carrotPos[1]);
        this.zapperRenderable.draw(camera);
    }
};


/**
 * Update logic
 */
Spaceship.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
    
    this.updatePickupFinder();
    this.updatePlayerFinder();
    
    this.laserCollided = false;
};


/**
 * Updates the logic that finds pickup and targets it to become big carrots
 */
Spaceship.prototype.updatePickupFinder = function () {
    
    //If we already have a carrot chosen, make it go boom
    if (this.pickupTarget !== null) {
        
        if (this.pickupCountdown > 0) {
            this.pickupCountdown--;
        } else {
            var carrotPos = this.pickupTarget.getTransform().getPosition();

            this.pickupTarget.delete();
            var newCarrot = new Carrot(carrotPos[0], carrotPos[1]);
            gEngine.GameLoop.getScene().enrollObject(newCarrot, true);
            this.pickupTarget = null;
        }
        
        return;
    }
    
    //Fetch a list of all carrots
    var carrotList = gEngine.GameLoop.getScene().getObjectsByClass("CarrotPickup");
    var thisPos = this.getTransform().getPosition();
    thisPos = [thisPos[0] + 10, thisPos[1]];
    
    for (var carrotId in carrotList) {
        
        var carrot = carrotList[carrotId];
        var carrotPos = carrot.getTransform().getPosition();
        
        //How far are we from the carrot?
        var distVect = [thisPos[0] - carrotPos[0], thisPos[1] - carrotPos[1]];
        var distance = (distVect[0] * distVect[0]) + (distVect[1] * distVect[1]);
        distance = Math.sqrt(distance);
        
        //With a random (unlikely) chance, strike this carrot
        if (distance < 25 && Math.floor(Math.random() * 300) === 10) {
            
            this.pickupTarget = carrot;
            this.pickupCountdown = 60;
        }
    }
};


/**
 * Updates the logic that locates and pursues the player through the world.
 */
Spaceship.prototype.updatePlayerFinder = function () {
    
    var playerList = gEngine.GameLoop.getScene().getObjectsByClass("Player");
    var xform = this.getTransform();
    
    xform.setRotationInRad(0);
    this.getRigidBody().setAngularVelocity(0);
    this.tractorBeam = false;
    
    //Collided with player?
    var colObject = this.getCollisionInfo().getCollidedObject();
    if (colObject !== null && Player.prototype.isPrototypeOf(colObject)) {
        gEngine.Core.setNextScene(new GameLevel("assets/levels/loseScreen.json"));
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
            this.tractorRenderable.getTransform().setPosition(xform.getXPos(), xform.getYPos() - 28);
        }
        
        //Move y position towards camera in a constant way if not being shot
        idealVelocity[1] = playerPos[1] - (xform.getPosition()[1] - offset);
        if (idealVelocity[1] !== 0.0) {

            idealVelocity[1] = idealVelocity[1] / Math.abs(idealVelocity[1]);
            this.velocity[1] = idealVelocity[1] / 10;
        } else {

            this.velocity[1] = 0.0;
        }
        if (this.laserCollided)// && this.velocity[1] < 0.0)
            this.velocity[1] += 0.2;
        
        //Tractor beam control
        if (this.tractorBeam && Math.abs(distanceInX) < 6) {
            if (playerList[0].getRigidBody().getVelocity()[1] < 15)
                playerList[0].getRigidBody().incVelocity(0, 2);
        }
    }
    
    xform.incXPosBy(this.velocity[0]);
    xform.incYPosBy(this.velocity[1]);
};
