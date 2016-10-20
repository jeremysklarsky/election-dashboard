/*globals Polymer, _*/
/*jshint newcap: false*/
(function () {
  'use strict';

  function findSpread(polls) {
  return isClintonUp(polls) ?
    'Clinton +' + (polls.clinton - polls.trump).toFixed(1) :
    'Trump +' + (polls.trump - polls.clinton).toFixed(1);
  }

  function isClintonUp(polls) {
    return polls.clinton >= polls.trump;
  }

  function formatDates(start, end) {
    var format = 'MM/DD';
    var startDate = moment(start).format(format);
    var endDate = moment(end).format(format);
    
    return startDate + '-' + endDate;
  }

  function findByCandidate(polls, candidate) {
    var choice = _.find(polls, function(poll){
      return poll.choice === candidate;
    });

    if (choice) {
      return choice.pct;
    } else {
      return '--';
    }
  }  

  Polymer({
    is: 'election-dash-polls',

    ready: function() {
      var grid = this.$.grid;
      var polls = [];
      var pollData = [];
      grid.set('data', []);
      this.$.recentpolls.get().then(function(data){
        var updates = data.response.updates;
        for (var i = 0; i < 50; i++) {
          
          for (var j = 0; j < updates[i].polls.length; j++) {
            polls.push(updates[i].polls[j]);
          }
        }
        for (var p = 0; p < polls.length; p++) {
          var obj = {
            state: polls[p].state,
            pollster: polls[p].pollster.slice(0,15),
            dates: formatDates(polls[p].startDate, polls[p].endDate),
            clinton: findByCandidate(polls[p].votingAnswers, 'Clinton'),
            trump: findByCandidate(polls[p].votingAnswers, 'Trump'),
            johnson: findByCandidate(polls[p].votingAnswers, 'Johnson'),
            national: polls[p].state === 'USA'
          };
          obj.isClintonUp = isClintonUp(obj);
          obj.spread = findSpread(obj) + '%';
          pollData.push(obj);
        }
        grid.set('data', pollData);
      }.bind(this));
    }

  });

})();
