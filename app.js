var express = require('express');
var path = require('path'); 
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var routes = require('./routes');

var LocalStrategy = require('passport-local').Strategy;
var Model = require('./model');

var app = express();
var api = require('./api');

//PASSPORT - konfiguracja autentykacji
passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Nieprawidłowy login lub hasło'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Nieprawidłowy login lub hasło'});
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

// ustawia jade jako domyślny szablon HTML
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json()); //zwraca informacje z formularzy HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //czyta cookies

//wymagane przez passport
app.use(session({
    secret: 'cookie_secretsensitsensitsensit',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // użyj connect-flash do przesyłania wiadomości podczas sesji
app.use(express.static(path.join(__dirname, 'public')));

//expose session details to the templates (change the content when logged in)
app.get('*', function(req, res, next) {
  // just use boolean for loggedIn
  res.locals.loggedIn = (req.user) ? true : false;
  next();
});

// GET
app.get('/', routes.index);
app.get('/profile', routes.index);
app.get('/about', routes.showAbout);
app.get('/contact', routes.showContact);
app.get('/login', routes.signIn);
app.get('/signup', routes.signUp);


// POST
app.post('/login', routes.signInPost);
app.post('/signup', routes.signUpPost);


//-----------------API---------------------//

//wykorzysuje adres nie id
app.get('/api/sensorsAddress/:id', api.sensorsAddress);
//wykorzysuje adres nie id
app.post('/api/measureAddress', api.addMeasureAddress);

// GET API - sprawdza czy zalogowany aby mieć dostęp do API
app.use(function (req, res, next) {
    console.log('sprawdzam logowanie');
    if(!req.isAuthenticated()) {
    res.redirect('/login');
    }
    next();
});

app.get('/api/hubs', api.hubs);
app.get('/api/sensors', api.sensors);
app.get('/api/measures', api.measures);

app.get('/api/hubsUser/:id', api.hubsUser);
app.get('/api/sensorsHub/:id', api.sensorsHub);
app.get('/api/sensorsUser/:id', api.sensorsUser);
app.get('/api/measuresSensor/:id', api.measuresSensor);



app.get('/api/hub/:id', api.hub);
app.get('/api/sensor/:id', api.sensor);
app.get('/api/measure/:id', api.measure);
app.get('/api/addMeasure/:id', api.addMeasureReal);

//POST
app.post('/api/hub', api.addHub);
app.post('/api/sensor', api.addSensor);
app.post('/api/measure', api.addMeasure);


//PUT
app.put('/api/hub', api.editHub);
app.put('/api/sensor', api.editSensor);

//DELETE API
app.delete('/api/sensor/:id', api.deleteSensor);
//id to numer sensora (potrzebne przy usuwaniu sensorow ktore maja pomiary)
app.delete('/api/measure/:id', api.deleteMeasure);
app.delete('/api/hub/:id', api.deleteHub);


// logout
// GET
app.get('/signout', routes.signOut);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Nie ma takiej strony! ');
    err.status = 404;
    next(err);
});


// obsługa błędów

// obsługa błędów na etapie produkcji
// zwróci kody błędów
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// obsługa błędów na etapie użytkowania
// nie zwraca błędów
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
