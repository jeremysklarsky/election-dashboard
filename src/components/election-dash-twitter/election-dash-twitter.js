/*globals Polymer*/
/*jshint newcap: false*/
(function () {
  'use strict';

  Polymer({
    is: 'election-dash-twitter',

    properties: {
      users: {
        type: Array,
        value: [
          {
            name: 'Nate Silver',
            handle: 'NateSilver538'
          },
          {
            name: 'Harry Enten',
            handle: 'ForecasterEnten'
          },
          {
            name: 'Clare Malone',
            handle: 'claremalone'
          },
          {
            name: 'Nate Cohn',
            handle: 'Nate_Cohn'
          },          
        ]
      }
    }

  });

})();
