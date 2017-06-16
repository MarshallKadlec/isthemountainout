const express = require('express')
const app = express()
const dateTime = require('node-datetime')
var clarifai = require('clarifai');
var sauron = new clarifai.App(
  'MmmraZ1T8H05NGxbFGRRgZFDbs5StmYgGpuu56QN',
  'Px7GGwokqNrDKiDSp2iOl7ecWkAcXWTrojvqMha8'
)

var current_result = false

app.get('/', function (req, res) {
  res.send(current_result)
})

var process = function ()
{
  var dt = dateTime.create()
  var formatted = dt.format('Y_m_d/H')
  var mins = Math.floor((new Date()).getMinutes()/10)*10
  mins = mins < 10 ? '0'+mins : mins
  var url = "https://ismtrainierout.com/timelapse/"+formatted+mins+".jpg"
  
  //$.ajax({type:"GET", url:'/'}).done();
}

app.listen(3000, function () {
  console.log('The Mountain is listening on port 3000')
})