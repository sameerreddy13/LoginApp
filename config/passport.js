var LocalStrategy = require('passport-local').Strategy;
var User = require('../user_model');
var validator = require('validator');
User.remove({});
module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Used for local sign up
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		}, 
		function(request, email, password, done) {

			// If user exists tell user the email is already registered. 
			// If email entered is not a valid email do not allow. Otherwise authenticate and save user info.
			User.findOne({'local.email' : email}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!validator.isEmail(email)) {
					request.flash('loginmsg', 'Not a valid email address');
					return done(null, false);
				} 
				if (user) {
					request.flash('signupmsg', 'Email already registered');
					return done(null, false);
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
	}));

	// Used for local log in
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, function(request, email, password, done) {
		
		// If user does not exist or password is wrong do not authenticate and tell user what is wrong.
		// Otherwise authenticate user.
		User.findOne({'local.email': email}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user || !user.validPassword(password)) {
				if (!user) {
					request.flash('loginmsg', 'Invalid email');
				} else {
					request.flash('loginmsg', 'Wrong password');
				}
				return done(null, false);
			}
			return done(null, user);
		});
	}));
};