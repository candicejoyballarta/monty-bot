const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
	guildId: String,
	guildName: String,
	guildIcon: String,
});

module.exports = model('Guild', guildSchema);
