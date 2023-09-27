/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddCommentProps, CommentsResults } from '../models/InterfacesModels';

export interface ICommentsRepository {
	addComment(_data: AddCommentProps): Promise<void | any>;
	listComments(
		_pageParam: number,
		_pageSize: number,
		_pubId: string
	): Promise<CommentsResults | any>;
}
