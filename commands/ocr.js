const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ocr',
  description: '画像から文字起こしします',
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('url')
        .setDescription('画像のURLを入力してください')
    )
    .addAttachmentOption(
      option =>
      option
        .setName('image')
        .setDescription('画像を選択してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["ocr"] ?? true;
    
    await int.reply({
      content: 'Loading...',
      ephemeral
    });
    try {
      const image = options?.getString('url') || options?.getAttachment('image')?.url || null;
      if (!image) return await int.editRply({ content: '画像がありません' });
      const { default: Lens } = await import('chrome-lens-ocr');
      const text = (await new Lens().scanByURL(image)).segments.map(segment => segment.text).join(' ').replace(/\s+/g, ' ');

      const embed = new MessageEmbed()
        .setImage(image)
        .setColor(config.color);
      
      await int.editReply({
        content: text.length ? text : 'テキストを取得できませんでした',
        embeds: [embed]
      })
    } catch (e) {
      console.error(e);
      await int.editReply({ content: 'エラーが発生しました' });
    }
  }
}