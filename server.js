// server.js
// where your node app starts

// init project
require('dotenv').config();
const express = require('express');
const app = express();
const { detect } = require('detect-browser');
const browser = detect();
const { networkInterfaces } = require('os');
const nets = networkInterfaces();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/whoami", (req, res) => {
  console.log(process.env.USER);
  console.log(process.env.LANG);
// handle the case where we don't detect the browser
  if (browser) {
    console.log("name: ", browser.name);
    console.log("version: ", browser.version);
    console.log("os: ", browser.os);
    console.log(browser);
  }
  let results = {};
  if (nets) {
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
    console.log(nets.en0[1].address);
  }

  

  res.json({
    "ipaddress" : Object.values(results).flat()[0],
    "language": process.env.LANG,
    "software": browser ? `${browser.name} ${browser.version} ${browser.os}` : 'browser info'
  })
  
});



// listen for requests :)
var listener = app.listen(3000 || process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
