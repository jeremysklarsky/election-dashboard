/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-countdown',

    properties: {
      time: {
        type: String,
        value: moment("20161108", "YYYYMMDD").fromNow(),
      }
    }
  });

})();
