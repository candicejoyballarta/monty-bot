const { EmbedBuilder, GuildMember } = require('discord.js');

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		const { user, guild } = member;
		const welcomeChannel =
			member.guild.channels.cache.get('904363818845614095');
		const requestChannel =
			member.guild.channels.cache.get('943558047547142194');
		const roleChannel =
			member.guild.channels.cache.get('904367778650259486');

		const embed = new EmbedBuilder()
			.setTitle(`Welcome to LORNA ANG SHABUHAN!!`)
			.setDescription(`Check out these channels..`)
			.addFields([
				{
					name: ' - Request Nickname',
					value: `${requestChannel}`,
					inline: true,
				},
			])
			.addFields([
				{
					name: ' - Get Roles',
					value: `${roleChannel}`,
					inline: true,
				},
			])
			.setThumbnail(user.displayAvatarURL())
			.setImage('https://imgur.com/Iz1t6oM.gif')
			.setColor(0xffb400)
			.setTimestamp()
			.setFooter({
				text: `${guild?.name}`,
				iconURL: `https://imgur.com/dCcu6DC.png`,
			});

		welcomeChannel.send({
			embeds: [embed],
			content: `${user}, Don't be shy to say hi!`,
		});
	},
};
