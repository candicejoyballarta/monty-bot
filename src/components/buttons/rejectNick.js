const Nickname = require('../../schemas/nickname');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: {
		name: 'rejectNick',
	},
	async execute(interaction, client) {
		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Flags.KickMembers
			)
		)
			return interaction.reply({
				content: '🚨 Only admins/staff can use this button',
				ephemeral: true,
			});

		const { guildId, message, user } = interaction;

		const mes = await Nickname.findOne({
			guildId: guildId,
			mesAdmin: message.id,
		});

		if (!mes) {
			console.error('No data found in the database!');
		}

		const adminReply = new EmbedBuilder()
			.setTitle(`Accepted`)
			.setDescription('Nickname request has been accepted.')
			.setThumbnail(user.displayAvatarURL())
			.addFields([
				{
					name: 'Requestor',
					value: `${requestor}`,
					inline: true,
				},
			])
			.addFields([
				{
					name: 'Approved by',
					value: `${user}`,
					inline: true,
				},
			])
			.setColor(0x2e8b57)
			.setTimestamp()
			.setFooter({
				text: `${interaction.guild?.name}`,
			});

		message.edit({ embeds: [adminReply], components: [] });
		setTimeout(() => message.delete(), 5000);
	},
};
