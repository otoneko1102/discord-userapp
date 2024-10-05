const { SlashCommandBuilder } = require("@discordjs/builders");
const { generate } = require("cjp");

module.exports = {
  name: 'suspicious',
  description: 'テキストを怪しい日本語に変換します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('text')
        .setDescription('テキストを入力してください')
        .setRequired(true)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["suspicious"] ?? true;
    
    try {
      await int.reply({
        content: generate(options.getString('text')),
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  },
};