import fs from "fs";
import path from "path";
import toml from "toml";

const ConfigFile = fs.readFileSync(path.join(__dirname, '../', 'config.yaml'), 'utf8');
export default function LoadConfig() {
    return toml.parse(ConfigFile);
};