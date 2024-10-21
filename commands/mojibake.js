const { SlashCommandBuilder } = require("@discordjs/builders");
const Mojibake = require("convjp");
const mojibake = new Mojibake();

module.exports = {
  name: 'mojibake',
  description: 'テキストを文字化けさせます',
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
    const ephemeral = settings?.isEphemeral["mojibake"] ?? true;
    
    const decode = options?.getBoolean('decode');
    try {
      await int.reply({
        content: decode ? mojibake.decode(options.getString('text')) : mojibake.encode(options.getString('text')),
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  },
};