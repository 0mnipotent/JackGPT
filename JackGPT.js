
const Discord = require('discord.js');
const client = new Discord.Client({
	ws: { intents: ["GUILDS", "GUILD_MESSAGES"] },
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "API-KEY",
});
const openai = new OpenAIApi(configuration);

client.on('message', async message => {
    try {
  if (message.author.id === client.user.id) return;
        if (message.channel.id === 'CHANNEL-ID') {
            let lastMessages = await message.channel.messages.fetch({ limit: 1 });
            let pMessage = lastMessages.last();
            const lastMessage = pMessage.channel.messages.cache.last();
            console.log(lastMessage.content);
            if (lastMessage.content.startsWith("!image")) {
		const prompt = `generate an image of ${lastMessage.content.slice(7)}`;
		const response = await openai.createImage({
		    prompt: `${lastMessage.content}\n`,
		    n:1,
		    size:'1024x1024'
		});
console.log(response.data.data[0].url);
		const imageUrl = response.data.data[0].url;
		const embed = new Discord.MessageEmbed()
		  .setTitle(lastMessage.content)
		  .setAuthor(message.author.username, 'https://jdao.live')
		  .setImage(imageUrl)
		message.channel.send(embed);
	    } else {
		const previousMessage = (await message.channel.messages.fetch({ limit: 1 })).last();
		const response = await openai.createCompletion({
		    prompt: `${lastMessage.content}\n`,
		    model: 'text-davinci-002',
		    temperature: 0.5,
		    max_tokens: 35
		});
		console.log(response.data);
		console.log(response.data.choices[0].text);
		message.reply(response.data.choices[0].text);
	    }
	}
 } catch (err) {
	console.error(err);
 }
});

client.login('BOT-TOKEN');
