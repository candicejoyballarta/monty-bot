const { ActivityType } = require('discord.js');
module.exports = (client) => {
	client.pickPresence = async () => {
		const options = [
			{
				type: ActivityType.Watching,
				text: 'over SHABUHAN',
				status: 'online',
			},
			{
				type: ActivityType.Listening,
				text: 'Khel sing',
				status: 'idle',
			},
			{
				type: ActivityType.Playing,
				text: 'with Tiago',
				status: 'dnd',
			},
			{
				type: ActivityType.Competing,
				text: 'with Eclipse',
				status: 'dnd',
			},
		];

		const option = Math.floor(Math.random() * options.length);

		client.user.setPresence({
			activities: [
				{
					name: options[option].text,
					type: options[option].type,
				},
			],
			status: options[option].status,
		});
	};
};
