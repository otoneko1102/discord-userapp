const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: 'help',
  description: 'ヘルプを表示します',
  setEphemeral: false,
  data: new SlashCommandBuilder(),
  async execute(client, int, options, config, settings) {
    const ephemeral = true;
    
    try {
      const prefix = '/';    
      const commands = client.commands.filter(cmd => cmd?.showHelp !== false);
      
      const description = Array.from(commands.values())
        .map(cmd => `\`${prefix}${cmd.name}\` ${cmd.description ?? 'No description.'}`)
        .join('\n');
      
      const embed = new MessageEmbed()
        .setTitle(`Help (${commands.size} commands)`)
        .setDescription(description)
        .setFooter({ text: `prefix => ${prefix}` })
        .setColor(config.color);

      await int.reply({
        embeds: [embed],
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  }
};
