import * as fs from 'fs';
import * as toml from '@iarna/toml';
import path from "node:path";

// const Logger = CreateLogger("discord", "sharding");

interface AppConfig {
    Discord: {
        Token: string;
        Prefix: string;
        ApplicationId: string;
    };
    Database: {
        Redis: {
            ConnectionURL: string;
            Username: string;
            Password: string;
        };
        MySQL: {
            ConnectionURL: string;
            ConnectionPort: number;
            Username: string;
            Password: string;
        };
        Mongo: {
            ConnectionURL: string;
            Username: string;
            Password: string;
        };
    };
    Papertrail: {
        ConnectionURL: string;
        ConnectionPort: number;
        Token: string;
    };
}

// Read and parse the TOML file
const tomlData = fs.readFileSync(path.join(__dirname, "../", "config.toml"), "utf8");
const config: Partial<AppConfig> = toml.parse(tomlData);

// Define a function to validate the config against the schema
function validateConfig(config: Partial<AppConfig>): config is AppConfig {
    // Define the required keys in the schema
    const requiredKeys: (keyof AppConfig)[] = [
        'Discord',
        'Database',
        'Papertrail'
    ];

    // Check if all required keys are present
    return requiredKeys.every((key) => {
        if (!config[key]) {
            console.error(`Missing ${key} section in the config.`);
            return false;
        }
        return true;
    });
}

// Validate the config
if (validateConfig(config)) {
    console.debug('Config is valid')
} else {
    console.error('Invalid config. Please check the TOML file.');
}

export default config as AppConfig;
