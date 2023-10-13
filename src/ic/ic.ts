import 'reflect-metadata';
import { container } from 'tsyringe';
import {
	GetStoragedTokenUseCase,
	LogoutUserUseCase,
	SetTokenInStorageUseCase
} from '../application/hooks';
import {
	AxiosAdoptionRepository,
	AxiosCommentsRepository,
	AxiosExperienceRepository,
	AxiosFavoritesRepository,
	AxiosGameRepository,
	AxiosLikeRepository,
	AxiosMatchRepository,
	AxiosOrganizationRepository,
	AxiosParishRepository,
	AxiosUserRepository,
	ExpoFileSystemPhotoRepository,
	ExpoStoreRepository
} from '../infrastructure/repositories/';
import AxiosWordSearchMatchRepository from '../infrastructure/repositories/AxiosWordSearchMatchRepository';
import MobxWordSearchStore from '../infrastructure/GameStores/Wordle/MobxWordSearchStore';
import MobXWordleGameStoreService from '../infrastructure/GameStores/Wordle/MobXWordleGameStoreService';
import AxiosWordleGameRepository from '../infrastructure/repositories/AxiosWordleGameRespository';
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
container.register('LocationRepository', { useClass: AxiosParishRepository });
container.registerSingleton('OrganizationRepository', AxiosOrganizationRepository);
//Game Section
container.registerSingleton('GameRepository', AxiosGameRepository);
container.registerSingleton('MatchRepository', AxiosMatchRepository);
//WordleStore
container.registerSingleton('WordleGameStore', MobXWordleGameStoreService);
//WordleGame
container.registerSingleton('WordleGameRepository', AxiosWordleGameRepository);
//WordSearchGame
container.registerSingleton('WordSearchMatchRepository', AxiosWordSearchMatchRepository);
//WordSearchStore
container.registerSingleton('WordSearchStore', MobxWordSearchStore);
