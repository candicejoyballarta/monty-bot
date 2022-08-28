module.exports = {
	data: {
		name: 'acceptNick',
	},
	async execute(interaction, client) {
		await interaction.reply({
			content: `Nickname request has been accepted.`,
		});
	},
};
