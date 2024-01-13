import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import {CreateLogger} from "../../../utilities/createLogger";
import LoadConfig from "../../../utilities/configLoader";

const ClientLogger = CreateLogger("proxy", "key_handler");
const Config = LoadConfig;

interface KeyPair {
    PublicKey: string;
    PrivateKey: string;
}

/**
 * Generate RSA key pair (public and private) and save the public key to a file.
 * If a key with the same guild ID exists, return the existing key instead of overwriting it.
 * @param {string} guildId - The guild ID used to create the filename for the public key.
 * @param {string} passphrase - The passphrase used for encrypting the private key.
 * @returns {KeyPair} An object containing the public and private keys.
 */
export function generateRSAKeys(guildId: string, passphrase: string): KeyPair {
    const CurrentDir = __dirname;

    const PublicKeyFileName = `publicKey_${guildId}.pem`;
    const PublicKeyPath = path.join(CurrentDir, PublicKeyFileName);

    const PrivateKeyFileName = `privateKey_${guildId}.pem`;
    const PrivateKeyPath = path.join(CurrentDir, PrivateKeyFileName);

    if (fs.existsSync(PublicKeyPath)) {
        const PublicKey = fs.readFileSync(PublicKeyPath, 'utf-8');
        const PrivateKey = '';
        return { PublicKey: PublicKey, PrivateKey: PrivateKey };
    }

    ClientLogger.debug(`Generating new keys for ${guildId}`);

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase,
        },
    });

    fs.writeFileSync(PublicKeyPath, publicKey);
    fs.writeFileSync(PrivateKeyPath, privateKey);

    ClientLogger.debug(`Saved public key for ${guildId}`);


    return { PublicKey: publicKey, PrivateKey: privateKey };
}

/**
 * Loads the public key associated with the specified guild ID.
 * @param {string} guildId - The ID of the guild to retrieve the public key for.
 * @returns {string | null} The public key content as a string, or null if the key file doesn't exist.
 */
export function loadPublicKey(guildId: string): string | null {
    const CurrentDir = __dirname;
    const PublicKeyFileName = `publicKey_${guildId}.pem`;
    const PublicKeyPath = path.join(CurrentDir, PublicKeyFileName);

    ClientLogger.debug(`Loading public key for ${guildId}`);

    if (fs.existsSync(PublicKeyPath)) {
        ClientLogger.debug(`Loaded public key for ${guildId}`);
        return fs.readFileSync(PublicKeyPath, 'utf-8');
    }

    return null; // If the file doesn't exist, return null
}

export function loadPrivateKey(guildId: string): string | null {
    const CurrentDir = __dirname;
    const PrivateKeyFileName = `privateKey_${guildId}.pem`;
    const PrivateKeyPath = path.join(CurrentDir, PrivateKeyFileName);

    ClientLogger.debug(`Loading private key for ${guildId}`);

    if (fs.existsSync(PrivateKeyPath)) {
        ClientLogger.debug(`Loaded private key for ${guildId}`);
        return fs.readFileSync(PrivateKeyPath, 'utf-8');
    }

    return null; // If the file doesn't exist, return null
}
