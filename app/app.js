"use strict";
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const request = require('request');
const moment = require('moment');
const tz = require('moment-timezone');
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
    res.send(""+(current_result ? mountain : no));
});

app.get('/api', function (req, res) {
    let obj = {
        result: current_result,
        image: url_of_image
    };
    res.json(obj);
});

app.get('/api/simple', function (req, res) {
    res.sendStatus((current_result ? 200 : 404));
});

function process() {
    var now = moment();
    var datetime = now.tz('America/Los_Angeles').format('Y_MM_DD/HH');
    var mins = now.tz('America/Los_Angeles').format('mm');
    mins = Math.floor(Number(mins)/10)*10;
    mins = mins < 10 ? '0'+mins : mins;
    datetime = datetime + mins;
    var url = "https://ismtrainierout.com/timelapse/"+datetime+".jpg";

    // An example of an image with the mountain in it
    // url = 'https://ismtrainierout.com/timelapse/2017_06_10/0710.jpg';

    https.get(url, function(res) {
        console.log(datetime +": "+res.statusCode);
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
                    d'    '  '  \\ 'b      The mountain is out!
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

const no = `
            The mountain is not out.
                _
              ('  ).                   _
             (     ).              .:('  )'.
)           _(       ''.          :(   .    )
        .=('(      .   )     .--  '.  (    ) )
       ((    (..__.:'-'   .+(   )   ' _'  ) )
'.     '(       ) )       (   .  )     (   )  ._
  )      ' __.:'   )     (   (   ))     '-'.-('  )
)  )  ( )       --'       '- __.'         :(      ))
.-'  (_.'          .')                    '(    )  ))
                  (_  )                     ' __.:'
`
