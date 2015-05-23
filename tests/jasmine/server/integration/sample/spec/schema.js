"use strict";
describe("test game", function() {

  beforeEach(function(done) {
    //Accounts.remove();
    //Accounts.createUser({email: 'a@a.com', password: '123456'});
    /*Accounts.loginWithPassword('a@a.com', '123456', function() {
      return done();
    });*/

    //MeteorStubs.install();
    return done();
  });

  afterEach(function(done) {
    //MeteorStubs.uninstall();
    return done();
  });

  it("calculateWinner", function() {
    //expect(false).toEqual(false);
    expect(Game.calculateWinner(1, 1)).toEqual(0);
    expect(Game.calculateWinner(1, 3)).toEqual(1);
    expect(Game.calculateWinner(2, 3)).toEqual(2);
    expect(Game.calculateWinner(3, 2)).toEqual(1);
    expect(Game.calculateWinner(2, 1)).toEqual(1);
    expect(Game.calculateWinner(1, 2)).toEqual(2);
  });


  it("findOpponent", function() {
    spyOn(Game, "getUser").and.returnValue("user1");
    var output = Game.findOpponent();
    expect(output).not.toBeNull();
    expect(false).toEqual(false);



    Game.getUser.and.returnValue("user2");
    var output2 = Game.findOpponent();
    expect(output).toEqual(output2);

    var match = Matches.findOne({_id: output});
    expect(typeof(match)).toEqual('object');
    expect(match.user1_id).toEqual("user1");
    expect(match.user2_id).toEqual("user2");
    expect(match.found).toEqual(true);
    expect(match.started_at).not.toBeNull();


    Game.getUser.and.returnValue("user2");
    var output = Game.makeChoice(match._id, 2);
    Game.getUser.and.returnValue("user1");
    var output = Game.makeChoice(match._id, 2);

    var match = Matches.findOne({_id: match._id});
    expect(typeof(match)).toEqual('object');
    expect(match.user1_choice).toEqual(2);
    expect(match.user2_choice).toEqual(2);
    expect(match.winner).toEqual(null);
  });


  it("testWinner", function() {
    spyOn(Game, "getUser").and.returnValue("user1");
    var output = Game.findOpponent();
    Game.getUser.and.returnValue("user2");
    var output2 = Game.findOpponent();
    Game.getUser.and.returnValue("user1");
    Game.makeChoice(output, 1);
    Game.getUser.and.returnValue("user2");
    Game.makeChoice(output, 3);

    var match = Matches.findOne({_id: output});
    expect(match.user1_choice).toEqual(1);
    expect(match.user2_choice).toEqual(3);
    expect(match.winner).toEqual("user1");
  });
});
