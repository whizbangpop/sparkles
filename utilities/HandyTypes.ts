import {CreateLogger} from "./createLogger";

const ClientLogger = CreateLogger("utils", "handy");

export class ClearableMap<K, V> {
    private readonly map: Map<K, V>;
    private readonly intervalDuration: number;
    private clearIntervalId: NodeJS.Timeout | null;

    constructor(intervalDuration: number = 24 * 60 * 60 * 1000) {
        this.map = new Map<K, V>();
        this.intervalDuration = intervalDuration;
        this.clearIntervalId = null;
        this.startClearing();
    }

    public clearMap(): void {
        ClientLogger.debug('Clearing key map...');
        this.map.clear();

        // Schedule the next clearing after intervalDuration
        this.clearIntervalId = setTimeout(() => {
            this.clearMap();
        }, this.intervalDuration);
    }

    private startClearing(): void {
        this.clearMap();
    }

    public stopClearing(): void {
        if (this.clearIntervalId) {
            clearTimeout(this.clearIntervalId);
            this.clearIntervalId = null;
        }
    }

    public set(key: K, value: V): void {
        this.map.set(key, value);
    }

    public get(key: K): V | undefined {
        return this.map.get(key);
    }

    public has(key: K): boolean {
        return this.map.has(key);
    }

    public getAll(): Map<K, V> {
        return this.map;
    }
}