
const TJBot = require('tjbot');

//declare GPIO pins
var RED_PIN = 11, GREEN_PIN = 13, BLUE_PIN = 15;
var LIGHT_PIN = 40;
var rpio = require('rpio');


var colorPalette = { //[r,g,b]
    "red": [1,0,0],
    "read": [1,0,0], // sometimes, STT hears "read" instead of "red"
    "green": [0,1,0],
    "blue": [0,0,1],
    "purple": [1,0,1],
    "yellow": [1,1,0],
    "pink": [1,0,1],
    "orange": [1,1,0],
    "aqua": [0,1,1],
    "white": [1,1,1],
    "off": [0,0,0],
    "on": [1,1,1]
}

//console.log(Object.keys(colorPalette)) //print out the colors available 

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

// ----  main run/test
// setLED("red");

setTimeout(function() {
setLED("green");}, 300);

discoParty();


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

process.on('beforeExit', function () {
	rpio.write(RED_PIN,rpioVal[0]);
	rpio.write(GREEN_PIN,rpioVal[0]);
	rpio.write(BLUE_PIN,rpioVal[0]);
});
