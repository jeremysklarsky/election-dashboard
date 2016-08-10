/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-538',

    properties: {
      voteShare: {
        type: Object,
        notify: true
      }
    },

    ready: function() {
      var forecasts = [];
      this.$.forecast.get().then(function(data){
        this._setData(data.response.forecasts.all);        
      }.bind(this)); 
    },

    _setData: function(data) {
      var $grid = this.$.grid;
      var candidates = ['Clinton', 'Trump', 'Johnson'];
      var forecasts = [];

      _.each(candidates, function(candidate){
        var plus = getData(candidate, 'plus', data);
        var polls = getData(candidate, 'polls', data);
        var now = getData(candidate, 'now', data);
        var plusSeven = getDelta(candidate, 'plus', plus, data, 7);
        var pollsSeven = getDelta(candidate, 'polls', polls, data, 7);
        var nowSeven = getDelta(candidate, 'now', now, data, 7);
        var plusThree = getDelta(candidate, 'plus', plus, data, 3);
        var pollsThree = getDelta(candidate, 'polls', polls, data, 3);
        var nowThree = getDelta(candidate, 'now', now, data, 3);

        var candidateObj = {
          'candidate': candidate,
          'polls-plus': Utils.displayPercent(plus) + ' / ' + Utils.displayDelta(plusThree) + ' / ' + Utils.displayDelta(plusSeven),
          // 'plus-change': Utils.displayDelta(plusDelta),

          'polls-only': Utils.displayPercent(polls) + ' / ' + Utils.displayDelta(pollsThree) + ' / ' + Utils.displayDelta(pollsSeven),
          // 'polls-change': Utils.displayDelta(pollsDelta),            

          'now-cast': Utils.displayPercent(now) + ' / ' + Utils.displayDelta(nowThree) + ' / ' + Utils.displayDelta(nowSeven),
          // 'now-change': Utils.displayDelta(nowDelta),
        };

        forecasts.push(candidateObj);

      });

      function getDelta(candidate, forecast, todays, data, days) {
        var lastWeek = moment().subtract(days, 'days').format('YYYY-MM-DD');
        var oldForecast = _.find(data, function(cast) { 
          return (cast.date === lastWeek) && cast.candidate === candidate;
        }).models[forecast].winprob;

        return todays - oldForecast;
      }

      function getData(candidate, forecast, data) {
        return _.find(data, function(forecast) { return forecast.candidate === candidate; }).models[forecast].winprob;
      }
      $grid.set('data', forecasts);
    }

  });

})();
