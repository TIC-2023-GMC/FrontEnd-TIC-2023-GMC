/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IParishRepository {
	find(): Promise<Location[]>;
}
