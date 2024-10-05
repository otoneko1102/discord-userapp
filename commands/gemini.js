const { SlashCommandBuilder } = require("@discordjs/builders");
const ai = require('unlimited-ai');

module.exports = {
  name: 'gemini',
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
    const ephemeral = settings?.isEphemeral["gemini"] ?? true;
    
    try {
      await int.reply({
        content: 'Loading...',
        ephemeral
      });

      const messages = [
        { role: 'user', content: options.getString('text') }
      ];
      
      ai.generate('gemini-1.5-pro-exp-0827', messages)
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