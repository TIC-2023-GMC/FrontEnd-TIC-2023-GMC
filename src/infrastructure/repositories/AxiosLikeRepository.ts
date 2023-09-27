import { AddOrRemoveLikeProps } from '../../domain/models/InterfacesModels';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { post, del } from '../services/api';
import { getAddLikeEndpoint, getRemoveLikeEndpoint } from '../services/endpoints';

export class AxiosLikeRepository implements ILikeRepository {
	addLike(_data: AddOrRemoveLikeProps): Promise<void> {
		return post(
			getAddLikeEndpoint({
				userId: _data.user_id,
				pubId: _data.pub_id,
				isAdoption: _data.is_adoption
			})
		);
	}
	removeLike(_data: AddOrRemoveLikeProps): Promise<void> {
		return del(
			getRemoveLikeEndpoint({
				userId: _data.user_id,
				pubId: _data.pub_id,
				isAdoption: _data.is_adoption
			})
		);
	}
}
