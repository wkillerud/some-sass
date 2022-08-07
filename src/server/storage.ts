import type { URI } from "vscode-uri";
import type { IScssDocument } from "./parser";

export type Storage = Map<StorageItemKey, StorageItemValue>;
export type StorageItemEntry = [StorageItemKey, StorageItemValue];

export type StorageItemKey = string;
export type StorageItemValue = IScssDocument;

export default class StorageService {
	private readonly storage: Storage = new Map();

	public get(key: StorageItemKey | URI): StorageItemValue | undefined {
		return this.storage.get(this.toKey(key));
	}

	public set(key: StorageItemKey | URI, value: StorageItemValue): void {
		this.storage.set(this.toKey(key), value);
	}

	public delete(key: StorageItemKey | URI): void {
		this.storage.delete(this.toKey(key));
	}

	public clear(): void {
		this.storage.clear();
	}

	public keys(): IterableIterator<StorageItemKey> {
		return this.storage.keys();
	}

	public values(): IterableIterator<StorageItemValue> {
		return this.storage.values();
	}

	public entries(): IterableIterator<StorageItemEntry> {
		return this.storage.entries();
	}

	private toKey(key: StorageItemKey | URI): StorageItemKey {
		return key.toString();
	}
}
