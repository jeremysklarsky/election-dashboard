/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-feed',

    properties: {
      articles: {
        type: Array,
        value: []
      }
    },


    ready: function() {
      var forecasts = [];
      var articles = this.articles;
      this.$.feed.get().then(function(data){
        var items = data.response.items;
        _.each(items, function(item, index){
          this.push('articles', {
            title: item.title,
            author: item.author,
            link: item.link,
            thumbnail: item.thumbnail,
            description: item.description,
            date: item.pubDate,
            index: index
          });
        }.bind(this));
      }.bind(this)); 
    },


  });

})();
