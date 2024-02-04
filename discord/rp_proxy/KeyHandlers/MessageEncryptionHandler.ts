import {CreateLogger} from "../../../utilities/CreateLogger";
import {loadPrivateKey, loadPublicKey} from "./KeyHandler";
import * as crypto from 'crypto';
import {ClearableMap} from "../../../utilities/HandyTypes";

const ClientLogger = CreateLogger("proxy", "message_encryptor");

export const KeyMap = new ClearableMap<string, string>();

/**
 * Encrypts a message using the public key associated with the provided guild ID.
 * @param {string} GuildId - The ID of the guild associated with the public key.
 * @param {string} Message - The message to encrypt.
 * @returns {string | null} The encrypted message as a base64-encoded string, or null if encryption fails.
 */
export function EncryptMessage(GuildId: string, Message: string): string | null {
    if (KeyMap.has(GuildId)) {
        const publicKey = KeyMap.get(GuildId)!;
        const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(Message));
        return encryptedData.toString('base64');
    } else {
        const publicKey = loadPublicKey(GuildId);
        if (publicKey === null) {
            return null;
        }
        KeyMap.set(GuildId, publicKey);
        const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(Message));
        return encryptedData.toString('base64');
    }
}

/**
 * Decrypts an encrypted string using the provided private key and passphrase.
 * @param {string} encryptedString - The string to decrypt (base64-encoded).
 * @param {string} passkey - The passphrase associated with the private key.
 * @param {string} guildId - The guild ID associated with the private key.
 * @returns {string | null} The decrypted string, or null if decryption fails.
 */
function DecryptMessage(
    encryptedString: string,
    passkey: string,
    guildId: string
): string | null {
    if (!loadPrivateKey(guildId)) return null;
    const privateKey = loadPrivateKey(guildId) as string;

    try {
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: passkey
            },
            Buffer.from(encryptedString, 'base64')
        );
        return decryptedData.toString();
    } catch (error) {
        ClientLogger.error('Decryption failed:', error);
        return null;
    }
}