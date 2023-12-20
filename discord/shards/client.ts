import {Client, Events, GatewayIntentBits, Activity} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import LoadConfig from "../../utilities/configLoader";
import {createClient} from "redis";

const ClientLogger = CreateLogger("discord", "client");
const Config = LoadConfig();

const ClientApp = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks
    ]
});

ClientApp.once(Events.ClientReady, async (readyClient) => {
    ClientLogger.info(`Logged in as ${readyClient.user.tag} (${readyClient.user.id})`);
    ClientApp.user!.setPresence({activities: [{name: "with messages!"}]});

    await TestRedisStatus();
});

async function TestRedisStatus() {
    ClientLogger.debug('Testing Redis...')
    const RedisClient = await createClient({url: `redis://${Config.Database.Redis.Username}:${Config.Database.Redis.Password}@${Config.Database.Redis.ConnectionURL}`})
        .on('error', err => ClientLogger.error(`Unexpected error: ${err}`))
        .connect();

    ClientLogger.debug('Redis alive. Disconnecting....')
    await RedisClient.disconnect();
}

ClientApp.login(Config.Discord.Token);