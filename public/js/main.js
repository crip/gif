(function () {

  'use strict';

  var Shuffle = {
    init: function() {
      this.starter();
    },
    starter: function() {
      var img = $("#main img"),
          shuffleBtn = $("#shuffle"),
          gifTitle = $("#gifTitle");

      shuffleBtn.on("click", function (e) {
        e.preventDefault();
        $.ajax({
          url: '/api/random',
          type: 'get',
          success: function (res) {
            img.attr('src', res.url);
            gifTitle.text(res.title.charAt(0).toUpperCase() + res.title.slice(1));
            document.title = "Crip Gifs - " + res.title.charAt(0).toUpperCase() + res.title.slice(1);
          }
        });
      });
    }
  };

  $(function () {
    Shuffle.init();
  });

})();
