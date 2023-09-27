/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddOrRemoveLikeProps } from '../models/InterfacesModels';

export interface ILikeRepository {
	addLike(_data: AddOrRemoveLikeProps): Promise<void | any>;
	removeLike(_data: AddOrRemoveLikeProps): Promise<void | any>;
}
