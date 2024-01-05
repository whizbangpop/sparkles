import {Client, Message} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import {EncryptMessage} from "./EncryptionKeys/MessageEncryptionHandler";

const ClientLogger = CreateLogger("discord", "message_collector");
const MessageTransport = CreateLogger("rp_proxy", "message_collector")
import Config from '../../utilities/configLoader';
import {KeyMap} from "./EncryptionKeys/MessageEncryptionHandler";

export default (ClientApp: Client): void => {
    ClientLogger.debug("Starting rp_proxy message collector");

    ClientApp.on("messageCreate", async (Message: Message) => {
        if (!Message.guild ||
            Message.content.startsWith(Config.Discord.Prefix) ||
            Message.author.id === ClientApp.user!.id)
            return;

        if (Message.content === ".clearcache") return KeyMap.clearMap();

        await Message.reply(`${Date.now() - Message.createdTimestamp}ms`)

        const NewMessage = EncryptMessage(Message.guild.id, Message.content);
        if (!NewMessage) return;

        MessageTransport.debug(`${NewMessage}`, {
            userId: Message.author.id,
            guildId: Message.guild.id
        });

        await Message.reply(`${Date.now() - Message.createdTimestamp}ms`)

        return;
    });
}