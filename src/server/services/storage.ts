import type { IScssDocument } from "../types/symbols";

export type Storage = Map<StorageItemKey, StorageItemValue>;
export type StorageItemEntry = [StorageItemKey, StorageItemValue];

type SCSSDocumentUrl = string;
export type StorageItemKey = SCSSDocumentUrl;
export type StorageItemValue = IScssDocument;

export default class StorageService {
	private readonly _storage: Storage = new Map();

	public get(key: StorageItemKey): StorageItemValue | undefined {
		return this._storage.get(key);
	}

	public set(key: StorageItemKey, value: StorageItemValue): void {
		this._storage.set(key, value);
	}

	public delete(key: SCSSDocumentUrl): void {
		this._storage.delete(key);
	}

	public clear(): void {
		this._storage.clear();
	}

	public keys(): IterableIterator<StorageItemKey> {
		return this._storage.keys();
	}

	public values(): IterableIterator<StorageItemValue> {
		return this._storage.values();
	}

	public entries(): IterableIterator<StorageItemEntry> {
		return this._storage.entries();
	}
}
