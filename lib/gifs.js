var fs      = require('fs'),
    path    = require('path'),
    rmExt   = require('remove-ext'),
    dirname = 'gifs',
    dir     = path.join(__dirname, '..', dirname);

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
    return rmExt(gif, 'gif').replace(/-/g, ' ');
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
  }

};
