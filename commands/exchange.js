const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Finance, symbols } = require("google-finance-quote");

module.exports = {
  name: 'exchange',
  description: '為替レートを取得します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('from')
        .setDescription('通貨コードを入力してください')
    )
    .addStringOption(
      option =>
      option
        .setName('to')
        .setDescription('通貨コードを入力してください')
    )
    .addNumberOption(
      option =>
      option
        .setName('amount')
        .setDescription('金額を入力してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["exchange"] ?? true;
    
    await int.reply({
      content: 'Loading...',
      ephemeral
    });
    
    const param = {
      from: options?.getString('from'),
      to: options?.getString('to')
    };
    
    const symbolsEmbed = new MessageEmbed()
      .setTitle('通貨コード一覧')
      .setDescription(symbols.join(' , '))
      .setColor(config.color);
    if (!param.from || !param.to) return await int.editReply({
      content: null,
      embeds: [symbolsEmbed],
      ephemeral: true
    });
    try {
      const finance = new Finance(param);
      const result = await finance.quote(options?.getNumber('amount') || 1);
      if (result.success) {
        const p = finance.getParam();
        const embed = new MessageEmbed()
          .setTitle(`${p.from} --> ${p.to}`)
          .setDescription(`${result.rate?.toFixed(5)}`)
          .setColor(config.color);
        await int.editReply({
          content: null,
          embeds: [embed],
          ephemeral
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};