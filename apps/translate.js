const { Client, MessageEmbed } = require('discord.js');
const displus = require('displus');
const translate = require('@iamtraction/google-translate');

module.exports = {
  name: "Translate",
  type: "Message",
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["Translate"] ?? true;
    
    const message = options.getMessage('message');
    if (!message.content) return int.reply({
      content: 'メッセージ内容がありません',
      ephemeral: true
    });
    
    try {
      int.reply({
        content: 'Loading...',
        ephemeral
      });
      
      const text = displus.removeMarkdown(message.content);
      const to =  settings?.translate?.received || 'ja';
      translate(text, { to }).then(res => {
        const embed = new MessageEmbed()
          .setFooter({ text: `${res.from.language.iso} --> ${to}` })
          .setColor(config.color);
        int.editReply({
          content: res.text,
          embeds: [embed]
        });
      }).catch(e => {
        console.error(e);
      })
    } catch (e) {
      console.error(e);
    }
  }
}