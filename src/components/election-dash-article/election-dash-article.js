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

    ready: function() {
      this.formattedDate = moment(this.model.date).format('MMMM Do, h:mm a');
      this.formattedAuthor = this.model.author.length > 22 ?
        this.model.author.substring(0,19) + '...' :
        this.model.author.substring(0,19);
      this.formattedDescription = this._formatArticle(this.model.description);
    },

    _formatArticle: function(description) {
      return description.split('[…]')[0].trim() + '...';
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
