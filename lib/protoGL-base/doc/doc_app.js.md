##App.js (root of game)
- Location: src/
- Function: manage the application

----

##Structure
- entire script wrapped in an init() function with **no** parameters
    -- This is the function called on page init, and it should go on to define and configure the Game object and its properties.

####Step 1 - define game object

####Step 2 - define initial game attributes and their values in an object

####Step 3 - define which attributes should be reinitialised (and their reinit values) when the game restarts

####Step 4 - Define the game's init() function

####Step 5 - Define the game's reinit() function

####Step 6 - Attatch the initData and reinitData to the Game object

####Step 7 - Attatch the init() and reinit() functions to the Game object

####Step 8 - Define global utility methods for Game

####Step 9 - Attatch the global utility methods to the Game object

####Step 10 - Define Game state function bodies describing the frame of each state. A state function can take any number of parameters as long as these are defined when attatching them to Game in step 11. Parameters are accessible through the args[] array.

####Step 11 - Construct the Game's States and asssign their function bodies

####Step 12 - Attach the states to the Game object

####Step 13 - choose an initially active state

####Step 14 - start() the game



----
----

##Template

```javascript
var init = function() {
    //Construct the Abstract Game object, setting its width and height
    var game = new Game(640, 480);

    //STEP 1: define game initial attributes in dictionary
    var gameData = {
        "ents": [],
        "lastGen": -1,
        "points": 0,
    };

    //STEP 2: define which attributes should reinitialise on game reset
    var gameReinitData = {
        "ents": [],
        "lastGen": -1,
        "points": 0,
    };

    //STEP 3: define game init function
    ///this refers to game since this method will be injected
    var initFunc = function() {
        this.loadAttributes(this.initData);
        this.initManagers();
        this.sman.addSound("coin-chunkpass", "res/snd/coin.wav");

        this.textUtils.init();
        this.textUtils.setUpFont();

        this.eman.addPlayer(new Player(new Vec2(-0.8, -0.25), this)); //TODO
        this.genFood();
    };

    ///STEP 4: define game reinit function
    //this refers to game since this method will be injected
    var reinitFunc = function() {
        this.loadAttributes(this.reinitData);
        this.initManagers();
        this.sman.addSound("coin-chunkpass", "res/snd/coin.wav");

        this.textUtils.init();
        this.textUtils.setUpFont();
        
        this.eman.addPlayer(new Player(new Vec2(-0.5, 0.5), this)); //TODO
        this.genFood();

        this.activeState("game");
    }

    //STEP 6: attach init and reinit data to the Game object
    game.addAttr("initData", gameData);
    game.addAttr("reinitData", gameReinitData);

    //STEP 7: attach init func and reinit func to Game object
    game.addMethod("initFunc", initFunc);
    game.addMethod("reinitFunc", reinitFunc);

    //STEP 8: define global utility methods for Game
    //this refers to game since this method will be injected
    var addPoints = function(p) {
        this.points += p;
    };

    var genFood = function() {
        //TODO: needs work
        var x = Math.random() * 1.8 - 0.9;
        var y = Math.random() * 1.8 - 0.9;
        this.eman.addEnt(new Food(new Vec2(x, y), this));
    };

    var genEnemy = function() {
        if (this.points !== this.lastGen) {
            var x = Math.random() * 1.8 - 0.9;
            var y = Math.random() * 1.8 - 0.9;
            this.eman.addEnt(new Enemy(new Vec2(x, y), this));
            this.lastGen = this.points;
        }
    }

    ///STEP 9: attach utility methods to Game object by name
    game.addMethod("addPoints", addPoints);
    game.addMethod("genFood", genFood);
    game.addMethod("genEnemy", genEnemy);

    //STEP 10: define Game State function bodies describing the frame of each state
    //a state function can take any number of params as long as denoted in assignment to Game
    ///for this simple game, just passing the Game object
    var menuFunc = function(args) {
        var game = args[0];
        game.renderer.clearScreen(new Vec3(0, 0, 0), false);

        game.textUtils.addString("ProtoGL Demo", 0.15, new Vec2(-0.9, 0.75), false);
        game.textUtils.addString("Crappy Font", 0.135, new Vec2(-0.75, 0.5), false);
        game.textUtils.addString("Simulator", 0.125, new Vec2(-0.6, 0.35), false);
        game.textUtils.addString("Space to Start", 0.12, new Vec2(-0.85, -0.9), false);


        if (window.keys.indexOf(game.keyCodes.space) > -1 && !game.menuTimeout) {
            game.activeState("game");
        }

        game.eman.render();
        game.eman.update(game.delta);
        game.textUtils.render();
    };

    var gameFunc = function(args) {
        var game = args[0];
        var player = game.eman.player;

        game.renderer.clearScreen(new Vec3(0, 0, 0), false);
        game.textUtils.addString("Points " + game.points, 0.075, new Vec2(-0.98, 0.9), false);
        game.textUtils.addString("Health " + game.eman.player.health, 0.075, new Vec2(-0.98, 0.775), false);

        if (window.keys.indexOf(game.keyCodes.w) > -1) {
            game.eman.player.turn(0);
        }
        else if (window.keys.indexOf(game.keyCodes.d) > -1) {
            game.eman.player.turn(1);
        }
        else if (window.keys.indexOf(game.keyCodes.s) > -1) {
            game.eman.player.turn(2);
        }
        else if (window.keys.indexOf(game.keyCodes.a) > -1) {
            game.eman.player.turn(3)
        }

        if (game.eman.player.dead) {
            game.activeState("dead");
        }

        if (window.keys.indexOf(game.keyCodes.p) > -1) {
            game.activeState("pause");
        }

        if (game.points > 0 && game.points % 5 == 0) {
            game.genEnemy();
        }

        game.eman.render();
        game.eman.update(game.delta);
        game.textUtils.render();
    };

    var pauseFunc = function(args) {
        var game = args[0];
        game.renderer.clearScreen(new Vec3(0, 0, 0), false);

        game.textUtils.addString("Points " + game.points, 0.075, new Vec2(-0.98, 0.9), false);
        game.textUtils.addString("Health " + game.eman.player.health, 0.075, new Vec2(-0.98, 0.775), false);
        game.textUtils.addString("Paused", 0.2, new Vec2(-0.55, 0), false);
        game.textUtils.addString("Space to resume", 0.12, new Vec2(-0.9, -0.2), false);

        if (window.keys.indexOf(game.keyCodes.space) > -1) {
            game.activeState("game");
        }

        game.eman.render();
        game.lman.render();
        game.textUtils.render();
    };

    var deadFunc = function(args) {
        var game = args[0];
        game.renderer.clearScreen(new Vec3(0, 0, 0), false);

        game.textUtils.addString("Points " + game.points, 0.075, new Vec2(-0.98, 0.9), false);
        game.textUtils.addString("Health " + game.eman.player.health, 0.075, new Vec2(-0.98, 0.775), false);
        game.textUtils.addString("DEAD", 0.35, new Vec2(-0.65, 0), false );
        game.textUtils.addString("Space to restart", 0.12, new Vec2(-0.96, -0.2), false);

        game.eman.render();
        game.textUtils.render();

        if (window.keys.indexOf(game.keyCodes.space) > -1) {
            game.reinit();
        }
    };

    //STEP 11: construct States with names and function bodies
    var menuState = new State("menu");
    var gameState = new State("game");
    var pauseState = new State("pause");
    var deadState = new State("dead");
    menuState.setFunc(menuFunc, [game]);
    gameState.setFunc(gameFunc, [game]);
    pauseState.setFunc(pauseFunc, [game]);
    deadState.setFunc(deadFunc, [game]);

    //STEP 12: attach States to Game object
    game.addState(menuState);
    game.addState(gameState);
    game.addState(deadState);
    game.addState(pauseState);

    //STEP 13: choose an initially active state
    game.activeState("menu");

    //STEP 14: start the game
    game.start();
};
```