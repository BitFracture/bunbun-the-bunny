/**
 * Overlay.js 
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
 * Creates a new player based on its location in the world.
 * Note: LOWER LEFT corner is position origin. This is easier to work with.
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
 */
function Overlay(x, y, w, h, lowerLeftX, lowerLeftY, upperRightX, upperRightY,
        textureAsset) {

    this.renderable = new SpriteRenderable(textureAsset);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getTransform().setPosition(x + (w / 2), y + (h / 2));
    this.renderable.getTransform().setSize(w, h);
    this.renderable.setElementPixelPositions(
            lowerLeftX, upperRightX,
            lowerLeftY, upperRightY);
    
    GameObject.call(this, this.renderable);
    
    this.setDrawRenderable(true);
}
gEngine.Core.inheritPrototype(Overlay, GameObject);


/**
 * Constructs a new instance using the properties object.
 * 
 * @param properties  The properties object to be used for construction.
 * @returns A new instance.
 */
Overlay.fromProperties = function (properties) {
    
    return new Overlay(
            properties["position"][0], 
            properties["position"][1], 
            properties["size"][0], 
            properties["size"][1], 
            properties["lowerLeft"][0], 
            properties["lowerLeft"][1], 
            properties["upperRight"][0], 
            properties["upperRight"][1],
            properties["textureId"]);
};


Overlay.prototype.draw = function (camera) {
    
    GameObject.prototype.draw.call(this, camera);
    this.renderable.draw(camera);
};