/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  function displayPercent(percent) {
    return percent.toFixed(2) + "%";
  }

  Polymer({
    is: 'election-dash-polls',

    ready: function() {
      var myIframe = this.$.rcp;
      myIframe.onload = function () {
        myIframe.contentWindow.scrollTo(0,200);
      };
    }

  });

})();
