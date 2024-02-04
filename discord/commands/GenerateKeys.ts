import {Command} from "../core/interfaces/Command";
import {SlashCommandBuilder} from "@discordjs/builders";
import {generateRSAKeys, loadPublicKey} from "../rp_proxy/KeyHandlers/KeyHandler";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import path from "path";
import fs from "fs";
import axios from "axios";
import {CreateLogger} from "../../utilities/CreateLogger";

import FormData from 'form-data';

const ClientLogger = CreateLogger("commands", "generate_keys");

export const GenerateKeys: Command = {
    data: new SlashCommandBuilder()
        .setName('generate_keys')
        .setDescription("Generate the public and private keys for your roleplay messages")
        .addStringOption((option) =>
            option
                .setName("passphrase")
                .setDescription("The secret passphrase used when decrypting messages")
                .setRequired(true)
        ),
    run: async (Context: ChatInputCommandInteraction) => {
        await Context.deferReply();

        const Keys = loadPublicKey(Context.guild!.id);

        if (Keys) return await Context.followUp({content: `Oops! You have already generated encryption keys for this server.`});
        if (!Keys) {
            const Embed1 = new EmbedBuilder()
            Embed1.setTitle("Server Encryption Keys")
            Embed1.setDescription("Hey there! Before sending your private key - please make sure to read this, as it is very important.\n\nAll messages backed up by sparkles! with be securely encrypted with this public and private key. This means that no one apart from whoever has the private key can decrypt and read your messages - including us. If you loose your private key, you messages will be gone forever.\nThey will also be sent as an ephemeral message, so if you switch Discord channels, the keys may disappear. They will also be DM'd to you.\n\nYou keys should be sent in the next 15 seconds while they generate.")

            await Context.followUp({embeds: [Embed1]});

            ClientLogger.debug(`Generating new keys`, {guildId: Context.guild!.id})
            const NewKeys = generateRSAKeys(Context.guild!.id, Context.options.getString("passphrase") || "")
            const Embed2 = new EmbedBuilder()
            Embed2.setTitle("Public Key")
            Embed2.setDescription(`${NewKeys.PublicKey}`)

            const CurrentDir = __dirname;

            const PublicKeyFileName = `private_key_do_not_expose_${Context.guild!.id}.key`;
            const PublicKeyPath = path.join(CurrentDir, PublicKeyFileName);

            ClientLogger.debug(`Generating new keys`, {guildId: Context.guild!.id})
            fs.writeFileSync(PublicKeyPath, NewKeys.PrivateKey);

            const file = PublicKeyPath; // Replace with the path to your file
            const url = 'https://tmpfiles.org/api/v1/upload'; // Replace with your API endpoint
            const Embed3 = new EmbedBuilder()

            try {
                const fileStream = fs.createReadStream(file);

                const formData = new FormData();
                formData.append('file', fileStream);

                ClientLogger.debug(`Uploading keys`, {guildId: Context.guild!.id})

                const response = await axios.post(url, formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });

                Embed3.setTitle("Private Key")
                Embed3.setDescription(`${response.data.data.url}\n\nYou can download your private key from tmpfiles.org. This will only be kept on their servers for 1 hour, and will be deleted forever after that.`)
            } catch (error) {
                console.error('Error uploading file:', error);
            }

            fs.unlinkSync(PublicKeyPath);

            await Context.channel!.send({embeds: [Embed2, Embed3]})
            return await Context.user.send({embeds: [Embed2, Embed3]});
        }
    }
};