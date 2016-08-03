/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  function displayPercent(percent) {
    return percent.toFixed(2) + "%";
  }

  function displayDelta(percent) {
    var sign = percent >= 0 ? '+' : '';
    return sign + displayPercent(percent);
  }

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
        var plusDelta = getDelta(candidate, 'plus', plus, data);
        var pollsDelta = getDelta(candidate, 'polls', polls, data);
        var nowDelta = getDelta(candidate, 'now', now, data);
        var candidateObj = {
          'candidate': candidate,
          'polls-plus': displayPercent(plus) + ' | ' + displayDelta(plusDelta),
          // 'plus-change': displayDelta(plusDelta),

          'polls-only': displayPercent(polls) + ' | ' + displayDelta(pollsDelta),
          // 'polls-change': displayDelta(pollsDelta),            

          'now-cast': displayPercent(now) + ' | ' + displayDelta(nowDelta),
          // 'now-change': displayDelta(nowDelta),
        };

        forecasts.push(candidateObj);

      });

      function getDelta(candidate, forecast, todays, data) {
        var lastWeek = moment().subtract(7, 'days').format('YYYY-MM-DD');
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
