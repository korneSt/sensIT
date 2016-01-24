var DB = require('./db').DB;

var User = DB.Model.extend({
   tableName: 'users',
   idAttribute: 'userId',
   hubs: function() {
       return this.hasMany(Hub);
  }
});

var Hub = DB.Model.extend({
   tableName: 'hubs',
   user: function() {
       return this.belongsTo(User);
  }
});

var Sensor = DB.Model.extend({
   tableName: 'sensors'
});

var Measure = DB.Model.extend({
   tableName: 'data'
});


//KOLEKCJE
var Users = DB.Collection.extend({
  model: User
});

var Hubs = DB.Collection.extend({
  model: Hub
});

var Sensors = DB.Collection.extend({
  model: Sensor
});

var Measures = DB.Collection.extend({
  model: Measure
});

module.exports = {
   User: User,
   Hub: Hub,
   Sensor: Sensor,
   Measure: Measure,
   Users: Users,
   Hubs: Hubs,
   Sensors: Sensors,
   Measures: Measures
};
