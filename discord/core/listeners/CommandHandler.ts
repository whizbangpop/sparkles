import {Client, Collection, Interaction, SlashCommandBuilder} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import {CreateLogger} from "../../../utilities/createLogger";
import LoadConfig from "../../../utilities/configLoader";
import {CommandList} from "../../commands/_CommandList";

const ClientLogger = CreateLogger("discord", "command_handler");
const Config = LoadConfig();

export default (ClientApp: Client): void => {
    ClientLogger.debug("Starting command handler process");

    // Command loader
    const SlashCommandMap: Collection<string, SlashCommandBuilder> = new Collection();
    const MessageCommandMap: Collection<string, any> = new Collection(); // eslint-disable-line
    const CommandsDirectory: string = path.join(__dirname, "../", "../", "commands/");

    ClientLogger.debug(`Commands directory set to: ${CommandsDirectory}`);

    fs.readdirSync(CommandsDirectory).forEach((CommandFile) => {
        if (CommandFile.endsWith("temp") || CommandFile.endsWith("map")) return;
        // if (!CommandFile.endsWith(".js") || !CommandFile.endsWith(".ts")) return;

        CommandFile = CommandFile.replace(/\..+$/, "").toLowerCase();
        const Command = require(`${CommandsDirectory}${CommandFile}`); // eslint-disable-line

        if (Command.data) {
            SlashCommandMap.set(Command.data.name, Command);
            ClientLogger.debug(`Loaded slash command "${Command.data.name}"`);
        } else if (Command.name) {
            MessageCommandMap.set(Command.name, Command);
            ClientLogger.debug(`Loaded message command "${Command.name}"`);
        } else return;
    });

    ClientLogger.info("Loaded all commands");

    // Slash command listener
    ClientApp.on("interactionCreate", async (CommandContext: Interaction) => {
        if (!CommandContext.isChatInputCommand()) return;

        ClientLogger.debug(`/${CommandContext.commandName} was executed`, {userId: CommandContext.user.id});

        for (const Command of CommandList) {
            if (CommandContext.commandName === Command.data.name) {
                await Command.run(CommandContext);
                break;
            }
        }
    });

    // Message command listener
    ClientApp.on("messageCreate", async (Message) => {
        if (!Message.content.startsWith(Config.Discord.Prefix) || Message.author.bot) return;

        const CommandArgs: Array<string> = Message.content.slice(Config.Discord.Prefix.length).trim().split(/ +/);
        const CommandName = CommandArgs.shift()?.toLowerCase() as string;

        if (MessageCommandMap.has(CommandName)) {
            await Message.channel.sendTyping();

            const CommandObject = MessageCommandMap.get(CommandName);
            const {MaxArgs, MinArgs, CommandPattern} = CommandObject;

            // Arg length sanity checks
            if (CommandArgs.length < MinArgs) {
                await Message.reply({content: `Expected at least \`${MinArgs}\` arguments! Please check your command and try again.\nYour command should look like \`${CommandPattern}\``});
                return;
            }
            if (CommandArgs.length > MaxArgs) {
                await Message.reply({content: `Expected no more than \`${MaxArgs}\` arguments! Please check your command and try again.\nYour command should look like \`${CommandPattern}\``});
                return;
            }

            CommandObject.execute(Message, CommandArgs, ClientApp);
            return;
        }
    });
};