import 'reflect-metadata';
import { container } from 'tsyringe';
import {
	GetStoragedTokenUseCase,
	LogoutUserUseCase,
	SetTokenInStorageUseCase
} from '../application/hooks';
import { AxiosAdoptionRepository } from '../infrastructure/repositories/AxiosAdoptionRepository';
import { AxiosCommentsRepository } from '../infrastructure/repositories/AxiosCommentsRepository';
import { AxiosExperienceRepository } from '../infrastructure/repositories/AxiosExperienceRepository';
import { AxiosFavoritesRepository } from '../infrastructure/repositories/AxiosFavoritesRepository';
import { AxiosLikeRepository } from '../infrastructure/repositories/AxiosLikeRepository';
import { AxiosUserRepository } from '../infrastructure/repositories/AxiosUserRepository';
import { ExpoFileSystemPhotoRepository } from '../infrastructure/repositories/ExpoFileSystemPhotoRepository';
import { ExpoStoreRepository } from '../infrastructure/repositories/ExpoStoreRepository';

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
