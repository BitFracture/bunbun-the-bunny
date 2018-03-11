/**
 * Background.js 
 *
 * Defines facade over level physical geometry. This is STATIC geometry only.
 * 
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";


/**
 * 
 * 
 * @param x  The x position
 * @param y  The Y position
 * @param w  The width in WC
 * @param h  The height in WX
 * @param lowerLeftX  The lower left X of the texture crop box
 * @param lowerLeftY  The lower left Y of the texture crop box
 * @param upperRightX  The upper right X of the texture crop box
 * @param upperRightY  The upper right Y of the texture crop box
 * @param textureAsset  The asset ID of the overlay texture
 * @param textureNormal
 * @param unlit
 */
function Background(x, y, w, h, lowerLeftX, lowerLeftY, upperRightX, upperRightY,
        textureAsset, textureNormal, unlit) {
    this.renderable = null;
//    if (typeof unlit !== 'undefined' && unlit) {
        this.renderable = new SpriteAnimateRenderable(textureAsset);
        this.renderable.setLightingEnabled(false);
//    } else {
//        if (typeof textureNormal !== 'undefined')
//            this.renderable = new IllumRenderable(textureAsset, textureNormal);
//        else
//            this.renderable = new LightRenderable(textureAsset);
//        this.renderable.attachLightSet(gEngine.GameLoop.getScene().getGlobalLights());
//    }
    this.renderable.getTransform().setPosition(x, y);
    this.renderable.getTransform().setSize(w, h);
    this.renderable.setColor([0, 0, 0, 0]);
    this.renderable.setSpriteProperties([lowerLeftX, lowerLeftY], [upperRightX - lowerLeftX, upperRightY - lowerLeftY], 1, 0);
    
    GameObject.call(this, this.renderable);
    
    this.setDrawRenderable(true);
    this.mainCameraRef = gEngine.GameLoop.getScene().getCamera("main");
}
gEngine.Core.inheritPrototype(Background, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Background.fromProperties = function (properties) {

    return new Background(
            properties["position"][0], 
            properties["position"][1], 
            properties["size"][0], 
            properties["size"][1], 
            properties["lowerLeft"][0], 
            properties["lowerLeft"][1], 
            properties["upperRight"][0], 
            properties["upperRight"][1],
            properties["textureId"],
            properties["normalId"],
            properties["unlit"]);
};


/**
 * @param camera
 */
Background.prototype.draw = function (camera) {    
    if (camera.getName() === "main")    
        GameObject.prototype.draw.call(this, camera);
};

Background.prototype.update = function () {
    var camPos = this.mainCameraRef.getWCCenter();
    this.renderable.getTransform().setPosition(camPos[0], camPos[1]); 
};