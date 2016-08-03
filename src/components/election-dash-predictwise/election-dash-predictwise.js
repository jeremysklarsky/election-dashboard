/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-predictwise',

    ready: function() {
      var $grid = this.$.grid;
      var forecasts = [];
      this.$.markets.get().then(function(data){
        var latest = data.response.tables[0].table;
        var odds = [];
        _.each(latest, function(candidate){
          odds.push({
            'candidate': candidate[0] === 'Democratic' ? 'Clinton' : 'Trump',
            'odds': candidate[1].trim()
          });
        });

        $grid.set('data', odds);
      }.bind(this)); 
    }    

  });

})();
