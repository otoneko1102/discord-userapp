const { Client, Collection } = require('discord.js');
const config = require('./config');
const client = new Client({ intents: config.intents });
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandType } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const fs = require('fs-extra');

async function register(cData) {
  //await client.application.commands.set(cData);
  
  await rest.put(Routes.applicationCommands(client.user.id), {
    body: cData,
  });
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  
  if (command.data) {
    command.data
      .setName(command.name)
      .setDescription(command.description || '説明がありません');
    const data = command.data.toJSON();
    data["integration_types"] = [1];
    commands.push(data);
  }
  
  console.log(`commands/${file} ready!`);
}

client.apps = new Collection();
const appFiles = fs.readdirSync('./apps').filter(file => file.endsWith('.js'));

for (const file of appFiles) {
  const command = require(`./apps/${file}`);
  client.apps.set(command.name, command);
  
  if (command.type) {
    const app = new ContextMenuCommandBuilder()
      .setName(command.name)
      .setType(ApplicationCommandType[command.type]);
    const data = app.toJSON();
    data["integration_types"] = [1];
    commands.push(data);
  }
  
  console.log(`apps/${file} ready!`);
}

client.functions = new Collection();
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));

for (const file of functionFiles) {
  const func = require(`./functions/${file}`);
  client.functions.set(func.id, func);
  
  console.log(`functions/${file} ready!`);
}

const regist = false;

client.on('ready', async () => {
  if (regist) register(commands)
    .catch(e => console.error(e))
    .then(() => {
    client.cData = commands;
    console.log(`${client.user.tag} OK!`);
  });
  if (!regist) console.log(`${client.user.tag} OK!`)
});

client.on('interactionCreate', async int => {
  if (int.isCommand()　|| int.isContextMenu()) {
    const command = client.commands.get(int.commandName) || client.apps.get(int.commandName);
    if (!command) return;
    
    const options = int.options;
    let settings = {};
    if (fs.existsSync(`./settings/${int.user.id}.json`)) {
      settings = fs.readJsonSync(`./settings/${int.user.id}.json`);
    } else {
      settings = fs.readJsonSync(`./settings/example.json`);
    }
    if (!settings.isEphemeral) settings.isEphemeral = {};
    command.execute(client, int, options, config, settings);
  }
  if (int.isButton()) {
    const id = int.customId.split('-')[0];
    const func = client.functions.get(id);
    if (!func) return;
    
    const args = int.customId.split('-')?.slice(1);
    let settings = {};
    if (fs.existsSync(`./settings/${int.user.id}.json`)) {
      settings = fs.readJsonSync(`./settings/${int.user.id}.json`);
    } else {
      settings = fs.readJsonSync(`./settings/example.json`);
    }
    if (!settings.isEphemeral) settings.isEphemeral = {};
    func.execute(client, int, args, config, settings);
  }
})

client.login(process.env.TOKEN);