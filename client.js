if (Meteor.isClient) {


  var now = new Date(TimeSync.serverTime());
  // counter starts at 0
  Session.setDefault('counter', 0);

  Meteor.subscribe('matches');
  Meteor.subscribe('matches-stat');
  //Meteor.subscribe('users');



  var seconds = 5;

  Template.hello.helpers({

    finding: function () {
      var now = new Date(TimeSync.serverTime());
      //console.log(Users.find({$or: [{email: 'some@mail.com'},{city: 'atlanta'}]}).fetch());
      var r = Matches
      .findOne({
        $or: [{user1_id: Meteor.userId()}, {user2_id: Meteor.userId()}], 
        created_at: { $gt: moment(now).subtract(seconds, 'seconds').toDate() }}
        , {sort: {created_at: -1}})
      
      return r;
    },
    game: function () {
      var now = new Date(TimeSync.serverTime());
      var match = Matches
      .findOne({
        $or: [{user1_id: Meteor.userId()}, {user2_id: Meteor.userId()}], 
        started_at: { $gt: moment(now).subtract(7, 'seconds').toDate() }}
        , {sort: {started_at: -1}})
      
      return match;
    },
    opponentStatus: function() {
      var match = Matches.findOne({_id: Session.get("match_id")});
      console.log(match);

      if (Meteor.user()._id === match.user1_id && match.user2_choice) {
        return 1;
      }
      if (Meteor.user()._id === match.user2_id && match.user1_choice) {
        return 1;
      }

      return;
    },
    // status of current match
    status: function() {
      var match = Matches.findOne({_id: Session.get("match_id")});
      console.log(match);
      console.log(Meteor.user());
      return match;
    },
    /*matchResult: function(type) {
      var match = Matches.findOne({_id: Session.get("match_id")});
      if (match && match.winner !== undefined) {
        if (type === "win" && match.winner === Meteor.user()._id) {
          return true;
        } else if (type === "draw" && match.winner === null) {
          return true;
        } else if (type === "lost" && match.winner !== Meteor.user()._id) {
          return true;
        } 
      }
      return false;
    },*/

    matchResult: function() {
      var match = Matches.findOne({_id: Session.get("match_id")});
      if (match && match.winner !== undefined) {
        if (match.winner === Meteor.user()._id) {
          return "win";
        } else if (match.winner === null) {
          return "draw";
        } else if (match.winner !== Meteor.user()._id) {
          return "lost";
        } 
      }
      return false;
    },

    matchesStatCount: function() {
      return MatchesStat.find().count();
    },

    countdown: function () {

      var now = new Date(TimeSync.serverTime());
      var r = Matches
      .findOne({user1_id: Meteor.userId(), created_at: { $gt: moment(now).subtract(seconds, 'seconds').toDate() }}, {sort: {created_at: -1}})

      var timeLeft = moment.duration(moment(new Date(r.created_at)) -  now, 'seconds');
      var diff = moment.utc(moment(now).diff(moment(r.created_at))).format("s");

      diff = seconds - parseInt(diff, 10);

      return diff;
    },



  });


  Handlebars.registerHelper('session', function(input){
    return Session.get(input);
  });


  Template.hello.events({
    'click .choice': function () {
      var number = (event.target.id).split('-')[1];
      var match_id = Session.get("match_id");
      console.log(match_id);
      console.log(number);
      Meteor.call('makeChoice', match_id, number, function (error, result) {
        console.log('made choice');
        Session.set("madeChoice", number);
      });
    },
    'click #start-game': function () {
      var result = Meteor.call('findOpponent', function (error, result) {
        Session.set("match_id", result);
        Session.set("madeChoice", false);
        console.log(result);
      });

    }
  });
}
