/*globals Polymer*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-battlegrounds',

    properties: {
      states: {
        type: Array,
        value: [
          {
            state: 'North Carolina',
            link: '2016-north-carolina-president-trump-vs-clinton',
            slug: 'nc'
          },
          {
            state: 'Florida',
            link: '2016-florida-presidential-general-election-trump-vs-clinton',
            slug: 'fl'
          },
          {
            state: 'Ohio',
            link: '2016-ohio-president-trump-vs-clinton',
            slug: 'oh'
          },
          {
            state: 'Pennsylvania',
            link: '2016-pennsylvania-president-trump-vs-clinton',
            slug: 'pa'
          },
          {
            state: 'Colorado',
            link: '2016-colorado-president-trump-vs-clinton',
            slug: 'co'
          },
          {
            state: 'Virginia',
            link: '2016-virginia-president-trump-vs-clinton',
            slug: 'va'
          },
          {
            state: 'Wisconsin',
            link: '2016-wisconsin-president-trump-vs-clinton',
            slug: 'wi'
          },
          {
            state: 'Iowa',
            link: '2016-iowa-president-trump-vs-clinton',
            slug: 'ia'
          }
        ],
        reflectToAttribute: true,
        notify: true
      }

    },

    ready: function() {
      var self = this;

      this.$.grid.set('data', []);

      _.each(this.states, function(state){

        $.ajax({
          url: 'https://elections.huffingtonpost.com/pollster/api/charts/' + state.link,
          dataType: 'jsonp',
          success: function(data) {
            self._addData(data);
          }
        });

      });
    },

    _addData: function(data) {
      var estimates = data.estimates;
      var obj = {state: data.state};
      var candidates = ['Clinton', 'Trump'];

      _.each(candidates, function(candidate){
        obj[candidate] = parseFloat(findByCandidate(estimates, candidate));
      });

      function findByCandidate(estimates, candidate) {
        return _.find(estimates, function(estimate){
          return estimate.choice === candidate;
        }).value;
      }

      function findSpread(polls) {
        return isClintonUp(polls) ?
          'Clinton +' + (polls.Clinton - polls.Trump).toFixed(1) :
          'Trump +' + (polls.Trump - polls.Clinton).toFixed(1);
      }


      function isClintonUp(polls) {
        return polls.Clinton >= polls.Trump;
      }

      obj.isClintonUp = isClintonUp(obj);
      obj.spread = findSpread(obj) + '%';
      this.$.grid.push('data', obj);
    }

  });

})();
