/**
 * Crip Gifs
 * Copyright (c) 2014 Crip.io
 * Using Express, Jade, Request
 */


/*-------------------------------------------------------------------
  Required modules.
-------------------------------------------------------------------*/
var
  express        = require('express'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  request        = require('request'),
  path           = require('path'),
  fs             = require('fs'),
  rmExt          = require('remove-ext'),
  config         = require('./config.js'),
  wrapper        = require('./lib/wrapper.js'),
  gifs           = require('./lib/gifs.js');

var app = express();


/*-------------------------------------------------------------------
  Environments
-------------------------------------------------------------------*/
app.set('port', 3333);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(methodOverride());

// Define folder to contain gifs
app.use('/', express.static(path.join(__dirname, 'gifs')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Catch-all route to set global values
app.use(function( req, res, next ) {
  res.locals.wrap = wrapper.create({
    start: new Date()
  });
  res.locals.title = function (title) {
    var excludeGif = rmExt(title, 'gif').replace(/-/g, ' '),
        title = excludeGif.charAt(0).toUpperCase() + excludeGif.slice(1);
    return title;
  };
  next();
});


/*-------------------------------------------------------------------
  Routes
-------------------------------------------------------------------*/
/**
 * Root
 */
app.get('/', function (req, res) {
  fs.readdir(gifs.dir, function methodName(err, files) {
    if (err) {
      res.status(500).send('There was an error on the server');
      return;
    }

    if (files.length) {
      var file = Math.floor(Math.random() * files.length);
      res.render('gif', {
        gif: files[file],
        single: rmExt(files[file], 'gif'),
        full: rmExt(files[file], 'gif') + '/full',
        title: res.locals.title(files[file])
      });
    } else {
      res.status(404).send('There are no gifs, you crip.')
    }
  });
});

/**
 * API
 */
app.get('/api', function (req, res) {
  fs.readdir(path.join(__dirname, 'gifs'), function (err, files) {
    if ( err ) {
      res.status(500).json({ error: err });
      return;
    }

    res.status(200).json(res.locals.wrap(files.map(function( gif ) {
      return config.url + rmExt(gif, 'gif');
    }), {
      next: config.url + 'api?page=2',
      random: config.url + 'api/random',
      home: config.url
    }));
  });
});

/**
 * API Random
 */

app.get('/api/random', function (req, res) {
  gifs.random(function (err, gif) {
    if (err) {
      if (err == 'no files') {
        res.status(200).json({ error: 'There are no gifs, you crip.' });
      } else {
        res.status(500).json({ error: err });
      }
    } else {
      res.send({
        url:   config.url + gif,
        title: gifs.getTitle(gif)
      });
    }
  });
});

/**
 * List all Gifs
 */
app.get('/list', function (req, res) {
  gifs.list(function (err, gif) {
    if (err) {
      if (err == 'no files') {
        res.status(200).json({ error: 'There are no gifs, you crip.' });
      } else {
        res.status(500).json({ error: err });
      }
    } else {
      res.render('list', {
        title: "All Gifs",
        gifs: gif
      });
    }
  });
});

/**
 * Redirect to random gif
 */
app.get('/random', function (req, res) {
  gifs.random(function (err, gif) {
    if (err) {
      if (err == 'no files') {
        res.status(200).json({ error: 'There are no gifs, you crip.' });
      } else {
        res.status(500).json({ error: err });
      }
    } else {
      fs.readFile(gifs.dir + '/' + gif, function (err, data) {
        if (err) {
          res.status(500).send('There was an error on the server');
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Access-Control-Allow-Origin':'*',
            'X-Gif-Link': config.url + gifs.dirname + '/' + gif
          });
          res.end(data, 'binary');
        }
      })
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
        gif: gif,
        title: rmExt(gif, 'gif').replace(/-/g, ' ')
      });
    } else {
      res.status(404).send('There are no gif, you crip');
    }
  });
});

/**
 * Display full gif
 */
app.get('/:gif/full', function (req, res) {
  var gif = req.params.gif + '.gif',
      dir = path.join(__dirname, 'gifs');;

  fs.readdir(dir, function (err, files) {
    if (err) {
      res.status(500).send('There was an error on the server');
      return;
    }

    if (files.length) {
      fs.readFile(dir + '/' + gif, function (err, data) {
        if (err) {
          res.status(500).send('There was an error on the server');
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Access-Control-Allow-Origin':'*',
            'X-Gif-Link': config.url + gif
          });
          res.end(data, 'binary');
        }
      })
    } else {
      res.status(404).send('There are no gifs, you crip.');
    }
  });
});


/*-------------------------------------------------------------------
  Run this beauty
-------------------------------------------------------------------*/
app.listen(app.get('port'));
console.log('Server is listening on port ' + app.get('port'));
