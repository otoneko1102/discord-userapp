const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Jimp = require('jimp');
const axios = require('axios');

module.exports = {
  name: 'iei',
  description: '遺影を作成します',
  data: new SlashCommandBuilder()
    .addUserOption(
      option =>
      option
        .setName('user')
        .setDescription('ユーザーを選択してください')
    )
    .addBooleanOption(
      option =>
      option
        .setName('color')
        .setDescription('画像のタイプを選択してください')
    ),
  async execute(client, int, options, config, settings) {
    try {
      const ephemeral = settings?.isEphemeral["iei"] ?? true;
      
      const userId = options.getUser('user')?.id || int.user.id;
      const color = options.getBoolean('color') || false;
      let user;
      try {
        user = await client.users?.fetch(userId);
      } catch {}
      if (user) {
        await int.reply({
          content: 'Loading...',
          ephemeral
        });
        const overlay = "https://cdn.oto.pet/img/dead.png";
        const avatar = user.displayAvatarURL({ size: 1024, format: 'png' });
        await generateImage(overlay, avatar, color, int);
      } else {
        await int.reply({
          content: 'ユーザーが見つかりませんでした',
          ephemeral
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};

async function generateImage(overlayImageUrl, baseUrl, isColor, int) {
  try {
    const overlayImageBuffer = await axios.get(overlayImageUrl, { responseType: 'arraybuffer' });
    const overlayImage = await Jimp.read(overlayImageBuffer.data);
    overlayImage.resize(1024, 1231);
    const baseImageBuffer = await axios.get(baseUrl, { responseType: 'arraybuffer' });
    const baseImage = await Jimp.read(baseImageBuffer.data);
    baseImage.contain(1024, 1231);
    
    if (!isColor) {
      await baseImage.grayscale();
    }

    const baseCenterX = Math.floor(baseImage.bitmap.width / 2);
    const baseCenterY = Math.floor(baseImage.bitmap.height / 2);

    const overlayCenterX = Math.floor(overlayImage.bitmap.width / 2);
    const overlayCenterY = Math.floor(overlayImage.bitmap.height / 2);

    const x = baseCenterX - overlayCenterX;
    const y = baseCenterY - overlayCenterY;
    baseImage.blit(overlayImage, 0, 0);   

    const buffer = await baseImage.getBufferAsync(Jimp.MIME_PNG);
    const attachment = new MessageAttachment(buffer, 'dead.png');
    await int.editReply({ content: null, files: [attachment] });
  } catch (error) {
    console.error('Error processing and sending image:', error);
  }
}