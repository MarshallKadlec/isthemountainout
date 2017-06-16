const express = require('express')
const app = express()
const dateTime = require('node-datetime')
const https = require('https')
var clarifai = require('clarifai');
var sauron = new clarifai.App(
  'MmmraZ1T8H05NGxbFGRRgZFDbs5StmYgGpuu56QN',
  'Px7GGwokqNrDKiDSp2iOl7ecWkAcXWTrojvqMha8'
)
var current_result = "I dunno!"

app.get('/', function (req, res) {
  res.send(""+current_result)
})

var process = function ()
{
  var dt = dateTime.create()
  var formatted = dt.format('Y_m_d/H')
  var mins = Math.floor((new Date()).getMinutes()/10)*10
  mins = mins < 10 ? '0'+mins : mins
  var datetime = formatted+mins
  var url = "https://ismtrainierout.com/timelapse/"+datetime+".jpg"
  https.get(url, function(res) {
	console.log(datetime+": "+res.statusCode);
	if(res.statusCode == 200)
	{
	  sauron.models.predict(Clarifai.GENERAL_MODEL, url).then(
	    function(res) {
		  console.log(res);
		  current_result = (res['outputs'].indexOf('Mountain') == -1) ? "Nope!" : "Yep!"
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
})

setInterval(process, 600000)
process()