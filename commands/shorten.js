const { SlashCommandBuilder } = require("@discordjs/builders");
const isgd = require('isgd-api');

module.exports = {
  name: 'shorten',
  description: 'URLを短縮します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('url')
        .setDescription('URLを入力してください')
        .setRequired(true)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["shorten"] ?? true;
    
    try {
      await int.reply({
        content: 'Loading...',
        ephemeral
      });
    
      const link = await isgd.shorten(options.getString('url'));
      
      await int.editReply({
        content: link
      });
    } catch (e) {
      console.error(e);
    }
  }
}