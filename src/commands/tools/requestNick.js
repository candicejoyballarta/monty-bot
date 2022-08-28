const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Embed,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription('Request for a new nickname')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Select a user')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('input')
				.setDescription('Enter new nickname')
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setRequired(true)
				.setDescription('Channel to request on')
		),
	async execute(interaction, client) {
		const user = interaction.options.getUser('target');
		const nickname = interaction.options.getString('input');
		const channel = interaction.options.getChannel('channel');
		const embed = new EmbedBuilder()
			.setTitle(`Nickname Request`)
			.addFields([
				{
					name: 'Requestor',
					value: `${user}`,
					inline: true,
				},
			])
			.addFields([
				{
					name: 'Nickname',
					value: nickname,
					inline: true,
				},
			])
			.setThumbnail(user.displayAvatarURL())
			.setColor(0x0099ff)
			.setTimestamp()
			.setFooter({
				text: `${interaction.guild?.name}`,
			});

		const acceptButton = new ButtonBuilder()
			.setCustomId('acceptNick')
			.setLabel('✅ Accept')
			.setStyle(ButtonStyle.Success);

		const rejectButton = new ButtonBuilder()
			.setCustomId('rejectNick')
			.setLabel('❌ Reject')
			.setStyle(ButtonStyle.Danger);

		channel.send({
			embeds: [embed],
			components: [
				new ActionRowBuilder().addComponents(
					acceptButton,
					rejectButton
				),
			],
		});

		const embedReply = new EmbedBuilder()
			.setTitle(`Nickname Request`)
			.setDescription('Nickname change request has been sent!')
			.setColor(0x0099ff)
			.setTimestamp()
			.setFooter({
				text: `${interaction.guild?.name}`,
			});

		await interaction.reply({
			embeds: [embedReply],
		});
	},
};
