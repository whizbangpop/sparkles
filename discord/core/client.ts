import {Client, Events, GatewayIntentBits, Routes} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import LoadConfig from "../../utilities/configLoader";
import {createClient} from "redis";

import CommandHandler from "./listeners/CommandHandler";
import MessageWatcher from "../rp_proxy/MessageWatcher";
import {REST} from "@discordjs/rest";
import {CommandList} from "../commands/_CommandList";

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

const ClientLogger = CreateLogger("discord", "client");
const Config = LoadConfig();

ClientApp.once(Events.ClientReady, async (readyClient) => {
    ClientLogger.info(`Logged in as ${readyClient.user.tag} (${readyClient.user.id})`);
    ClientApp.user!.setPresence({activities: [{name: "with messages!"}]});

    await TestRedisStatus();

    const Rest = new REST({version: "9"}).setToken(Config.Discord.Token as string);
    const CommandData = CommandList.map((Command) => Command.data.toJSON());
    await Rest.put(Routes.applicationCommands(ClientApp.user?.id || "missing id"), {body: CommandData});
});

CommandHandler(ClientApp);
MessageWatcher(ClientApp);

async function TestRedisStatus() {
    ClientLogger.debug("Testing Redis...");
    const RedisClient = await createClient({url: `redis://${Config.Database.Redis.Username}:${Config.Database.Redis.Password}@${Config.Database.Redis.ConnectionURL}`})
        .on("error", err => ClientLogger.error(`Unexpected error: ${err}`))
        .connect();

    ClientLogger.debug("Redis alive. Disconnecting....");
    await RedisClient.disconnect();
}

ClientApp.login(Config.Discord.Token);