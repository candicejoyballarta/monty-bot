module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Client ready!! ${client.user.tag} is now online!`);
	},
};
