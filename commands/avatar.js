const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'avatar',
  description: 'アバターを表示します',
  data: new SlashCommandBuilder()
    .addUserOption(
      option =>
      option
        .setName('user')
        .setDescription('ユーザーを選択してください')
    ),
  async execute(client, int, options, config, settings) {
    try {
      const ephemeral = settings?.isEphemeral["avatar"] ?? true;
      
      const userId = options.getUser('user')?.id || int.user.id;
      let user;
      try {
        user = await client.users?.fetch(userId);
      } catch {}
      if (user) {
        let tag;
        if (
          user?.username &&
          user?.discriminator
        ) {
          tag = user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`
        }
        const avatar = user.displayAvatarURL({ size: 4096, dynamic: true, format: 'png' });
        const embed = new MessageEmbed()
          .setTitle(tag)
          .setImage(avatar)
          .setColor(config.color);
        await int.reply({
          embeds: [embed],
          ephemeral
        });
      } else {
        await int.reply({
          content: 'ユーザーが見つかりませんでした',
          ephemeral
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};