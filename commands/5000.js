const { MessageAttachment } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require('node-fetch');

module.exports = {
  name: '5000',
  description: '5000兆円ジェネレーターを使用します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('top-bottom')
        .setDescription('テキストを/で区切って入力してください')
        .setRequired(true)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["5000"] ?? true;
    
    try {
      await int.reply({
        content: 'Loading...',
        ephemeral
      });
      
      const parts = options.getString('top-bottom').split('/');
      if (parts.length === 2 && parts.every(part => part.trim() !== '')) {
        const top = parts[0];
        const bottom = parts[1];
        const url = `https://gsapi.cbrx.io/image?top=${top}&bottom=${bottom}&type=png`;
        const image = await fetch(url).then(res => res.blob());
        const attachment = new MessageAttachment(image.stream(), '5000.png');
        
        await int.editReply({
          content: null,
          files: [attachment]
        });
      } else {
        await int.editReply({
          content: 'パラメーターを指定してください'
        });
      }
    } catch (e) {
      console.error(e);
      await int.editReply('エラーが発生しました');
    }
  },
};