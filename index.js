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
        
    var obj = JSON.parse(body);
    console.log(obj);
    var output= "";
    var payload = {
            headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
            },
	"attachments":[]
    }
    
    if (obj.results.length == 0){
	payload.attachments.push({
		"fallback": "no results found ::",
		"pretext": "No results found",
		"title": "Add confluence FAQ",
	    "title_link": "https://slackoverflow.atlassian.net/wiki/display/SLACKOVERF/customcontent/list/ac%3Acom.atlassian.confluence.plugins.confluence-questions%3Aquestion?ac.com.atlassian.confluence.plugins.confluence-questions.path=/questions/ask",
	    "author_icon": "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiYxO2D7tLjAhUPUt8KHfRjC5EQjRx6BAgBEAU&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcrying-emoji&psig=AOvVaw0qG4tETJRk-hYk_kqHC9cP&ust=1564239558669488"
	});
	
	res.send(payload);
    }

    else{
	
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
