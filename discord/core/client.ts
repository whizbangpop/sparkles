import {Client, Events, GatewayIntentBits, Routes} from "npm:discord.js";
import {CreateLogger} from "../../utilities/CreateLogger.ts";
import {createClient} from "redis";
import {ToadScheduler, Task, SimpleIntervalJob} from "npm:toad-scheduler";
import axios from "npm:axios";

import CommandHandler from "./listeners/CommandHandler";
import MessageWatcher from "../rp_proxy/MessageWatcher";
import {REST} from "@discordjs/rest";
import {CommandList} from "../commands/_CommandList";
import { Cleanup } from "../../utilities/Cleanup";

process.stdin.resume()

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
import Config from '../../utilities/ConfigLoader';
// import DatabaseSyncService from "../rp_proxy/DatabaseSyncService";
const Schedule = new ToadScheduler();

ClientApp.once(Events.ClientReady, async (readyClient) => {
    Schedule.stop();

    ClientLogger.info(`Logged in as ${readyClient.user.tag} (${readyClient.user.id})`);
    ClientApp.user!.setPresence({activities: [{name: "with messages!"}]});

    await TestRedisStatus();

    const Rest = new REST({version: "9"}).setToken(Config.Discord.Token as string);
    const CommandData = CommandList.map((Command) => Command.data.toJSON());
    await Rest.put(Routes.applicationCommands(ClientApp.user?.id || "missing id"), {body: CommandData});
});

ClientApp.on(Events.Error, async (ClientError) => {
    Schedule.stop();
    ClientLogger.error(ClientError);
})

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

Cleanup(ScheduleClean);
function ScheduleClean() {
    ClientLogger.debug('Cleaning scheduler');
    Schedule.stop();
}

const HeartbeatTask = new Task("oneuptime heartbeat", async () => {
    await axios.get("https://oneuptime.com/heartbeat/f051612b-d9af-4aa2-b232-05468bdf68e5");
    console.log("heartbeat")
});
const HeartbeatJob = new SimpleIntervalJob({seconds: 30}, HeartbeatTask);
Schedule.addSimpleIntervalJob(HeartbeatJob);
// const SyncTask = new Task("oneuptime heartbeat", async () => { await DatabaseSyncService(ClientApp) });
// const SyncJob = new SimpleIntervalJob({ hours: 1 }, SyncTask);
// Schedule.addSimpleIntervalJob(SyncJob);
