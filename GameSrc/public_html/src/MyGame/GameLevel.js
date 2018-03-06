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
 * 
 * @param levelAsset  The asset path for a JSON level file.
 */
function GameLevel(levelAsset) {
    
    this.LEVEL_FILE  = levelAsset;
    this.LEVEL = null;
    
    this.physicsObjectList = null;
    this.objectList = null;
    this.collisionInfoList = [];
    
    //The camera to view the scene
    this.cameraList = [];
    
    this.finishLine = null;
}
gEngine.Core.inheritPrototype(GameLevel, Scene);


/**
 * Load the level file so we can determine assets to load.
 */
GameLevel.prototype.preLoadScene = function () {
    
    //Load the level file
    gEngine.TextFileLoader.loadTextFile(
            this.LEVEL_FILE, 
            gEngine.TextFileLoader.eTextFileType.eJSONFile);
};


/**
 * Load all assets used by all levels.
 */
GameLevel.prototype.loadScene = function () {
    
    //Parse and save the level configuration
    this.LEVEL = JSON.parse(gEngine.ResourceMap.retrieveAsset(this.LEVEL_FILE));

    //Load up the assets
    for (var assetId in this.LEVEL["assetList"]) {
        
        var asset = this.LEVEL["assetList"][assetId];
        
        //Load a texture
        if (asset.type === "texture")
            gEngine.Textures.loadTexture(asset.name);
        //Load a text file
        else if (asset.type === "text")
            gEngine.TextFileLoader.loadTextFile(asset.name);
        //Load a sound file
        else if (asset.type === "sound")
            gEngine.AudioClips.loadAudio(asset.name);
        //Load a font
        else if (asset.type === "font")
            gEngine.Fonts.loadFont(asset.name);
        //Toss a warning
        else
            console.log("Asset \"" + asset.name + "\" had unknown type: " + asset.type);
    }
};


/**
 * Clean up asset memory.
 */
GameLevel.prototype.unloadScene = function () {
    
    //Remove the level file asset
    gEngine.TextFileLoader.unloadTextFile(this.LEVEL_FILE);
    
    //Unload the dynamic assets
    for (var assetId in this.LEVEL["assetList"]) {
        
        var asset = this.LEVEL["assetList"][assetId];
        
        //Unload a texture
        if (asset.type === "texture")
            gEngine.Textures.unloadTexture(asset.name);
        //Unload a text file
        else if (asset.type === "text")
            gEngine.TextFileLoader.unloadTextFile(asset.name);
        //Unload a sound file
        else if (asset.type === "sound")
            gEngine.AudioClips.unloadAudio(asset.name);
        //Unload a font
        else if (asset.type === "font")
            gEngine.Fonts.unloadFont(asset.name);
    }
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
    
    var levelConfig = this.LEVEL;
    
    //Load cameras
    if (levelConfig["cameraList"].length <= 0)
        console.log("ERROR: No cameras were defined in the level!");
    
    this.cameraList = [];
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
    
    if (this.LEVEL["name"] === "Level 0") {
        gEngine.AudioClips.stopBackgroundAudio();
        gEngine.AudioClips.playBackgroundAudio("assets/sounds/BunBun_Level_1_NoIntro.mp3");
    } else if (this.LEVEL["name"] === "Intro") {
        gEngine.AudioClips.stopBackgroundAudio();
        gEngine.AudioClips.playBackgroundAudio("assets/sounds/BunBun_Level_1.mp3");
    } else if (this.LEVEL["name"] === "LoseScreen") {
        gEngine.AudioClips.stopBackgroundAudio();
        gEngine.AudioClips.playACue("assets/sounds/Game_Over.wav");
    } else if (this.LEVEL["name"] === "WinScreen") {
        gEngine.AudioClips.stopBackgroundAudio();
        gEngine.AudioClips.playACue("assets/sounds/Game_Win.wav");
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

    // Transition from Intro to Level 0
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter)) {  
        if (this.LEVEL["name"] === "Intro"){
            gEngine.Core.setNextScene(new GameLevel("assets/levels/level0.json"));
            gEngine.GameLoop.stop();
        }
        else if (this.LEVEL["name"] === "WinScreen"
              || this.LEVEL["name"] === "LoseScreen"){
            gEngine.Core.setNextScene(new GameLevel("assets/levels/intro.json"));
            gEngine.GameLoop.stop();
        }
    }
    
    // For testing: press 1 to show win screen
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {  
        //if (this.LEVEL["name"] === "Intro"){
            gEngine.Core.setNextScene(new GameLevel("assets/levels/winScreen.json"));
            gEngine.GameLoop.stop();
        //}
    }
    
    // For testing: press 2 to show game over screen
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {  
        //if (this.LEVEL["name"] === "Intro"){
            gEngine.Core.setNextScene(new GameLevel("assets/levels/loseScreen.json"));
            gEngine.GameLoop.stop();
        //}
    }
    
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
GameLevel.prototype.getObjects = function () {
    
    var objects = this.objectList.getObjectList();
    var reduced = [];
    for (var objectId in objects) {
        
        if (!objects[objectId].getIsDeleted())
            reduced.push(objects[objectId]);
    }
    return reduced;
};


/**
 * Gets a list of all objects matching a given class.
 * 
 * @param  className The class name that all fetched entities should match.
 * @returns  The list of current objects of the given class.
 */
GameLevel.prototype.getObjectsByClass = function (className) {
    
    var fullList = this.getObjects();
    var filteredList = [];
    for (var obj in fullList) {
        
        if (window[className].prototype.isPrototypeOf(fullList[obj])) {
            filteredList.push(fullList[obj]);
        }
    }
    return filteredList;
};


/**
 * Gets the set of physics objects for external manipulation. Be very careful!
 * 
 * @returns The list of for all enqueued physics objects. 
 */
GameLevel.prototype.getPhysicsObjects = function () {
    
    var objects = this.physicsObjectList.getObjectList();
    var reduced = [];
    for (var objectId in objects) {
        
        if (!objects[objectId].getIsDeleted())
            reduced.push(objects[objectId]);
    }
    return reduced;
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
 * 
 * @param name
 */
GameLevel.prototype.getCamera = function (name) {
    
    for (var camera in this.cameraList)
        if (this.cameraList[camera].getName() === name)
            return this.cameraList[camera];
    return null;
};

