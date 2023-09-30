import 'reflect-metadata';
import { container } from 'tsyringe';
import {
	GetStoragedTokenUseCase,
	LogoutUserUseCase,
	SetTokenInStorageUseCase
} from '../application/hooks';
import { AxiosAdoptionRepository } from '../infrastructure/repositories/AxiosAdoptionRepository';
import { AxiosExperienceRepository } from '../infrastructure/repositories/AxiosExperienceRepository';
import { AxiosUserRepository } from '../infrastructure/repositories/AxiosUserRepository';
import { AxiosFavoritesRepository } from '../infrastructure/repositories/AxiosFavoritesRepository';
import { AxiosLikeRepository } from '../infrastructure/repositories/AxiosLikeRepository';
import { AxiosCommentsRepository } from '../infrastructure/repositories/AxiosCommentsRepository';
import { ExpoFileSystemPhotoRepository } from '../infrastructure/repositories/ExpoFileSystemPhotoRepository';
import { ExpoStoreRepository } from '../infrastructure/repositories/ExpoStoreRepository';
import { AxiosGameRepository } from '../infrastructure/repositories/AxiosGameRepository';
import { AxiosMatchRepository } from '../infrastructure/repositories/AxiosMatchRepository';

container.register('UserRepository', { useClass: AxiosUserRepository });
container.register('ExperienceRepository', { useClass: AxiosExperienceRepository });
container.register('AdoptionRepository', { useClass: AxiosAdoptionRepository });
container.register('FavoritesRepository', { useClass: AxiosFavoritesRepository });
container.register('LikeRepository', { useClass: AxiosLikeRepository });
container.register('CommentsRepository', { useClass: AxiosCommentsRepository });
container.register('InternalStoreRepository', { useClass: ExpoStoreRepository });
container.register('PhotoRepository', { useClass: ExpoFileSystemPhotoRepository });
container.register('GetStoragedToken', { useClass: GetStoragedTokenUseCase });
container.register('SetTokenInStorage', { useClass: SetTokenInStorageUseCase });
container.register('LogoutUser', { useClass: LogoutUserUseCase });
//Game Section
container.register('GameRepository', { useClass: AxiosGameRepository });
container.register('MatchRepository', { useClass: AxiosMatchRepository });
