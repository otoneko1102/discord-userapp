const { Client, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const displus = require('displus');
const fs = require('fs-extra');
const translate = require('@iamtraction/google-translate');

module.exports = {
  name: "language",
  description: '翻訳先の言語を設定します',
  setEphemeral: false,
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('received')
        .setDescription('受け取るメッセージの翻訳先の言語を指定してください')
    )
    .addStringOption(
      option =>
      option
        .setName('your_own')
        .setDescription('送信するメッセージの翻訳先の言語を指定してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = true;
    
    try {
      if (!options.getString('received') && !options.getString('your_own')) {
        const embed = new MessageEmbed()
          .setTitle('言語一覧')
          .setDescription(Object.keys(translate.languages).filter(t => t !== 'auto' && t !== 'isSupported' && t !== 'getISOCode').map(t => `${t}: ${translate.languages[t]}`).join('\n'))
          .setColor(config.color);
        
        int.reply({
          embeds: [embed],
          ephemeral
        });
        return;
      }
      
      if (!settings.translate) settings.translate = {};
      const setReceived = options.getString('received') &&
        options.getString('received') !== 'auto' &&
        translate.languages.isSupported(options.getString('received'))
      if (setReceived) {
        settings.translate.received = options.getString('received').toLowerCase();
      }
      
      const setYour_own = options.getString('your_own') &&
        options.getString('your_own') !== 'auto' &&
        translate.languages.isSupported(options.getString('your_own'))
      if (setYour_own) {
        settings.translate.your_own = options.getString('your_own').toLowerCase();
      }
      
      fs.writeFileSync(`./settings/${int.user.id}.json`, JSON.stringify(settings, null, 2));
      const embed = new MessageEmbed()
        .setTitle('言語設定')
        .addFields([
          { name: '受け取るメッセージ', value: settings.translate.received || 'ja' },
          { name: '送信するメッセージ', value: settings.translate.your_own || 'en' }
        ])
        .setColor(config.color)
      int.reply({
        content: '設定しました',
        embeds: [embed],
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  }
}