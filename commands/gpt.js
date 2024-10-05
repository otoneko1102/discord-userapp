const { SlashCommandBuilder } = require("@discordjs/builders");
const ai = require('unlimited-ai');

module.exports = {
  name: 'gpt',
  description: 'AIと会話します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('text')
        .setDescription('テキストを入力してください')
        .setRequired(true)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["gpt"] ?? true;
    
    try {
      await int.reply({
        content: 'Loading...',
        ephemeral
      });

      const messages = [
        { role: 'user', content: options.getString('text') }
      ];
      
      ai.generate('gpt-4-turbo-2024-04-09', messages)
        .catch(err => console.error(err))
        .then(text => {
        int.editReply({
          content: text
        });
      });
    } catch (e) {
      console.error(e);
    }
  },
};