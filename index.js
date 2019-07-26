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


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
    res.send("hello");
})



app.post('/search', function(req, res) {
    var search_term = req.body.text;
    var options = {
   method: 'GET',
   url: 'https://slackoverflow.atlassian.net/wiki/rest/api/search?cql=type="ac:com.atlassian.confluence.plugins.confluence-questions:question"+and+title~"' + search_term + '"+or+text~"' + search_term + '"',
   auth: { username: 'alichen@predictivetechnologies.com', password: 'QJf4In3V9BhK7rEgdehrC726' },
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   }
   };

request(options, function (error, response, body) {
   if (error) throw new Error(error);
   console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
   );
    var payload = {};
    var output = "";
    
    var obj = JSON.parse(body);
    console.log(obj);

    if (obj.results.length == 0){
	payload = {
	    "attatchments": [{
		"pretext": "No results found :(",
		"title": "Add confluence FAQ",
		"title_link": "https://slackoverflow.atlassian.net/wiki/display/SLACKOVERF/customcontent/list/ac%3Acom.atlassian.confluence.plugins.confluence-questions%3Aquestion?ac.com.atlassian.confluence.plugins.confluence-questions.path=/questions"
	    }]
	}
	res.send(JSON.stringify(payload));
    }

    else{
    
    obj.results.forEach(function(result){
	output += result.content.title + ": " + obj._links.base + result.content._links.webui + "\n";
    
    });
	res.send(output);
    }
	
    
});
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
