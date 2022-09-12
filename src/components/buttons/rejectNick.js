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

		const requestor = message.guild.members.cache.get(mes.requestor);

		try {
			await mes.remove();
		} catch (error) {
			console.error(error);
		}

		const adminReply = new EmbedBuilder()
			.setTitle(`Rejected`)
			.setDescription('Nickname request has been rejected.')
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
					name: 'Rejected by',
					value: `${user}`,
					inline: true,
				},
			])
			.setColor(0xcc0000)
			.setTimestamp()
			.setFooter({
				text: `${interaction.guild?.name}`,
			});

		message.edit({ embeds: [adminReply], components: [] });
	},
};
