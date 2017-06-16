const express = require('express');
const app = express();
const dateTime = require('node-datetime');
const https = require('https');
var clarifai = require('clarifai');
const secrets = require('../secrets');
var sauron = new clarifai.App(
  secrets.clarifai.client_id,
  secrets.clarifai.client_secret
);
var current_result = false;

app.get('/', function (req, res) {
  res.send(""+(current_result ? "Yep!" : "Nope!"));
})

var process = function ()
{
  var dt = dateTime.create();
  var formatted = dt.format('Y_m_d/H');
  var mins = Math.floor((new Date()).getMinutes()/10)*10;
  mins = mins < 10 ? '0'+mins : mins;
  var datetime = formatted+mins;
  var url = "https://ismtrainierout.com/timelapse/"+datetime+".jpg";
  https.get(url, function(res) {
	console.log(datetime+": "+res.statusCode);
	if(res.statusCode == 200)
	{
	  sauron.models.predict(Clarifai.GENERAL_MODEL, url).then(
	    function(res) {
		  console.log(response.outputs[0].data.concepts);
		  var found = false;
		  response.outputs[0].data.concepts.forEach(
		    function(ele) {
			  if(ele['name'].toLowerCase() == 'mountain');
			  {
				found = true;
			  }
			}
		  );
		  current_result = found;
	    },
	    function(err) {
		  console.error(err);
	    }
	  );
	}
  });
}

app.listen(3000, function () {
  console.log('The Mountain is listening on port 3000')
});

setInterval(process, 600000);
process();