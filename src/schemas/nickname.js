const { Schema, model } = require('mongoose');

const nicknameSchema = new Schema({
	guildId: String,
	requestor: String,
	nickRequest: String,
	mesRequest: String,
	mesAdmin: String,
});

module.exports = model('Nickname', nicknameSchema);
