//REQUIRE
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

//CREATE Note Model with NoteSchema
var Note = mongoose.model('Note', NoteSchema);

//EXPORT
module.exports = Note;