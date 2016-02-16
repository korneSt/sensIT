var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var configDB = require('./config/database.js');
var mysql = require('mysql');

var routes = require('./routes');

var LocalStrategy = require('passport-local').Strategy;
var Model = require('./model');

var app = express();
var api = require('./routes/api');

//require('./config/passport')(passport); // pass passport for configuration
// var connection = mysql.createConnection(configDB.url);
// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });


//PASSPORT 
passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            return done(null, user);
         }
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   new Model.User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

//app.use('/', routes);
//app.use('/users', users);
//require('./routes/routes.js')(app, passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); //get info from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //read cookies
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  //console.log('Time:', Date.now());
  next();
});



//app.locals.link = '/profile/s/';

// GET
app.get('/', routes.index);
app.get('/profile', routes.index);
app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  console.log(name);
  res.render('partials/' + name);
});

app.get('/about', routes.showAbout);
app.get('/contact', routes.showContact);

// signin
// GET
app.get('/login', routes.signIn);
// POST
app.post('/login', routes.signInPost);

// signup
// GET
app.get('/signup', routes.signUp);

//edit sensor

app.get('/profile/sensor/:name', routes.showEditSensor);

app.get('/profile/hub/:name', routes.showEditHub);

app.get('/profile/sensor/:name', routes.showEditSensor)



// POST
app.post('/signup', routes.signUpPost);

//app.post('/addhub', routes.addHub);
//app.post('/addsensor', routes.addSensor);

// GET API
// app.use(function (req, res, next) {
//     console.log('sprawdzam logowanie');
//     if(!req.isAuthenticated()) {
//     res.redirect('/login');
//     }
//     next();
// });
app.get('/api/users', api.users);
app.get('/api/hubs', api.hubs);
app.get('/api/sensors', api.sensors);
app.get('/api/measures', api.measures);

app.get('/api/hubsUser/:id', api.hubsUser);
app.get('/api/sensorsHub/:id', api.sensorsHub);
app.get('/api/sensorsUser/:id', api.sensorsUser);
app.get('/api/measuresSensor/:id', api.measuresSensor);

app.get('/api/user/:id', api.user);
app.get('/api/hub/:id', api.hub);
app.get('/api/sensor/:id', api.sensor);
app.get('/api/measure/:id', api.measure);

app.get('/api/currentUser', api.currentUser);

// POST API
app.post('/api/user', api.addUser);
app.post('/api/hub', api.addHub);
app.post('/api/sensor', api.addSensor);
app.post('/api/measure', api.addMeasure);

// PUT API
app.put('/api/hub/:id', api.editHub);
app.put('/api/sensor/:id', api.editSensor);

//DELETE API
app.delete('/api/sensor/:id', api.deleteSensor);

//app.get('/api/hub/:id', api.post);

// logout
// GET
app.get('/signout', routes.signOut);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
