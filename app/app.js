const express = require('express')
const app = express()
const dateTime = require('node-datetime')

app.get('/', function (req, res) {
  var dt = dateTime.create();
  var formatted = dt.format('Y_m_d/H');
  var mins = Math.floor((new Date()).getMinutes()/10)*10;
  mins = mins < 10 ? '0'+mins : mins
  var url = "https://ismtrainierout.com/timelapse/"+formatted+mins+".jpg"
  
  //$.ajax({type:"GET", url:'/'}).done();
  res.send(url)
})

app.listen(3000, function () {
  console.log('The Mountain is listening on port 3000')
})