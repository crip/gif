var fs      = require('fs');
var path    = require('path');
var rmExt   = require('remove-ext');
var dirname = 'gifs';
var dir     = path.join(__dirname, '..', dirname);

module.exports = {

  /**
   * Gifs dir path.
   */

  dir: dir,

  /**
   * Gifs dirname
   */

  dirname: dirname,

  /**
   * Get gif title.
   *
   * @param {string} gif file name
   */

  getTitle: function (gif) {
    var excludeGif = rmExt(gif, 'gif').replace(/-/g, ' ');
    var title = excludeGif.charAt(0).toUpperCase() + excludeGif.slice(1);
    
    return title;
  },

  /**
   * Get random gif
   *
   * @param {function} fn
   */

  random: function (fn) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        fn(err, null);
      } else {
        if (files.length) {
          fn(null, files[Math.floor(Math.random() * files.length)]);
        } else {
          fn('no files', null);
        }
      }
    });
  },

  /**
   * List total gifs.
   *
   * @param {function} fn
   */

  list: function (fn) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        fn(err, null);
      } else {
        if (files.length) {
          fn(null, files.map(function (file) {
            return rmExt(file, 'gif');
          }));
        } else {
          fn('no files', null);
        }
      }
    });
  }

};
