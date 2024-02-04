import {ShardingManager} from "discord.js";
import {CreateLogger} from "../../utilities/CreateLogger";
import Config from '../../utilities/ConfigLoader';

const Logger = CreateLogger("discord", "sharding");
const ShardManager = new ShardingManager("", {token: Config.Discord.Token});

ShardManager.on("shardCreate", Shard => {
});
ShardManager.spawn({amount: "auto"}).then(r => Logger.debug(`Spwaned shards: ${r}`));