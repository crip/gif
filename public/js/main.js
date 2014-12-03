(function () {

  'use strict';

  var Shuffle = {
    init: function() {
      this.starter();
    },
    starter: function() {
      var img = $("#main img"),
          shuffleBtn = $("#shuffle"),
          gifTitle = $("#gifTitle"),
          siteTitle = window.title;

      shuffleBtn.on("click", function (e) {
        e.preventDefault();
        $.ajax({
          url: '/api/random',
          type: 'get',
          success: function (res) {
            img.attr('src', res.url);
            gifTitle.text(res.title);
          }
        });
      });
    }
  };

  $(function () {
    Shuffle.init();
  });

})();
