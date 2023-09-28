/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddOrRemoveLikeProps } from '../models/InterfacesModels';

export interface ILikeRepository {
	create(_data: AddOrRemoveLikeProps): Promise<void | any>;
	delete(_data: AddOrRemoveLikeProps): Promise<void | any>;
}
