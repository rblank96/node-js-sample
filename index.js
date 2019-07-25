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
    var options = {
   method: 'GET',
   url: 'https://slackoverflow.atlassian.net/wiki/rest/api/search?cql=type="ac:com.atlassian.confluence.plugins.confluence-questions:question"',
   auth: { username: 'alichen@predictivetechnologies.com', password: 'QJf4In3V9BhK7rEgdehrC726' },
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   }
   };
  /*
  request
    .get('https://slackoverflow.atlassian.net/wiki/rest/api/search?cql=type="ac:com.atlassian.confluence.plugins.confluence-questions:question"',
    {
	'auth': {
        'username': 'alichen@predictivetechnologies.com',
        'password': 'QJf4In3V9BhK7rEgdehrC726'
	},

	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
	}

	
    })
    .on('response', function(response) {
      console.log(response)
      res.send(response)
    })
    .on('error', function(err) {
      res.send("error")
    })
});
  */
request(options, function (error, response, body) {
   if (error) throw new Error(error);
   console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
   );
    var output = "";
    var obj = JSON.parse(body);
    console.log(obj.results);

    obj.results.forEach(function(result){
	output += result.content.title + "\n";

      });
 
    res.send(output);
});
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
