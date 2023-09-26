import { Token } from '../models/InterfacesModels';

export interface IInternalStoreRepository {
	get(_key: string): Promise<string | null>;
	set(_key: string, _value: Token): Promise<void> | void;
	remove(_key: string): Promise<void> | void;
}
