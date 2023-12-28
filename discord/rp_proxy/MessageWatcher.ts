import {Client, Message} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import LoadConfig from "../../utilities/configLoader";

import * as Crypto from "node:crypto";
import {loadPublicKey} from "./EncryptionKeys/KeyHandler";
import {EncryptMessage} from "./EncryptionKeys/MessageEncryptionHandler";

const ClientLogger = CreateLogger("discord", "message_collector");
const MessageTransport = CreateLogger("rp_proxy", "message_collector")
const Config = LoadConfig();

const KeyMap: Map<string, string> = new Map();

export default (ClientApp: Client): void => {
    ClientLogger.debug("Starting rp_proxy message collector");

    ClientApp.on("messageCreate", async (Message: Message) => {
        if (!Message.guild ||
            Message.content.startsWith(Config.Discord.Prefix) ||
            Message.author.id === ClientApp.user!.id)
            return;

        MessageTransport.debug(`${EncryptMessage(Message.guild.id, Message.content)}`, {
            userId: Message.author.id,
            guildId: Message.guild.id
        });
        return;
    });
}