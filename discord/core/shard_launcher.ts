import {ShardingManager} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import Config from '../../utilities/configLoader';

const Logger = CreateLogger("discord", "sharding");
const ShardManager = new ShardingManager("./dist/discord/core/client.js", {token: Config.Discord.Token});

// @ts-expect-error DiscordJS does not ship correct types for ShardManager
ShardManager.on("shardCreate", Shard => Logger.debug(`Launched Shard ${Shard.id}`));
ShardManager.spawn({amount: 5}).then(r => Logger.debug(`Spwaned shards: ${r}`));