module.exports = function(app, passport) {
	// profile page
	app.get('/profile', isLoggedIn, function(request, response) {
		response.render('profile.ejs', {user: request.user});
	});

	// logout page: logout and redirect to home page
	app.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/');
	});

	//render home page
	app.get('/', function(request, response) {
		response.render('index.ejs');
	});

// LOGIN/SIGNUP 
  // local:
	
	// login page
	app.get('/login', function(request, response) {
		response.render('login.ejs', {message: request.flash('loginmsg')});
	});

	// signup page
	app.get('/signup', function(request, response) {
		response.render('signup.ejs', {message: request.flash('signupmsg')});
	});
	
	// redirect to profile on successful signup; stay on signup page and flash message if unsuccessful
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash: true
	}));

	// redirect to profile on successful login; stay on login page and flash message if unsuccessful
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

  // facebook:

};

//middleware to check if user is logged in
function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect('/');
}