import * as fs from "node:fs";
import {CreateLogger} from "../../utilities/createLogger";
import {REST} from "@discordjs/rest";
import {Client, Routes} from "discord.js";
import LoadConfig from "../../utilities/configLoader";
import {CommandList} from "../commands/_CommandList";

const ClientLogger = CreateLogger("discord", "command_sync");
const Config = LoadConfig();
const rest = new REST({version: '10'}).setToken(Config.Discord.Token);

const CommandData = CommandList.map((Command) => Command.data.toJSON());

// await rest.put()