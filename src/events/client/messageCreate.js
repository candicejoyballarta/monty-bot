const Sticky = require('../../schemas/sticky');
const mongoose = require('mongoose');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		let count = 0;
		const maxMsg = 1;
		let lastStickMsg = '';
		const channelId = message.channelId;
		const guildId = message.guildId;

		// check if message channel has sticky
		const stickyMsg = await Sticky.findOne({
			channelId: channelId,
		});

		if (stickyMsg) {
			let stickContent = stickyMsg.stickyContent;
			count++;
			if (count === maxMsg) {
				if (!message.content.toLowerCase().startsWith('?unstick')) {
					lastStickMsg = await message.channel.messages.fetch(
						stickyMsg.lastMsgId
					);
					await lastStickMsg.delete();
					lastStickMsg = await message.channel.send(stickContent);
					const updateSticky = await Sticky.findOneAndUpdate(
						{ channelId: channelId },
						{ lastMsgId: lastStickMsg.id },
						{
							new: true,
							runValidators: true,
						}
					);
					count = 0;
				}
			}
		}

		if (message.content.toLowerCase().startsWith('?unstick')) {
			// fetch sticked message and delete
			const msgUnstick = await message.channel.messages.fetch(
				stickyMsg.lastMsgId
			);
			await msgUnstick.delete();
			// delete the doc in database
			await stickyMsg.remove();
			await message.delete();
		}

		// Stick
		if (message.content.toLowerCase().startsWith('?stick')) {
			// Check if admin
			if (
				!message.member.permissions.has(
					PermissionsBitField.Flags.KickMembers
				)
			)
				return message.reply({
					content: '🚨 Only admins/staff can use this command!',
					ephemeral: true,
				});

			// Get sticky content
			let contentToStick = message.content.split(' ').slice(1).join(' ');
			if (!contentToStick)
				return message
					.reply({
						content: '⚠ Must provide a message to stick!',
						ephemeral: true,
					})
					.then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 5000);
					});

			try {
				lastStickMsg = await message.channel.send(contentToStick);
				const stickyContent = await Sticky.create({
					guildId: guildId,
					channelId: channelId,
					stickyContent: contentToStick,
					lastMsgId: lastStickMsg.id,
				});
				count = 0;
				await message.delete();
			} catch (error) {
				console.error(error);
				message.channel.send('Oops. An error occured!');
			}
		}
	},
};
