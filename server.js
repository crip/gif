/**
 * Crip Gifs
 * Copyright (c) 2014 Crip.io
 * Using Express, Jade, Request
 */


/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/
var
  express        = require('express'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  request        = require('request'),
  path           = require('path'),
  fs             = require('fs');

var app = express();


/*-------------------------------------------------------------------
  Environments
-------------------------------------------------------------------*/
app.set('port', 3333);
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(methodOverride());

// Define folder to contain gifs
app.use('/', express.static(path.join(__dirname, 'gifs')));


/*-------------------------------------------------------------------
  Routes
-------------------------------------------------------------------*/
/**
 * Root
 */
app.get('/', function (req, res) {
  fs.readdir(path.join(__dirname, 'gifs'), function methodName(err, files) {
    if (err) {
      res.send(500, 'There was an error on the server');
      return;
    }

    if (files.length) {
      var file = Math.floor(Math.random() * files.length);
      res.render('gif', {
        gif: files[file]
      });
    } else {
      res.send(404, 'There are no gifs, you crip.')
    }
  });
});


/**
 * List all Gifs
 */
app.get('/list', function (req, res) {
  fs.readdir(path.join(__dirname, 'gifs'), function (err, files) {
    if (err) {
      res.send(500, 'There was an error on the server');
      return;
    }

    if (files.length) {
      res.render('list', {
        gifs: files.map(function (file) {
          return file.replace('.gif', '')
        })
      });
    } else {
      res.send(404, 'There are no gifs, you crip.')
    }
  });
});

/**
 * Display single gif
 */
app.get('/:gif', function (req, res) {
  var gif = req.params.gif + '.gif';

  fs.exists(path.join(__dirname, 'gifs', gif), function (exists) {
    if (exists) {
      res.render('single', {
        gif: gif
      });
    } else {
      res.send(404, 'There are no gif, you crip');
    }
  });
});


/*-------------------------------------------------------------------
  Run this beauty
-------------------------------------------------------------------*/
app.listen(app.get('port'));
console.log('Server is listening on port ' + app.get('port'));
