var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var url = require('./config/database').url;

// connect to database by url in database file
var connection = mongoose.createConnection(url);

// schema for users in database
var userSchema = new mongoose.Schema({
	local : {
		email: String,
		password: String
	},

	facebook : {
		id : String,
		token : String,
		email : String,
		name : String
	}
});

// generate hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = connection.model('User', userSchema);