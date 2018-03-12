/*
 * File: Engine_Global.js 
 * A transient, global key/value store. 
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
/*global document */
/* find out more about jslint: http://www.jslint.com/help.html */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

/**
 * @class gEngine.Core
 * @type gEngine.Core
 */
gEngine.Global = (function () {
    
    var objectMap = {};
    
    /**
     * Gets the value for a global key.
     * 
     * @param key  The key string for this value
     * @param value  The value to be stored at the given key
     */
    var set = function (key, value) {
        
        objectMap[key] = value;
    };
    
    /**
     * Gets the value for a global key.
     * 
     * @param key  The key string for this value
     * @returns  The value object for the key
     */
    var get = function (key) {
        
        return objectMap[key];
    };

    var mPublic = {
        get: get,
        set: set
    };

    return mPublic;
}());
