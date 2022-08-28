module.exports = {
	data: {
		name: 'rejectNick',
	},
	async execute(interaction, client) {
		await interaction.reply({
			content: `Nickname request has been rejected.`,
		});
	},
};
