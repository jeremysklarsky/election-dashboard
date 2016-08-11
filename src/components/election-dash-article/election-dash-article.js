/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-article',

    properties: {
      model: {
        type: Object,
        value: null,
      }
    },

    _click: function() {
      var drawer = this.querySelector('#drawer_' + this.model.index);

      if (drawer.expanded) {
        drawer.close();
      } else {
        drawer.open();
      }
    },
  });
})();
