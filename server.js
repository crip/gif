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
  rmExt          = require('remove-ext');

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


/*-------------------------------------------------------------------
  Routes
-------------------------------------------------------------------*/
/**
 * Root
 */
app.get('/', function (req, res) {
  fs.readdir(path.join(__dirname, 'gifs'), function methodName(err, files) {
    if (err) {
      res.status(500).send('There was an error on the server');
      return;
    }

    if (files.length) {
      var file = Math.floor(Math.random() * files.length);
      res.render('gif', {
        gif: files[file],
        title: rmExt(files[file], 'gif').replace('-', ' ')
      });
    } else {
      res.status(404).send('There are no gifs, you crip.')
    }
  });
});


/**
 * List all Gifs
 */
app.get('/list', function (req, res) {
  fs.readdir(path.join(__dirname, 'gifs'), function (err, files) {
    if (err) {
      res.status(500).send('There was an error on the server');
      return;
    }

    if (files.length) {
      res.render('list', {
        gifs: files.map(function (file) {
          return rmExt(file, 'gif')
        })
      });
    } else {
      res.status(404).send('There are no gifs, you crip.')
    }
  });
});

/**
 * Redirect to random gif
 */
app.get('/random', function (req, res) {
  var dir = path.join(__dirname, 'gifs');
  fs.readdir(dir, function (err, files) {
    if (err) {
      res.status(500).send('There was an error on the server');
      return;
    }

    if (files.length) {
      var gif = files[Math.floor(Math.random() * files.length)];
      fs.readFile(dir + '/' + gif, function (err, data) {
        if (err) {
          res.status(500).send('There was an error on the server');
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/gif'
          });
          res.end(data, 'binary');
        }
      })
    } else {
      res.status(404).send('There are no gifs, you crip.');
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
        title: rmExt(gif, 'gif').replace('-', ' ')
      });
    } else {
      res.status(404).send('There are no gif, you crip');
    }
  });
});
/*-------------------------------------------------------------------
  Run this beauty
-------------------------------------------------------------------*/
app.listen(app.get('port'));
console.log('Server is listening on port ' + app.get('port'));
