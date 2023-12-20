import {ShardingManager, Events} from "discord.js";
import {CreateLogger} from "../../utilities/createLogger";
import LoadConfig from "../../utilities/configLoader";

const Logger = CreateLogger("discord", "sharding");

const Config = LoadConfig();

const ShardManager = new ShardingManager('./dist/discord/shards/client.js', {token: Config.Discord.Token});

// @ts-ignore
ShardManager.on("shardCreate", Shard => Logger.debug(`Launched Shard ${Shard.id}`));
ShardManager.spawn({amount: 5}).then(r => Logger.debug("Spwaned shards"));