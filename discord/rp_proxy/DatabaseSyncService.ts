import {Client, Message} from "discord.js";
import {CreateLogger} from "../../utilities/CreateLogger";
import monk from "monk";

const ClientLogger = CreateLogger("services", "sync_service");
const MessageTransport = CreateLogger("rp_proxy", "sync_service")
import Config from '../../utilities/ConfigLoader.js';
import {createClient} from "redis";

// const db = monk(Config.Database.Mongo.ConnectionURL);
// db.then(() => { ClientLogger.debug('mongodb live') })
// db.get('document').insert([{a: 1}, {a: 2}, {a: 3}])
//     .then((docs) => {
//         // docs contains the documents inserted with added **_id** fields
//         // Inserted 3 documents into the document collection
//     }).catch((err) => {
//     // An error happened while inserting
// }).then(() => db.close())

export async function Pineapples() {
    const RedisClient = createClient({url: `redis://${Config.Database.Redis.Username}:${Config.Database.Redis.Password}@${Config.Database.Redis.ConnectionURL}`})
    RedisClient.on("error", err => ClientLogger.error(`Unexpected error: ${err}`))
    await RedisClient.connect()

    const AllKeys = await RedisClient.keys;
    console.log(AllKeys);

    ClientLogger.debug("Starting sync_service");
}

Pineapples().then(r => console.log(r));