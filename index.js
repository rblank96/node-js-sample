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
  request
    .get('https://slackoverflow.atlassian.net/wiki/rest/api/search?cql=type="ac:com.atlassian.confluence.plugins.confluence-questions:question"',
    {
      'auth': {
        'user': 'alichen@predictivetechnologies.com',
        'pass': 'QJf4In3V9BhK7rEgdehrC726',
        'sendImmediately': false
      }
    })
    .on('response', function(response) {
      console.log(response)
      res.send(response)
    })
    .on('error', function(err) {
      res.send("error"")
    })
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
