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
    
    this.physicsObjectList = null;
    this.objectList = null;
    this.collisionInfoList = [];
    
    //The camera to view the scene
    this.mainCamera = null;
    this.cameraList = [];
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
    
    //Global conditions
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.physicsObjectList = new GameObjectSet();
    this.objectList = new GameObjectSet();
    
    //Pull and parse the level data
    var levelConfig = JSON.parse(
            gEngine.ResourceMap.retrieveAsset(this.LEVEL_FILE));
    
    //Load cameras
    if (levelConfig["cameraList"].length <= 0)
        console.log("ERROR: No cameras were defined in the level!");
    
    for (var camera in levelConfig["cameraList"]) {
        
        var newCamera = Camera.fromProperties(levelConfig["cameraList"][camera]);
        this.cameraList.push(newCamera);
    }
    
    //Load level objects
    for (var objectName in levelConfig["objectList"]) {
        for (var instance in levelConfig["objectList"][objectName]) {
            
            var properties = levelConfig["objectList"][objectName][instance];
            var newObject = window[objectName].fromProperties(properties);
            
            this.enrollObject(newObject, !!properties["__hasPhysics"]);
            
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

    //Draw each object on each camera
    for (var camera in this.cameraList) {
        
        this.cameraList[camera].setupViewProjection();
        this.objectList.draw(this.cameraList[camera]);
    }
};


/**
 * Processes updates and collisions.
 */
GameLevel.prototype.update = function () {

    this.objectList.update(this.cameraList[0]);
    
    this.physicsObjectList.clean();
    gEngine.Physics.processCollision(
            this.physicsObjectList, 
            this.collisionInfoList);
    
    //Update each camera movement information
    for (var camera in this.cameraList) 
        this.cameraList[camera].update();
};


/**
 * Gets the set of game objects for external manipulation. Be very careful!
 * Use case: Terrain editor
 * 
 * @returns The GameObjectSet for all enqueued objects. 
 */
GameLevel.prototype.getObjectList = function () {
    
    return this.objectList.getObjectList();
};


/**
 * Enrolls a new object into the update list. DO NOT add duplicates! 
 * The result is fairly predictable: double updates, double draws.
 * 
 * @param object  The object to enroll.
 * @param physicsEnabled  Whether to run it through the physics engine.
 */
GameLevel.prototype.enrollObject = function (object, physicsEnabled) {
    
    this.objectList.addToSet(object);
    
    if (!!physicsEnabled)
        this.physicsObjectList.addToSet(object);
};


/**
 * Allows a game object to add a game camera by 
 */
GameLevel.prototype.getCamera = function (name) {
    
    for (var camera in this.cameraList)
        if (this.cameraList[camera].getName() === name)
            return this.cameraList[camera];
    return null;
};
