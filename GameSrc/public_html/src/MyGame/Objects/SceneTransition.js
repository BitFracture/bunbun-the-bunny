/**
 * Facade.js 
 *
 * Defines facade over level physical geometry. This is STATIC geometry only.
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";


/**
 * Creates a scene transition object.
 */
function SceneTransition() {
    
    this.renderable = new Renderable();
    var lights = gEngine.GameLoop.getScene().getGlobalLights();
    
    GameObject.call(this, this.renderable);
    
    this.setDrawRenderable(false);
    this.setDrawDepth(-100000);
    
    this.light = new Light();
    this.light.setLightType(Light.eLightType.eSpotLight);
    this.light.setColor([1, 1, 1, 1]);
    this.light.setIntensity(-1000);
    this.radius = 1;
    this.light.setDropOff(5);
    this.light.setNear(this.radius - 5);
    this.light.setFar(this.radius);
    this.light.setZPos(300);
    lights.addToSet(this.light);
}
gEngine.Core.inheritPrototype(SceneTransition, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
SceneTransition.fromProperties = function (properties) {

    return new SceneTransition();
};


/**
 * Draws facade objects. If on the mini camera, will overlay in white.
 */
SceneTransition.prototype.draw = function (camera) {
};


/**
 * Draws facade objects. If on the mini camera, will overlay in white.
 */
SceneTransition.prototype.update = function (camera) {
    
    this.radius += 1;
    this.light.setNear(this.radius * this.radius);
    this.light.setFar(this.radius * this.radius);
    this.light.set2DPosition(camera.getWCCenter());
};