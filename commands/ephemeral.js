const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs-extra');

module.exports = {
  name: 'ephemeral',
  description: 'コマンドの表示形式を設定します',
  setEphemeral: false,
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('command')
        .setDescription('コマンドを指定してください')
        .setRequired(true)
    )
    .addBooleanOption(
      option =>
      option
        .setName('set_ephemeral')
        .setDescription('非表示にするかを指定してください')
        .setRequired(true)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = true;
    
    try {
      const commandName = options.getString('command').replace(/ +/g, '-');
      const set_ephemeral = options.getBoolean('set_ephemeral');
      
      const cmds = client.commands.filter(cmd => cmd.setEphemeral !== false);
      const apps = client.apps.filter(cmd => cmd.setEphemeral !== false);
      const commands = cmds.concat(apps);    
      const map = Array.from(commands.values()).map(c => c.name.replace(/ +/g, '-'));
      
      if (!map.includes(commandName)) return int.reply({
        content: 'そのコマンドは設定できない、もしくは存在しません',
        ephemeral
      });
      
      if (!settings.isEphemeral) settings.isEphemeral = {};
      settings.isEphemeral[commandName] = set_ephemeral;
      
      fs.writeFileSync(`./settings/${int.user.id}.json`, JSON.stringify(settings, null, 2));
      const embed = new MessageEmbed()
        .setTitle('表示設定')
        .setDescription(`${commandName}: ${settings.isEphemeral[commandName] ? '非表示' : '表示'}`)
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
};
