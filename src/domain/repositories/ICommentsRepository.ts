/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddCommentProps, CommentsResults } from '../models/InterfacesModels';

export interface ICommentsRepository {
	create(_data: AddCommentProps): Promise<void | any>;
	find(_pageParam: number, _pageSize: number, _pubId: string): Promise<CommentsResults | any>;
}
