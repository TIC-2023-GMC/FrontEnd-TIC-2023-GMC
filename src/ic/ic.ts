import 'reflect-metadata';
import { container } from 'tsyringe';
import { AxiosAdoptionRepository } from '../infrastructure/repositories/AxiosAdoptionRepository';
import { AxiosExperienceRepository } from '../infrastructure/repositories/AxiosExperienceRepository';
import { AxiosUserRepository } from '../infrastructure/repositories/AxiosUserRepository';
import { AxiosFavoritesRepository } from '../infrastructure/repositories/AxiosFavoritesRepository';

container.register('UserRepository', { useClass: AxiosUserRepository });
container.register('ExperienceRepository', { useClass: AxiosExperienceRepository });
container.register('AdoptionRepository', { useClass: AxiosAdoptionRepository });
container.register('FavoritesRepository', { useClass: AxiosFavoritesRepository });
