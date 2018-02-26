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
    
    this.moveDelta = 0.5;

    this.renderable = new Renderable();
    this.renderable.setColor([0, 0, 1, 1]);
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(3, 4);
    GameObject.call(this, this.renderable);
    
    var r = new RigidRectangle(this.getTransform(), 3, 4);
    this.setRigidBody(r);
    r.setMass(5.5);
    this.setDrawRenderable(true);
    this.setDrawRigidShape(true);
    
    //Store camera references for later
    this.mainCameraRef = gEngine.GameLoop.getScene().getCamera("main");
    this.miniCameraRef = gEngine.GameLoop.getScene().getCamera("minimap");
    this.mainCameraRef.configInterpolation(.1, 1);
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
Player.prototype.update = function () {
    
    GameObject.prototype.update.call(this);
    
    var xform = this.getTransform();
    xform.setRotationInRad(0);

    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {

        xform.incYPosBy(2.5);
    }
    
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
//        xform.incYPosBy(-this.moveDelta);
//    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-this.moveDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(this.moveDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        xform.incRotationByDegree(1);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        xform.incRotationByDegree(-1);
    }
    
    this.getRigidBody().userSetsState();
    
    //Center both cameras on the player
    var myPos = this.getTransform().getPosition();
    this.mainCameraRef.setWCCenter(myPos[0], myPos[1]);
    this.miniCameraRef.setWCCenter(myPos[0], myPos[1]);
};