const { Schema, model } = require('mongoose');

const stickySchema = new Schema({
	guildId: String,
	channelId: String,
	stickyContent: String,
	lastMsgId: String,
});

module.exports = model('Sticky', stickySchema);
