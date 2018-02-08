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

// log user data
const log = (data) => {
    fs.appendFile("log.txt", `--------------- 
        ${JSON.stringify(data, null, 2)}
        ---------------`, (error) => {

	  if (error) {
        console.log(`There appears to be an error 
        ${error}`);
	  } else {
	    console.log("--- Added data...");
	  }

	});
}

/* my-tweets
    `node liri.js my-tweets`
    shows last 20 tweets and when they were created in your terminal window. */

// twitter function -- found all twitter api documentation @ https://developer.twitter.com/en/docs/tweets/timelines/overview

const twitterFunc = () => {
    console.log('Retrieving tweets. . .');
    const client = new Twitter(keys.twitter);
    // const params = {
    //     screen_name: 'codingcorner_'
    // }
    client.get('statuses/user_timeline',
        (error, tweets, response) =>{
            // console.log(tweets) -- check the response object
            // check to see if the user has any tweets
            if(tweets.length < 1){
                console.log(`I could not find any tweets, please forget facebook and use your twitter!!`);
                return;
            }
            else if( tweets.length === 1 ) {
                console.log(`Here is your only tweet: 
                 `);
            } // if user has more than one tweet...
            else {
                console.log(`Here are your ${tweets.length} most recent tweets: 
                 `)
            }

            for (let i = 0; i < tweets.length; i++) {
                // gather the information for when the tweets were created
                let tweetCreated = tweets[i].created_at;
                // get the month day and year
                tweetCreated = tweetCreated.substring(tweetCreated.indexOf(' ') +1 );
                let tweetMonth = tweetCreated.substring(0, tweetCreated.indexOf(' '));
                tweetCreated = tweetCreated.substring(tweetCreated.indexOf(' ') +1 );
                let tweetDay = tweetCreated.substring(0, tweetCreated.indexOf(' '));
                tweetCreated = tweetCreated.substring(tweetCreated.indexOf(' ') +1 )
                let tweetTime = tweetCreated.substring(0, tweetCreated.indexOf(' '));
                tweetCreated = tweetCreated.substring(tweetCreated.indexOf(' ') +1 );
                tweetCreated = tweetCreated.substring(tweetCreated.indexOf(' ') +1 );
                let tweetYear = tweetCreated.substring(tweetCreated.indexOf(' '));

                // get the hours and minutes
                let tweetHours = parseInt(tweetTime.substring(0, tweetTime.indexOf(':')));
                tweetTime = tweetTime.substring(tweetTime.indexOf(':') +1 );
                let tweetMinutes = tweetTime.substring(0, tweetTime.indexOf(':'));

                tweetTime = (tweetHours % 12 === 0 ? 12 : tweetHours % 12) + ':' + tweetMinutes + (tweetHours >= 12 && tweetHours < 24 ? 'pm' : 'am');

                let tweet = ` ** ${tweetMonth} / ${tweetDay} / ${tweetYear} @ ${tweetTime} **
                ${tweets[i].text} `;

                console.log(tweet);
                log(tweet);
                
            }
            
        });
};

/* spotify-this-song
    `node liri.js spotify-this-song '<song name here>'`
    This will show the following information about the song in your terminal/bash window:     
     * Artist(s)     
     * The song's name     
     * A preview link of the song from Spotify     
     * The album that the song is from */

const spotifyFunc = (song) => {
    song = song ? song : 'The Sign';
    console.log(`Please wait while I find that song...
    `);
    const spotify = new Spotify(keys.spotify);
    spotify.search({
        type: 'track',
        query: 'track:' + song,
        limit: 20
    }).then((response) => {
        // console.log(response); -- for debugging
        let songFound = false;
        let trackInfo = response.tracks.items;
        // console.log(trackInfo); -- for debugging
        for (let i = 0; i < trackInfo.length; i++) {
            
            if (trackInfo[i].name.toLowerCase() === song.toLowerCase()) {
                console.log(`I think I found the song you're interested in.  Here's some more information on it.
                `); 
                if (trackInfo[i].artists.length > 0) {
                    let artists = trackInfo[i].artists.length > 1 ? ' Artists: ' : ' Artist: ';
                    for (let j = 0; j < trackInfo[i].artists.length; j++) {
                        artists += trackInfo[i].artists[j].name;
                        if (j < trackInfo[i].artists.length - 1) {
                            artists += ', ';
                        }
                        
                    }
                    console.log(artists);
                }
                console.log(` Song: ${trackInfo[i].name}
                              Album: ${trackInfo[i].album.name}`);
                console.log(trackInfo[i].preview_url ? ` Preview: ${trackInfo[i].preview_url}` : `No Preview Available`);
                // log to log.txt
                log(trackInfo[i].name);
                log(trackInfo[i].album.name);
                log(trackInfo[i].preview_url);

                songFound = true;
                break;
                
                
            }
            
            
        }
        if (!songFound) {
            console.log(`I'm sorry, but I could not find any songs called "${song}" on Spotify`);
        }
    }).catch((error) =>{
        console.log(`I'm sorry, but I've seemed to run into an error 
                    ${error}`);
    });
};

// movie-this

const movieFunc = (movie) => {
    movie = movie ? movie : 'Mr. Nobody';
    const queryURL = `http://www.omdbapi.com/?t=${movie}"&y=&plot=short&apikey=trilogy`;
    // console.log(queryURL);
    request(queryURL, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			let parsedBody = JSON.parse(body);
            console.log(
            `Title : ${parsedBody.Title}
            Release Year: ${JSON.parse(body).Year}
            IMDB Rating : ${parsedBody.imdbRating}
            Rotten Tomatoes Rating : ${parsedBody.Ratings[1].Value}
            Country of Origin : ${parsedBody.Country}
            Language : ${parsedBody.Language}
            Plot : ${parsedBody.Plot}
            Actors : ${parsedBody.Actors}`);
            log(parsedBody);
        }
			
						
		});
}


// do-what-it-says

const getCommands = () => {
	fs.readFile("random.txt", "utf8", (error, data) => {
		if (error) {
            return console.log(`I'm sorry, but I seem to have run into an error. 
             + ${error}`);
		}
		var dataArr = data.split(",");
		getCommands(dataArr[0], dataArr[1].replace(/"/g, ""));
	});
};

// grab user input 
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

        // case undefined:
        // case '':
        // console.log('What was that?');

        default:
        console.log(`Here is the list of commands I understand...
        * To get the latest 20 tweets: my-tweets 
        * To get song information from spotify: spotify-this-song
        * To get movie information from OMDB: movie-this`);

    }
}

userInput(process.argv[2], arg);

