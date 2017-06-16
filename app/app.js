"use strict";
const express = require('express');
const app = express();
const dateTime = require('node-datetime');
const https = require('https');
const fs = require('fs');
const request = require('request');
const gm = require('gm').subClass({imageMagick: true});
require('gm-base64');
var clarifai = require('clarifai');
const secrets = require('../secrets');
var sauron = new clarifai.App(
  secrets.clarifai.client_id,
  secrets.clarifai.client_secret
);
var current_result = false;
var url_of_image = "";

app.get('/', function (req, res) {
    res.send(""+(current_result ? mountain : "No."));
})

function process() {
    // math time
    var dt = dateTime.create();
    var formatted = dt.format('Y_m_d/H');
    var mins = Math.floor((new Date()).getMinutes()/10)*10;
    mins = mins < 10 ? '0'+mins : mins;
    var datetime = formatted+mins;

    var url = "https://ismtrainierout.com/timelapse/"+datetime+".jpg";

    // An example of an image with the mountain in it
    //url = 'https://ismtrainierout.com/timelapse/2017_06_10/0710.jpg';

    https.get(url, function(res) {
        console.log(datetime+": "+res.statusCode);
        if(res.statusCode == 200){
            url_of_image = url;
            containsMountain(url);
          }
    });
}

app.listen(3000, function () {
    console.log('The Mountain is listening on port 3000')
})

setInterval(process, 600000)
process()

function containsMountain(url) {
    gm(request(url))
    .crop(178, 100, 296, 119)
    .toBase64('png', function(err, base64){
        sauron.models.predict(Clarifai.GENERAL_MODEL, {base64: base64}).then(
            (response) => {
                var list = response.outputs[0].data.concepts;
                var found = false;
                for(var i = 0; i < list.length; i++) {
                    if (list[i].name.toLowerCase() == 'mountain') {
                        found = true;
                        break;
                    }
                }
                console.log(found);
                current_result = found;
            },
            (err) => {
                console.log(JSON.stringify(err));
            }
        );
    });
}


const mountain = `
                        ,sdPBbs.
                      ,d$$$$$$$$b.
                     d$P''Y''Y''?$b
                    d'    '  '  \\ 'b           YES!
                   /    |        \\  \\
                  /    / \\       |   \\
             _,--'        |      \\    |
           /' _/          \\   |        \\
        _/' /'             |   \\        '-.__
    __/'       ,-'    /    |    |     \\      '--...__
  /'          /      |    / \\     \\     '-.           '\\
 /    /;;,,__-'      /   /    \\            \\            '-.
/    |;;;;;;;\\                                             \\
`

