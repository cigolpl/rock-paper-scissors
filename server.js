Game = (function () {

  var getUser = function () {
    return Meteor.userId();
  }

  /**
   */
  var findOpponent = function () {
    var match = Matches
    .findOne({created_at: { $gt: moment(new Date()).subtract(seconds, 'seconds').toDate() }}, {sort: {created_at: -1}})

    if (match) {
      var data = {found: true, user2_id: Game.getUser(), started_at: new Date(), stake: 50};
      Matches.update(match._id, {$set: data});
      MatchesStat.insert({
        started_at: new Date()
      });

      return match._id;
    } else {
      return Matches.insert({
        user1_id: Game.getUser(),
        created_at: new Date()
      });
    }
  };

  // rock, paper, scissors
  var calculateWinner = function(choice1, choice2) {
    if (choice1 === choice2) {
      return 0;
    } 

    var array = [3, 1, 2];

    for (var i = 1 ; i <= 3 ; ++i) {
      if (choice1 === i && choice2 === array[i-1]) {
        return 1;
      }
    }
    return 2;
  }

  var makeChoice = function (match_id, choice) {
    var match = Matches.findOne({_id: match_id});

    /*if (!match.user1_choice || !match.user2_choice) {
      return;
    }*/

    if (Game.getUser() === match.user1_id) {
      Matches.update(match._id, {$set: {user1_choice: choice}});
    } else if (Game.getUser() === match.user2_id) {
      Matches.update(match._id, {$set: {user2_choice: choice}});
    };

    match = Matches.findOne({_id: match_id});
    if (match.user1_choice && match.user2_choice) {
      var winner = calculateWinner(match.user1_choice, match.user2_choice);
      var winnerUser = null;
      if (winner === 1) {
        winnerUser = match.user1_id;
      } else if (winner === 2) {
        winnerUser = match.user2_id;
      }
      Matches.update(match._id, {$set: {winner: winnerUser}});
    }
  }

  return {
    findOpponent: findOpponent,
    getUser: getUser,
    calculateWinner: calculateWinner,
    makeChoice: makeChoice
  }

})();



if (Meteor.isServer) {
  Meteor.methods({
    makeChoice: Game.makeChoice,
    findOpponent: Game.findOpponent
  });

  Meteor.publish('matches-stat', function(stockNumber) {
    return MatchesStat.find();
  });

  Meteor.publish('matches', function(stockNumber) {
    return Matches.find();
    //this.ready();
  });

  Meteor.startup(function () {
    // code to run on server at startup
    //
    //

  });

}
