import { AddOrRemoveLikeProps } from '../../domain/models/InterfacesModels';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { del, post } from '../services/api';
import { getAddLikeEndpoint, getRemoveLikeEndpoint } from '../services/endpoints';

export class AxiosLikeRepository implements ILikeRepository {
	create(_data: AddOrRemoveLikeProps): Promise<void> {
		return post(getAddLikeEndpoint(), _data);
	}
	delete(_data: AddOrRemoveLikeProps): Promise<void> {
		return del(getRemoveLikeEndpoint(), { data: _data });
	}
}
