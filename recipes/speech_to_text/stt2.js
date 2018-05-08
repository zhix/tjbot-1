// This script runs on tricolor LED //

//declare GPIO pins
var RED_PIN = 11, GREEN_PIN = 13, BLUE_PIN = 15;
var LIGHT_PIN = 40;
var rpio = require('rpio');

var colorPalette = { //[r,g,b]
    "red": [1,0,0],
    "green": [0,1,0],
    "blue": [0,0,1] 
    //add more colors! Mix your own color!
    //You may try emotions too, such as "sad", "happy".
}

/*Initialize the pins*/
var initPins = function(){
  //Pins: 11,13,15 
  rpio.open(RED_PIN,rpio.OUTPUT, rpio.HIGH);
  rpio.open(GREEN_PIN,rpio.OUTPUT, rpio.HIGH);
  rpio.open(BLUE_PIN,rpio.OUTPUT, rpio.HIGH);
}

//definining meaning of high and low and assigning it according to 1 & 0
var rpioVal = {
  1 : rpio.HIGH,
  0 : rpio.LOW
}

var turnLight = function (colorConfig){
  initPins();
  rpio.write(RED_PIN,rpioVal[colorConfig[0]]);
  rpio.write(GREEN_PIN,rpioVal[colorConfig[1]]);
  rpio.write(BLUE_PIN,rpioVal[colorConfig[2]]);
}

function setLED(msg){
    var words = msg.split(" "); //turning msg into list 
    var color = [0,0,0]; //red

   for(var i=0; i < words.length; i++){
     if (words[i] in colorPalette){ 	//words[i] refers to color stated
       color = colorPalette[words[i]];	
     }
   }
	turnLight(color);

}

function discoParty() {
	var x = 1;
	for (var i = 0; i < 30; i++) {
	setTimeout(function() {
	var answer = x % 3;
	if (answer == 1) {
		setLED("red");
		}
	if (answer == 2) {
		setLED("blue");
		}
	if (answer == 0) {
		setLED("green");
		}
	if (answer == 3) {
		setLED("green");
		}
		
	x = x+1;
  
}, i*200);
}}

// ----  reset LED when keyboard interrupted
process.on('SIGINT', function () { //SIGINT: Interrupt from keyboard
    initPins();
    process.nextTick(function () { //Once the current turn of the event loop
		// is completed, callback (this function) will be called. 
		rpio.write(RED_PIN,rpioVal[0]);
		rpio.write(GREEN_PIN,rpioVal[0]);
		rpio.write(BLUE_PIN,rpioVal[0]);
		process.exit(0); });
});

// ----  reset LED before exit from the program
process.on('beforeExit', function () {
	rpio.write(RED_PIN,rpioVal[0]);
	rpio.write(GREEN_PIN,rpioVal[0]);
	rpio.write(BLUE_PIN,rpioVal[0]);
});

var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['led', 'microphone', 'servo'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();

console.log("I understand lots of colors.  You can tell me to shine my light a different color by saying 'turn the light red' or 'change the light to green' or 'turn the light off'.");

// uncomment to see the full list of colors TJ understands
console.log("Here are all the colors I understand:");
console.log(Object.keys(colorPalette));

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};
tjColors.forEach(function(color) {
    colors[color] = 1;
});

// listen for speech
tj.listen(function(msg) {
    var words = msg.split(" "); 				// the message is split into different words
    for (var i = 0; i < words.length; i++) {
		var word = words[i];
        
        if (word=="shake" || word == "hello") {    //if the word matches keywords "shake", "move". Try adding more words to be detected here! 
			console.log("Wave arms");
			tj.wave();}
		else if (colorPalette[word] != undefined) {
			setLED(word);
			console.log("Switching light..");
            break;}
	    else if (word =="disco" || word =="rainbow"){
	    	discoParty();
			console.log("Here we go!");
	    	break;}
		}
});
