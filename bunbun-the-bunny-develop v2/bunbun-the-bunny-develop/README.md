
# The Bouncy Adventures of BunBun The Bodacious Bunny

## Introduction

BunBun The Bodacious Bunny is being chased by horrible aliens who are flooding the world. Help BunBun get as far as possible before being abducted by pushing the aliens away with your laser vision, and by moving quickly enough to avoid the flood. 

## Timeline

Minimal product release is targeted for March 12th, 2018. 

## Technology

BunBun is being built using WebGL technology. 

## Usage Help

### Level Geometry Editor

Levels are stored as JSON files. For each type of object, an array of properties
objects are presented to a factory method, and the object is constructed by 
name. An example is shown here where only a single object type is used, called
"Carrot," which has two instances. 

```
{
    "name": "Level 0",
    "description": "A BunBun beta level",
    "objectList": {
        "Carrot": [
            {
                "__hasPhysics": true,
                "position":     [60, 20]
            }, {
                "__hasPhysics": true,
                "position":     [80, 20]
            }
        ]
    }
}
```

Notice the double underscore parameters are reserved for consumption by the 
object loader. 

It turns out, editing this file is pretty awful. So BunBun features an object
type called "Editor" which can be enabled in this very way. 

```
...
        "Editor": [
            {
                "__depth": -1000,
                "isEnabled": true
            }
        ]
...
```

Simply enable the editor, and make sure its depth is nearer (negative) than 
other objects so it doesn't get hidden. 

Next, the editor will allow configuration of TerrainBlock objects. These are the
most common objects in the game, and the hardest to configure. Simply use the 
keys shown below to edit the TerrainBlock objects.

 - Mouse Click: To select a TerrainBlock
 - Left/Right Arrows: Rotate a TerrainBlock
 - TFGH: Move the TerrainBlock (Note, this is next to WASD)
 - IJKL: Scale the TerrainBlock (Note, this is next to TFGH)
 - Shift+C: Clone a TerrainBlock
 - Shift+X: Delete a TerrainBlock permanently
 - Shift+E: Export the TerrainBlock property array to the browser console
 - Shift+R: Reset rotation to 0.0
 - Shift: Slow down rotation, scale, and movement speed by a factor of 10

It is intended that after exporting the property array, that it be copied into
the level file to overwrite the previous set of TerrainBlocks. Be very careful,
as this editor does not edit nor export any other object type. 
