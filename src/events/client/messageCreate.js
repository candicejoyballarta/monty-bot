const Sticky = require('../../schemas/sticky');
const mongoose = require('mongoose');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		const maxMsg = 1;
		let lastStickMsg = null;
		const channelId = message.channelId;
		const guildId = message.guildId;

		// check if channel has sticky
		let stickyMsg = await Sticky.findOne({
			channelId: channelId,
		});

		// if channel has sticky post message
		if (
			stickyMsg &&
			(!message.content.toLowerCase().startsWith('?unstick') ||
				!message.content.toLowerCase().startsWith('?stick'))
		) {
			let stickContent = stickyMsg.stickyContent;
			// check if the message id is not equal to the sticky in db
			if (message.id !== stickyMsg.lastMsgId) {
				// if not equal, then add to counter

				let updateSticky = await Sticky.findOneAndUpdate(
					{ channelId: channelId },
					{ $inc: { msgCount: +1 } },
					{
						new: true,
						runValidators: true,
					}
				);
			}

			stickyMsg = await Sticky.findOne({
				channelId: channelId,
			});

			// if the count for max msg is reached
			if (stickyMsg.msgCount >= maxMsg) {
				// if msg does not start witth unstick
				if (
					!message.content.toLowerCase().startsWith('?unstick') ||
					!message.content.toLowerCase().startsWith('?stick')
				) {
					// fetch the last sticky and delete
					lastStickMsg = await message.channel.messages
						.fetch(stickyMsg.lastMsgId)
						.then(async (msg) => {
							await msg.delete();
						})
						.catch((e) => {
							console.error(e);
						});

					// send a new sticky msg
					lastStickMsg = await message.channel.send(stickContent);
					// update the sticky in the database
					let updateSticky = await Sticky.findOneAndUpdate(
						{ channelId: channelId },
						{ lastMsgId: lastStickMsg.id, msgCount: 0 },
						{
							new: true,
							runValidators: true,
						}
					);
				}
			}
		}

		if (message.content.toLowerCase().startsWith('?unstick')) {
			stickyMsg = await Sticky.findOne({
				channelId: channelId,
			});

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
				const stickExist = await Sticky.findOne({
					channelId: channelId,
				});

				if (stickExist) {
					const msgUnstick = await message.channel.messages.fetch(
						stickExist.lastMsgId
					);
					await msgUnstick.delete();
					await stickExist.remove();
				}

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
