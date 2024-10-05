const { Client, MessageActionRow, MessageButton } = require('discord.js');
const displus = require('displus');
const { MiQ } = require('makeitaquote');

module.exports = {
  name: "Make it a Quote",
  type: "Message",
  async execute(client, int, options, config, settings) {
    const ephemeral = settings?.isEphemeral["Make-it-a-Quote"] ?? true;
    const message = options.getMessage('message');
    if (!message.content) return int.reply({
      content: 'メッセージ内容がありません',
      ephemeral: true
    });
    
    try {
      int.reply({
        content: 'Loading...',
        ephemeral
      });
      
      const user = await client.users.fetch(message.author.id);
      if (!user) return;
      
      let tag;
      if (
        message.author?.username &&
        message.author?.discriminator
      ) {
        tag = message.author.discriminator === '0' ? message.author.username : `${message.author.username}#${message.author.discriminator}`
      }
      const imageData = {
        text: await replaceMentions(client, message),
        avatar: user.displayAvatarURL({ format: 'jpg' }),
        username: tag || message.author.id,
        display_name: message.author?.global_name || message.author.username,
        color: false,
        watermark: client.user.tag,
      };
      
      const miq = new MiQ()
        .setFromObject(imageData, true);
      const response = await miq.generate(true);
      
      await int.editReply({
        content: null,
        files: [{ attachment: response, name: 'quote.jpg' }]
      });
    } catch (e) {
      console.error(e);
    }
  }
}

async function replaceMentions(client, message) {
  let replacedContent = displus.removeMarkdown(message.content.replace(/<@!/g, '<@'));

  // ユーザーメンションの置き換え
  replacedContent = await replaceAsync(replacedContent, /<@(\d+)>/g, async (match, userId) => {
    const user = await client.users.fetch(userId);
    return user ? `@${user.tag}` : '!';
  });

  return replacedContent;
}

// Function to replace asynchronously
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });

  const replacements = await Promise.all(promises);
  return str.replace(regex, () => replacements.shift());
}