const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: 'ping',
  description: 'Pong!',
  data: new SlashCommandBuilder(),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["ping"] ?? true;
    
    try {
      int.reply({
        content: `${client.ws.ping} ms.`,
        ephemeral
      })
    } catch (e) {
      console.error(e);
    }
  }
}