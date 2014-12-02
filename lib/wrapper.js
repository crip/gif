var _ = require('underscore');

module.exports = {
  create: function( data ) {
    return function( result, links ) {
      var envelope   = {},
          resultType = Object.prototype.toString.call( result );

      envelope.links = links || {};
      envelope.request_info = {
        seconds: (new Date() - data.start) / 1000,
        cached: false
      };

      if ( resultType === '[object Object]') {
        envelope = _.extend({}, envelope, result);
      }
      else if ( resultType === '[object Array]' ) {
        envelope.request_info.total_gifs = result.length;
        envelope.gifs = result;
      }

      return envelope;
    }
  }
};
