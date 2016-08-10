/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-huffpollster',

    ready: function() {
      var self = this;

      $.ajax({
        url: 'https://elections.huffingtonpost.com/pollster/api/charts/2016-general-election-trump-vs-clinton-vs-johnson',
        dataType: 'jsonp',
        success: function(data) {
          self._setData(data);
        }
      });  
    },

    _setData: function(data) {
      var $grid = this.$.grid;
      var polls = [];
      var candidates = ['Clinton', 'Trump', 'Johnson', 'Other'];
      var today = data.estimates_by_date[0];
      var threeDays = data.estimates_by_date[3];
      var lastWeek = data.estimates_by_date[7];
      _.each(candidates, function(candidate){
        var todaysAvg = findByCandidate(today, candidate);
        var threeDaysAvg = findByCandidate(threeDays, candidate);
        var lastWeeksAvg = findByCandidate(lastWeek, candidate);
        polls.push({
          candidate: candidate,
          current: Utils.displayPercent(todaysAvg),
          three: Utils.displayDelta(todaysAvg - threeDaysAvg), 
          week: Utils.displayDelta(todaysAvg - lastWeeksAvg)
        });

      });

      function findByCandidate(estimates, candidate) {
        return _.find(estimates.estimates, function(estimate){
          return estimate.choice === candidate;
        }).value;
      }

      $grid.set('data', _.sortBy(polls, function(poll){
        return parseFloat(poll.current);
      }).reverse());

    }

  });

})();
