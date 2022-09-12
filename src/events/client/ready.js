module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		setInterval(client.pickPresence, 10 * 1000);
		console.log(`Client ready!! ${client.user.tag} is now online!`);
	},
};
