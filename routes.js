// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


var _ = require('lodash');


// custom library
// model
var Model = require('./model');
var Knex = require('./db');
var api = require('./routes/api');
var http = require('http');


var dataToSend = [];

var currentUser;
var hubsArray;
var loggedUser;

var items = [];
var loggedUser;

// index
var index = function(req, res, next) {
    // if(req.url != '/profile') {
    //     res.render('login');
    // }

   if(!req.isAuthenticated()) {
      res.render('index', {title: 'Index'});
   } else {
      var user = req.user;

      if(user !== undefined) {

        //   http.get('/api/hubs', function (res) {
        //       console.log('STATUS: ' + res.statusCode);
        //       console.log('HEADERS: ' + JSON.stringify(res.headers));

        //       // Buffer the body entirely for processing as a whole.
        //       var bodyChunks = [];
        //       res.on('data', function (chunk) {
        //           // You can process streamed parts here...
        //           bodyChunks.push(chunk);
        //       }).on('end', function () {
        //           var body = Buffer.concat(bodyChunks);
        //           console.log('BODY: ' + body);
        //           // ...and/or process the entire body here.
        //           next();
        //       })
        //   });

         user = user.toJSON();
         //loggedUser = user.toJSON();
         items.push(user);
         console.log(items);
         console.log(user.username);
         loggedUser = user;
         res.render('profile', {title: 'Home',items: items, user: user, hubs: hubsArray});

      }
   }
};

var showEditSensor = function(req, res, next) {
      console.log('edit sensor param:' + req.params.name)
      var sensor = req.params.name
    if(!req.isAuthenticated()) {
      res.render('index', {title: 'Index'});
   } else {
      var user = req.user;
      //var sensor = req.params.name
      if(user !== undefined) {
        user = user.toJSON();   
        res.render('editSensor', {title: 'EditSensor', sensor: sensor, user: user});
      }
   }
}


var showEditHub = function(req, res, next) {
    console.log('edit hub param:' + req.params.name)
    var hub = req.params.name
    if(!req.isAuthenticated()) {
        res.render('index', {title: 'Index'});
   } else {
       var user = req.user;
       if(user !== undefined) {
           user = user.toJSON();   
           res.render('editHub', {title: 'EditHub', hub: hub, user: user});
      }
   }
}

var showContact = function(req, res, next) {
    res.render('contact', {title: 'Contact'})
};
var showAbout = function(req, res, next) {
    res.render('about', {title: 'About'})
};
// sign in
// GET

var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/profile');
   res.render('login', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/profile',
                          failureRedirect: '/'}, function(err, user, info) {
      if(err) {
         return res.render('login', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('login', {title: 'Sign In', errorMessage: info.message});
      }
      
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('login', {title: 'Sign In', errorMessage: err.message});
         } else {
            new Model.User({username: user.username})
            .fetch()
            .then(function(model) {
                return res.redirect('/profile');
            });

         }
      });
   })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
   if(req.isAuthenticated()) {
      res.redirect('/profile');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};

// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;

   var newUser = null;
   newUser = new Model.User({username: user.username}).fetch();

   return newUser.then(function(model) {
      if(model) {
         res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      } else {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = bcrypt.hashSync(password);

         var signUpUser = new Model.User({username: user.username, password: hash});

         signUpUser.save().then(function(model) {
            // sign in the newly registered user
            signInPost(req, res, next);
         });	
      }
   });
};

// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      // res.redirect('/');
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/');
   }
};

// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};


// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET

module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

module.exports.loggedUser = loggedUser;

// 404 not found
module.exports.notFound404 = notFound404;

module.exports.currentUser = currentUser;

module.exports.showAbout = showAbout;

module.exports.showContact = showContact;

module.exports.showEditSensor = showEditSensor;

module.exports.showEditHub = showEditHub;

module.exports.showEditSensor = showEditSensor;


module.exports.showEditSensor = showEditSensor;

module.exports.showEditHub = showEditHub;

module.exports.showEditSensor = showEditSensor;
