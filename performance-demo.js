N_DATA = 1000;
DATA_LENGTH = 500;
UPDATE_FREQUENCY = 300;

Data = new Meteor.Collection('data');

if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('allData', Session.get('part'));
  })
}

if (Meteor.isServer) {
  if (Data.find().count() === 0) {
    var contents = '';
    for (var j = 0; j < DATA_LENGTH; j++)
      contents = contents + 'x';

    console.log('creating fixtures');
    for (var i = 0; i < N_DATA; i++) {
      var contents = [];
      for (var j = 0; j < DATA_LENGTH; j++)
        contents.push(Random.id());
        
      Data.insert({
        contents: contents,
        index: i,
        part: i % 10
      });
    }
    console.log('finished creating fixtures');
  }
  
  Meteor.publish('allData', function(part) {
    if (part) {
      return Data.find({part: part});
    }
  });
  
  Meteor.setInterval(function() {
    var index = Math.floor(Math.random() * DATA_LENGTH);
    console.log(index);
    Data.update({index: index}, {$push: {contents: Random.id()}})
  }, UPDATE_FREQUENCY);
}
