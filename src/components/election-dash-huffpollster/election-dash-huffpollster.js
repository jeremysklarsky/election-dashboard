/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  function displayPercent(percent) {
    return percent.toFixed(2) + "%";
  }

  Polymer({
    is: 'election-dash-huffpollster',

    ready: function() {
      var $grid = this.$.grid;
      var polls = [];

      $.ajax({
        url: 'https://elections.huffingtonpost.com/pollster/api/charts/2016-general-election-trump-vs-clinton-vs-johnson',
        dataType: 'jsonp',
        success: function(data) {
          _.each(data.estimates, function(candidate) {
            polls.push({
              candidate: candidate.choice,
              percent: candidate.value + '%'
            });
          });

          $grid.set('data', polls);
        }
      });  
    }

  });

})();
