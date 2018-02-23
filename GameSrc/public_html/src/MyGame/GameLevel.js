/**
 * GameLevel.js 
 * 
 * This is the logic of all game levels. Detailed logic is abstracted to 
 * controller objects and the game objects themselves. Use the JSON file to 
 * define which levels are spawned initially. 
 * 
 * @author  Erik W. Greif
 * @since   2018-02-22
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/*Find out more about jslint: http://www.jslint.com/help.html */

"use strict";


/**
 * Constructs a game level (scene) that parses and controls a JSON level.
 */
function GameLevel() {
    
    this.LEVEL_FILE  = "assets/levels/level0.json";
    this.OVERLAY     = "assets/textures/bunOverlay.png";
    
    //The camera to view the scene
    this.mainCamera = null;

    this.physicsObjectList = null;
    this.objectList = null;
    this.collisionInfoList = [];
}
gEngine.Core.inheritPrototype(GameLevel, Scene);


/**
 * Load all assets used by all levels.
 */
GameLevel.prototype.loadScene = function () {
    
    gEngine.TextFileLoader.loadTextFile(
            this.LEVEL_FILE, 
            gEngine.TextFileLoader.eTextFileType.eJSONFile);
    
    gEngine.Textures.loadTexture(this.OVERLAY);
};


/**
 * Clean up asset memory.
 */
GameLevel.prototype.unloadScene = function () {
    
    gEngine.TextFileLoader.unloadTextFile(this.LEVEL_FILE);
    gEngine.Textures.unloadTexture(this.OVERLAY);
};


/**
 * Initialize the level, including cameras. This parses the JSON level
 * and invokes object constructors by name. 
 */
GameLevel.prototype.initialize = function () {
    
    //Cameras and global conditions
    this.mainCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mainCamera.setBackgroundColor([0.38, 0.78, 1.0, 1]);
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.physicsObjectList = new GameObjectSet();
    this.objectList = new GameObjectSet();
    
    //Pull and parse the level data
    var levelConfig = JSON.parse(
            gEngine.ResourceMap.retrieveAsset(this.LEVEL_FILE));
    
    for (var objectName in levelConfig["objectList"]) {
        for (var instance in levelConfig["objectList"][objectName]) {
            
            var properties = levelConfig["objectList"][objectName][instance];
            var newObject = window[objectName].fromProperties(properties);
            
            this.objectList.addToSet(newObject);
            if (!!properties["__hasPhysics"])
                this.physicsObjectList.addToSet(newObject);
            
            if (typeof properties["__depth"] !== 'undefined')
                newObject.setDrawDepth(properties["__depth"]);
        }
    }
};


/**
 * Initiate level drawing. Clear canvas and call draws as needed.
 */
GameLevel.prototype.draw = function () {
    
    //Clear off the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    //Draw each object
    this.mainCamera.setupViewProjection();
    this.objectList.draw(this.mainCamera);
    
    this.collisionInfoList = []; 
};


/**
 * Processes updates and collisions.
 */
GameLevel.prototype.update = function () {

    this.objectList.update();
    
    gEngine.Physics.processCollision(
            this.physicsObjectList, 
            this.collisionInfoList);
};
