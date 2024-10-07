const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require('fs-extra');

module.exports = {
  name: 'omikuji',
  description: '今日の運勢を表示します',
  data: new SlashCommandBuilder(),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["omikuji"] ?? true;
    
    if (!settings.omikuji) settings.omikuji = { last: '0/0', number: -1 };
    const systemTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const formatDate = `${systemTime.getMonth() + 1}/${systemTime.getUTCDate()}`;
    
    let message = '今日はすでにおみくじを引いています';
    if (settings.omikuji.last !== formatDate) {
      message = 'おみくじを引きました！';
      settings.omikuji.last = formatDate;
      settings.omikuji.number = Math.floor(Math.random() * 7);
      fs.writeFileSync(`./settings/${int.user.id}.json`, JSON.stringify(settings, null, 2));
    }
    const embed = new MessageEmbed()
      .setTitle('今日の運勢')
      .setDescription(message)
      .setImage(`https://cdn.oto.pet/img/omikuji_${settings.omikuji.number}.png`)
      .setColor(config.color);
    try {
      int.reply({
        embeds: [embed],
        ephemeral
      })
    } catch (e) {
      console.error(e);
    }
  }
}