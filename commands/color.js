const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const random = require('randplus');
const colorName = require('color-name-lib');

module.exports = {
  name: "color",
  description: "色を表示します",
  data: new SlashCommandBuilder()
    .addStringOption(
      option =>
      option
        .setName('rgb_or_hex')
        .setDescription('色をRGB形式またはHEX形式で入力してください')
    ),
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["color"] ?? true;
    
    try {
      const args = options.getString('rgb_or_hex')?.trim()?.split(/ +/) || [];
      let hex = random.color('hex');
      if (args.length == 1 && !args[0].includes(',')) {
        const string = args[0].replace('#', '').toLowerCase();
        const regex = /^[0-9a-f]{6}$/i;
        if (!regex.test(string)) return int.reply({ content: "正しい値を入力してください", ephemeral: true });
        hex = string;
      } else if (args.length == 3) {
        const r = parseInt(args[0]);
        const g = parseInt(args[1]);
        const b = parseInt(args[2]);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return await int.reply({ content: "正しい値を入力してください", ephemeral: true });
        if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0) await int.reply({ content: "正しい値を入力してください", ephemeral: true });
        hex = rgbToHex([r, g, b]);
      } else if (args.join('').includes(',') && args.join('').split(',').length == 3) {
        const colors = args.join('').split(',');
        const r = parseInt(colors[0]);
        const g = parseInt(colors[1]);
        const b = parseInt(colors[2]);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return await int.reply({ content: "正しい値を入力してください", ephemeral: true });
        if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0) return await int.reply({ content: "正しい値を入力してください", ephemeral: true });
        hex = rgbToHex([r, g, b]);
      }
      const embed = new MessageEmbed()
        .setTitle('Color')
        .setDescription(`RGB: ${hexToRgb(hex).join(', ')}\nHEX: #${hex}\nNAME: ${colorName(hex)}, ${colorName(hex, 'ja')}`)
        .setColor(`#${hex}`)
        .setImage(`https://singlecolorimage.com/get/${hex}/400x100`);
      await int.reply({
        embeds: [embed],
        ephemeral
      });
    } catch (e) {
      console.error(e);
    }
  },
};

function rgbToHex(rgb) {
  return rgb
    .map(function (value) {
    return ("0" + value.toString(16)).slice(-2)
  }).join("").toLowerCase();
}

function hexToRgb (hex) {
	return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (str) {
		return parseInt(str, 16);
	});
}