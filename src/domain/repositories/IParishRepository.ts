export interface IParishRepository {
	find(): Promise<Location[]>;
}
