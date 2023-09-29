import { AddCommentProps, CommentsResults } from '../../domain/models/InterfacesModels';
import { ICommentsRepository } from '../../domain/repositories/ICommentsRepository';
import { get, post } from '../services/api';
import { getAddCommentEndpoint, getListCommentsEndpoint } from '../services/endpoints';

export class AxiosCommentsRepository implements ICommentsRepository {
	create(_data: AddCommentProps): Promise<void> {
		return post(getAddCommentEndpoint(), _data);
	}
	async find(_pageParam: number, _pageSize: number, _pubId: string): Promise<CommentsResults> {
		const response = await get<CommentsResults>(
			getListCommentsEndpoint({ pubId: _pubId, pageParam: _pageParam, pageSize: _pageSize })
		);
		return response.data;
	}
}
