import {Client, Message} from "discord.js";
import {CreateLogger} from "../../utilities/CreateLogger";
import {EncryptMessage} from "./KeyHandlers/MessageEncryptionHandler";

const ClientLogger = CreateLogger("discord", "message_collector");
const MessageTransport = CreateLogger("rp_proxy", "message_collector")
import Config from '../../utilities/ConfigLoader';
import {KeyMap} from "./KeyHandlers/MessageEncryptionHandler";
import {createClient} from "redis";


export default async (ClientApp: Client) => {
    const RedisClient = await createClient({url: `redis://${Config.Database.Redis.Username}:${Config.Database.Redis.Password}@${Config.Database.Redis.ConnectionURL}`})
        .on("error", err => ClientLogger.error(`Unexpected error: ${err}`))
        .connect();

    ClientLogger.debug("Starting rp_proxy message collector");

    ClientApp.on("messageCreate", async (Message: Message) => {
        if (!Message.guild ||
            Message.content.startsWith(Config.Discord.Prefix) ||
            Message.author.id === ClientApp.user!.id)
            return;

        if (Message.content === ".clearcache") return KeyMap.clearMap();

        const NewMessage = EncryptMessage(Message.guild.id, Message.content);
        if (!NewMessage) return;

        await RedisClient.hSet(`${Message.id}`, {
            message: NewMessage,
            guildId: Message.guild.id,
            userId: Message.author.id
        });

        return;
    });
}