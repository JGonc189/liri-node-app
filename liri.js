import { spotify, twitter } from './keys';

// read and set any environment variables with the dotenv package
const env = require('dotenv').config();
// import key.js information
const keys = require('./keys'); 

// require needed packages
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

let arg = '';

arg = process.argv[3];

userInput(process.argv[2], arg);

const userInput = (command, arg) => {
    switch(command) {
        //get tweets
        case 'my-tweets':
        twitterFunc();
        break;

        // get spotify
        case 'spotify-this-song':
        spotifyFunc();
        break;

        // get omdb
        case 'movie-this':
        movieFunc();
        break;

        // do what it says
        case 'do-what-it-says':
        getCommands();
        break;

        case undefined:
        case '':
        console.log('What was that?');

        default:
        console.log('I dont know what you are trying to say...  Please input a proper command!');

    }
}



// const spotify = new Spotify(keys.spotify);
// const client = new twitter(keys.twitter);

/* my-tweets
    `node liri.js my-tweets`
    shows last 20 tweets and when they were created in your terminal window. */

// twitter function -- found all twitter api documentation @ https://developer.twitter.com/en/docs/tweets/timelines/overview

const twitterFunc = () => {
    console.log('Retrieving tweets. . .');
    const client = new twitter(keys.twitter);
    client.get('statuses/home_timeline', 
        (error, tweets, response) =>{
            if(tweets.length < 1){
                console.log('I could not find any tweets, please forget facebook and use your twitter!!');
                return;
            }
            else if(tweets.length === 1) {
                console.log('Here is your only tweet...\n');
            }
            else {
                console.log('Here are your most recent')
            }
        });
}

/* spotify-this-song
    `node liri.js spotify-this-song '<song name here>'`
    This will show the following information about the song in your terminal/bash window:     
     * Artist(s)     
     * The song's name     
     * A preview link of the song from Spotify     
     * The album that the song is from */

// movie-this

// do-what-it-says

