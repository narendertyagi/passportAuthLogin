var express = require('express');
var router = express.Router()
var path = require('path');
var bodyParser = require('body-parser');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// add session
var session = require('express-session');



var app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
  secret: 'nodejs-passport-facebook-example',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));


// passport setting
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: '288544215325355',
    clientSecret: '1b9f84382c9016680024ce0aec9e2bcc',
    callbackURL: "http://localhost:5001/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


passport.use(new GoogleStrategy({
  clientID: '198205373984-a381so4nvbtk744uv8gkbcopdcnp9jgi.apps.googleusercontent.com',
  clientSecret: 'UZsIaU705_EsdJ_3otkf3nFQ',
  callbackURL: "http://localhost:5001/auth/google/callback"
},
function(req, token, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's Facebook profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Facebook account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));


app.get('/', function(req,res){
  res.render('index', { title: 'nodejs-passport-facebook-google-authentication' });
})


app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

  app.get('/auth/google',
  passport.authenticate('google', {scope:'https://www.googleapis.com/auth/userinfo.profile'}),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

  app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/accountFacebook');
  });

  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/accountGoogle');
  });



app.get('/accountFacebook', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.render('account', { user: req.user, whichAccount: 'Facebook' });
});

app.get('/accountGoogle', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.render('account', { user: req.user, whichAccount: 'Google' });
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 5001, (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(`Express Server is now running on localhost:${process.env.PORT || 5001}`)
})


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

