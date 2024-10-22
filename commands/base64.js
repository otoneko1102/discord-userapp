const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: 'base64',
  description: 'テキストをBase64変換します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('text')
        .setDescription('テキストを入力してください')
        .setRequired(true)
    )
    .addBooleanOption(
      option =>
      option
        .setName('decode')
        .setDescription('モードを選択してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["base64"] ?? true;
    
    const decode = options?.getBoolean('decode');
    try {
      await int.reply({
        content: decode ? Buffer.from(options.getString('text'), 'base64').toString('utf-8') : Buffer.from(options.getString('text')).toString('base64'),
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  },
};