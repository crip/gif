(function () {

  'use strict';

  var Shuffle = {
    init: function() {
      this.starter();
    },
    starter: function() {
      var shuffleBtn = $(".shuffle");

      shuffleBtn.on("click", function (e) {
        e.preventDefault();
        window.location = window.location;
      });
    }
  };

  $(function () {
    Shuffle.init();
  });

})();
