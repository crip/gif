(function () {

  'use strict';

  var Shuffle = {
    init: function() {
      this.starter();
    },
    starter: function() {
      var img = $("#main img"),
          shuffleBtn = $("#shuffle");

      shuffleBtn.on("click", function (e) {
        e.preventDefault();
        $.ajax({
          url: '/random',
          type: 'get',
          success: function () {
            img.attr('src', this.url);
          }
        });
      });
    }
  };

  $(function () {
    Shuffle.init();
  });

})();
