

const request = require('request')
const express = require('express');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser');

/* Initialization */
const app = express();

// set up BodyParser
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

app.set('port', (process.env.PORT || 5000))

// for testing url endpoint
app.get('/', function(req, res) {
    res.send("hello");
})

// incoming post from slack app
app.post('/search', function(req, res) {

    // incoming search query
    var search_term = req.body.text;

    // payload to hit confluence
    var options = {
       method: 'GET',
       url: 'https://slackoverflow.atlassian.net/wiki/rest/api/search?cql=type="ac:com.atlassian.confluence.plugins.confluence-questions:question"+and+title~"' + search_term + '"+or+text~"' + search_term + '"',
       auth: { username: 'alichen@predictivetechnologies.com', password: 'QJf4In3V9BhK7rEgdehrC726' },
       headers: {
	   'Accept': 'application/json',
	   'Content-Type': 'application/json'
       }
    };

    // send request to confluence for results
    request(options, function (error, response, body) {
	if (error) throw new Error(error);
	console.log(
	    'Response: ' + response.statusCode + ' ' + response.statusMessage
	);
        
	var obj = JSON.parse(body);
	var output= "";
	var bad_emojis = [":fearful:", ":stuck_out_tongue_closed_eyes:",":cry:",":tired_face:",":poop:",":tongue:",":trollface:",":see_no_evil:",":hatching_chick:"]
	var payload = {
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
            },
	    "attachments":[]	
	}

	// if no results, send this payload to slack with random emoji
	if (obj.results.length == 0){
	    payload.attachments.push({
		"fallback": "no results found",
		"pretext": "No results found " + bad_emojis[Math.floor(Math.random()*bad_emojis.length)],
		"title": "Add confluence FAQ",
		"title_link": "https://slackoverflow.atlassian.net/wiki/display/SLACKOVERF/customcontent/list/ac%3Acom.atlassian.confluence.plugins.confluence-questions%3Aquestion?ac.com.atlassian.confluence.plugins.confluence-questions.path=/questions/ask",
	    });
	    res.send(payload);
	}

	// found results, loop through each result and add title and link to payload
	else {
	    obj.results.forEach(function(result){
		payload.attachments.push({
		    "fallback": "error loading response",
                    "title": result.content.title,
                    "title_link": obj._links.base + result.content._links.webui
		})
	    });
	    res.send(payload);
	}
    });
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
