const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	PermissionsBitField,
} = require('discord.js');
const Guild = require('../../schemas/guild');
const Nickname = require('../../schemas/nickname');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription('Configure user nickname or server nickname channel')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('config')
				.setDescription(
					'Set channel where nickname requests will be posted'
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setRequired(true)
						.setDescription('Channel to request on')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('request')
				.setDescription('Request for a nickname')
				.addStringOption((option) =>
					option
						.setName('nickname')
						.setDescription('Enter new nickname')
						.setRequired(true)
				)
		),
	async execute(interaction, client) {
		switch (interaction.options.getSubcommand()) {
			case 'config':
				if (
					!interaction.member.permissions.has(
						PermissionsBitField.Flags.KickMembers
					)
				)
					return interaction.reply({
						content: '🚨 Only admins/staff can use this button',
						ephemeral: true,
					});

				const channel = interaction.options.getChannel('channel');
				let guildProfile = await Guild.findOne({
					guildId: interaction.guild.id,
				});
				if (!guildProfile) {
					guildProfile = await new Guild({
						guildId: interaction.guild.id,
						guildName: interaction.guild.name,
						guildIcon: interaction.guild.iconURL()
							? interaction.guild.iconURL()
							: 'None',
						guildNickChannel: channel.id,
					});

					await guildProfile.save().catch(console.error);
					await interaction.reply({
						content: `Successfully configured nickname channel request in ${channel}`,
					});
				} else {
					try {
						guildProfile = await Guild.findOneAndUpdate(
							{
								guildId: interaction.guild.id,
							},
							{ guildNickChannel: channel.id },
							{
								new: true,
								runValidators: true,
							}
						);
					} catch (error) {
						console.error(error);
					}

					await interaction.reply({
						content: `Successfully updated nickname channel request in ${channel}`,
					});
				}

				break;

			case 'request':
				const user = interaction.guild.members.cache.get(
					interaction.member.user.id
				);
				const nickname = interaction.options.getString('nickname');
				const guildConf = await Guild.findOne({
					guildId: interaction.guild.id,
				});
				const reqChannel = guildConf.guildNickChannel;
				// Embed for Request (Admin)
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
				// Buttons
				const acceptButton = new ButtonBuilder()
					.setCustomId('acceptNick')
					.setLabel('✅ Accept')
					.setStyle(ButtonStyle.Success);

				const rejectButton = new ButtonBuilder()
					.setCustomId('rejectNick')
					.setLabel('❌ Reject')
					.setStyle(ButtonStyle.Danger);

				// embed for reply (user)
				const embedReply = new EmbedBuilder()
					.setTitle(`Nickname Request`)
					.setDescription(
						`${user}, your nickname change request has been sent!`
					)
					.setColor(0x0099ff)
					.setTimestamp()
					.setFooter({
						text: `${interaction.guild?.name}`,
					});

				try {
					const mes = await interaction.reply({
						embeds: [embedReply],
						fetchReply: true,
					});

					const mesAdmin = await client.channels.cache
						.get(reqChannel)
						.send({
							embeds: [embed],
							components: [
								new ActionRowBuilder().addComponents(
									acceptButton,
									rejectButton
								),
							],
						});

					const request = await new Nickname({
						guildId: interaction.guild.id,
						requestor: interaction.member.id,
						nickRequest: nickname,
						mesRequest: mes.id,
						mesAdmin: mesAdmin.id,
					});

					await request.save().catch(console.error);
				} catch (error) {
					console.error(error);
				}

				break;

			default:
				break;
		}
	},
};
