var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['microphone'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// listen for speech
tj.listen();
