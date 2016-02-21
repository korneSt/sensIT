var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


var Model = require('./model');
var Knex = require('./db');
var http = require('http');

var dataToSend = [];

var currentUser;
var hubsArray;
var loggedUser;

var items = [];
var loggedUser;

// index
var index = function(req, res, next) {

   if(!req.isAuthenticated()) {
      res.render('index', {title: 'sensIT'});
   } else {
      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
         console.log(user.username);
         loggedUser = user;
         
         res.render('profile', {title: 'Home', user: user});
      }
   }
};


var showContact = function(req, res, next) {
    res.render('contact', {title: 'Contact'})
};
var showAbout = function(req, res, next) {
    res.render('about', {title: 'About'})
};

// sign in GET
var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/profile');
   res.render('login', {title: 'Sign In'});
};

// sign in POST
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

// sign up GET
var signUp = function(req, res, next) {
   if(req.isAuthenticated()) {
      res.redirect('/profile');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};

// sign up POST
var signUpPost = function(req, res, next) {
   var user = req.body;

   var newUser = null;
   newUser = new Model.User({username: user.username}).fetch();

   return newUser.then(function(model) {
      if(model) {
         res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      } else {
         var password = user.password;
         var hash = bcrypt.hashSync(password);
         
         var signUpUser = new Model.User({username: user.username, password: hash});

         signUpUser.save().then(function(model) {
            signInPost(req, res, next);
         });	
      }
   });
};

// sign out GET
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
      //notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/');
   }
};

module.exports = {
    index: index,
    signIn: signIn,
    signInPost: signInPost,
    signUp: signUp,
    signUpPost: signUpPost,
    signOut: signOut,
    loggedUser: loggedUser,
    currentUser: currentUser,
    showAbout: showAbout,
    showContact: showContact
}
