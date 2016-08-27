//REQUIREMENTS
var mongoose = require('mongoose');

//CREATE SCHEMA
var Schema = mongoose.Schema;

//CREATE UserSchema with Schema class
var UserSchema = new Schema({
	name: {
		type: String;
		unique: true
	},
	notes: [{
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}]
});

//CREATE User Model with UserSchema
var User = mongoose.model('User', UserSchema);

//EXPORTS
module.exports = User;