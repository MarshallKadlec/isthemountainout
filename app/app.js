"use strict";

// Load keys
const secrets = require('../secrets');

// Express setup
const express = require('express');
const app = express();
app.listen(3000, function () {
    console.log('The Mountain is listening on port 3000')
})

// ImageMagick setup
const gm = require('gm').subClass({imageMagick: true});
require('gm-base64');

// Clarifai setup
const clarifai = require('clarifai');
const sauron = new clarifai.App(
    secrets.clarifai.client_id,
    secrets.clarifai.client_secret
);

// WebHooks setup
const WebHooks = require('node-webhooks');
const webHooks = new WebHooks({
    db: './../webHooksDBTest.json', // json file that store webhook URLs
});

// Misc
const fs = require('fs');
const https = require('https');
const request = require('request');
const moment = require('moment-timezone');

// Current Data
let current_result = false;
let url_of_image = '';

// For the ASCII Art
app.get('/', (req, res) => {
    res.send((current_result ? mountain : no));
});

// For the JSON response
app.get('/api', (req, res) => {
    let obj = {
        result: current_result,
        image: url_of_image
    };
    res.json(obj);
});

// For the status codes response
app.get('/api/simple', function (req, res) {
    res.sendStatus((current_result ? 200 : 404));
});

// Background Worker - CRON job
function process() {
    // format url (get time in Seattle, get time on the 10th minute - aka floor minutes, build url)
    var time = moment().tz('America/Los_Angeles').format('YYYY_MM_DD/HHmm');
    var timeFloored = time.substr(0, time.length - 1) + "0";
    var url = "https://ismtrainierout.com/timelapse/" + timeFloored + ".jpg";

    // An example of an image with the mountain in it
    // url = 'https://ismtrainierout.com/timelapse/2017_06_10/0710.jpg';

    https.get(url, function(res) {
        console.log(timeFloored +': '+res.statusCode);

        // Only process an image if it exists
        if(res.statusCode == 200){
            url_of_image = url;
            containsMountain(url);
        }
    });
}

setInterval(process, 600000)
process()

// Processes if there is a mountain in the image url
function containsMountain(url) {
    gm(request(url))
    .crop(178, 100, 296, 119)
    .toBase64('png', (err, base64) => {
        sauron.models.predict(Clarifai.GENERAL_MODEL, {base64: base64}).then(
            response => {
                var list = response.outputs[0].data.concepts;
                var found = false;
                for(var i = 0; i < list.length; i++) {
                    if (list[i].name.toLowerCase() == 'mountain') {
                        found = true;
                        break;
                    }
                }
                console.log('Found: ' + found);
                current_result = found;

                let obj = {
                    result: current_result,
                    image: url_of_image
                };
                webHooks.trigger('mountainChange', obj);
            },
            err => {
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
