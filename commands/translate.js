const { Client, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const displus = require('displus');
const translate = require('@iamtraction/google-translate');

module.exports = {
  name: "translate",
  description: 'テキストを翻訳します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('text')
        .setDescription('テキストを入力してください')
        .setRequired(true)
    )
    .addStringOption(
      option =>
      option
        .setName('language')
        .setDescription('言語を指定してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["translate"] ?? true;
    
    try {
      int.reply({
        content: 'Loading...',
        ephemeral
      });
      
      const text = displus.removeMarkdown(options.getString('text'));
      let to = 'en';
      if (
        options.getString('language') &&
        translate.languages.isSupported(options.getString('language'))
      ) {
        to = options.getString('language');
      } else if (settings?.translate?.your_own) {
        to = settings.translate.your_own;
      }
      
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