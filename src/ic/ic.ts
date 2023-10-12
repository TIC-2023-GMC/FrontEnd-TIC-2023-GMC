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
import { AxiosGameRepository } from '../infrastructure/repositories/AxiosGameRepository';
import { AxiosLikeRepository } from '../infrastructure/repositories/AxiosLikeRepository';
import { AxiosMatchRepository } from '../infrastructure/repositories/AxiosMatchRepository';
import { AxiosParishRepository } from '../infrastructure/repositories/AxiosParishRepository';
import { AxiosUserRepository } from '../infrastructure/repositories/AxiosUserRepository';
import { ExpoFileSystemPhotoRepository } from '../infrastructure/repositories/ExpoFileSystemPhotoRepository';
import { ExpoStoreRepository } from '../infrastructure/repositories/ExpoStoreRepository';
import AxiosWordleGameRepository from '../infrastructure/repositories/AxiosWordleGameRespository';
import MobXWordleGameStoreService from '../infrastructure/GameStores/Wordle/MobXWordleGameStoreService';

container.registerSingleton('UserRepository', AxiosUserRepository);
container.registerSingleton('ExperienceRepository', AxiosExperienceRepository);
container.registerSingleton('AdoptionRepository', AxiosAdoptionRepository);
container.registerSingleton('FavoritesRepository', AxiosFavoritesRepository);
container.registerSingleton('LikeRepository', AxiosLikeRepository);
container.registerSingleton('CommentsRepository', AxiosCommentsRepository);
container.registerSingleton('InternalStoreRepository', ExpoStoreRepository);
container.registerSingleton('PhotoRepository', ExpoFileSystemPhotoRepository);
container.registerSingleton('GetStoragedToken', GetStoragedTokenUseCase);
container.registerSingleton('SetTokenInStorage', SetTokenInStorageUseCase);
container.registerSingleton('LogoutUser', LogoutUserUseCase);
container.registerSingleton('LocationRepository', AxiosParishRepository);
//Game Section
container.registerSingleton('GameRepository', AxiosGameRepository);
container.registerSingleton('MatchRepository', AxiosMatchRepository);
container.registerSingleton('WordleGameStore', MobXWordleGameStoreService);
container.registerSingleton('WordleGameRepository', AxiosWordleGameRepository);
