const { Client, MessageEmbed, MessageButton, MessageActionRow, Intents } = require("discord.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
});

const config = require('./config.json')
const colors = require('colors')
const axios = require('axios')



client.on(`ready`, () => {
    console.log(colors.cyan("[Info] ") + "Carregamento do bot iniciado.\n")
})

var data = {}

client.on("ready", async() => {

    try {
        async function players_online() {
            let response = await axios.get(`http://${config.ip}:${config.porta}/players.json`)
            let play = response.data.length
            return play
        }

        async function autoconnect() {

            var players = await players_online()

            await client.channels.cache.get(config.Canal).bulkDelete(1).catch((error) => { return console.log(error) })

            if (data.players === -1) {
                var embed = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(config.Logo)
                    .addFields({ name: 'Status', value: '```fix\nOffline```' }, { name: 'IP SERVER', value: "```bash\n" + config.ip2 + "```" }, )

            } else {
                var embed = new MessageEmbed()
                    .setColor('PURPLE')
                    .setThumbnail(config.Logo)
                    .addFields({ name: 'Status', value: '```fix\nOnline```', inline: true }, { name: 'Jogadores Online', value: "```ini\n[ " + players + "/250 ]```", inline: true }, { name: 'IP SERVER', value: "```bash\n" + config.ip2 + "```" }, )

            }

            const autoconnect = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setStyle("LINK")
                    .setLabel(`FiveM`)
                    .setEmoji('878251971021246465')
                    .setURL(config.CFX.url),

                );

            await client.channels.cache.get(config.Canal).send({
                embeds: [embed],
                components: [autoconnect]
            }).then(msg => {
                setInterval(() => {
                    if (data.players === -1) {
                        embed.color = "RED"
                        embed.fields[0] = { name: 'Status', value: '```fix\nOffline```' }
                        msg.edit(embed)
                    } else {
                        embed.color = "PURPLE"
                        embed.fields[1] = { name: 'Jogadores Online', value: "```ini\n[ " + players + "/250 ]```", inline: true }
                        msg.edit(embed)
                        client.user.setStatus('dnd');
                        client.user.setActivity(`${config.name} com ${players} players.`, { type: 'PLAYING' })
                    }
                }, 60);
            })
        }


        await autoconnect()

    } catch (err) {
        return console.log(err)
    }

})

client.login(config.token)