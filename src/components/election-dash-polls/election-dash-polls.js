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

  function displayPercent(percent) {
    return percent.toFixed(2) + "%";
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
      grid.set('data', []);
      this.$.recentpolls.get().then(function(data){
        var polls = data.response;
        for (var i = 0; i < 50; i++) {
          var obj = {
            state: polls[i].state,
            pollster: polls[i].pollster.slice(0,15),
            dates: formatDates(polls[i].startDate, polls[i].endDate),
            clinton: findByCandidate(polls[i].votingAnswers, 'Clinton'),
            trump: findByCandidate(polls[i].votingAnswers, 'Trump'),
            johnson: findByCandidate(polls[i].votingAnswers, 'Johnson'),
            national: polls[i].state === 'USA'
          };
          obj.isClintonUp = isClintonUp(obj);
          obj.spread = findSpread(obj) + '%';
          grid.push('data', obj);
        }
      }.bind(this));
    }

  });

})();
