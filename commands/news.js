const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const yahooNews = require('latest-yahoo-news');

const choices = [
  { name: '主要', value: 'top' },
  { name: '国内', value: 'domestic' },
  { name: '国際', value: 'world' },
  { name: '経済', value: 'business' },
  { name: 'エンタメ', value: 'entertainment' },
  { name: 'スポーツ', value: 'sports' },
  { name: 'IT', value: 'it' },
  { name: '科学', value: 'science' },
  { name: '地域', value: 'local' },
];

module.exports = {
  name: 'news',
  description: 'ニュースを表示します',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('category')
        .setDescription('カテゴリーを選択してください')
        .addChoices(choices)
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["news"] ?? true;
    
    await int.reply({
      content: 'Loading...',
      ephemeral
    });
    try {
      const category = options.getString('category') || 'top';
      const news = (await yahooNews(category)).news;
      const result = news[Math.floor(Math.random() * news.length)];
      const embed = new MessageEmbed()
        .setTitle(result.title)
        .setURL(result.link)
        .setDescription(result?.description)
        .setImage(result?.image)
        .setFooter({ text: category })
        .setColor(config.color);

      await int.editReply({
        content: null,
        embeds: [embed]
      });
    } catch (e) {
      console.error(e);
    }
  }
}