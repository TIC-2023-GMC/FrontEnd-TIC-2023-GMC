/* eslint-disable @typescript-eslint/no-explicit-any */
import { Photo, Token } from '../models/InterfacesModels';

export interface IPhotoRepository {
	create(_uri: string, _token: Token): Promise<Photo>;
}
