const { Schema, model } = require('mongoose');

const stickySchema = new Schema({
	guildId: String,
	channelId: String,
	stickyContent: String,
	lastMsgId: String,
	msgCount: {
		type: Number,
		default: 0,
	},
});

module.exports = model('Sticky', stickySchema);
