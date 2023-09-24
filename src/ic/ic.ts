import 'reflect-metadata';
import { container } from 'tsyringe';
import { AxiosUserRepository } from '../infrastructure/repositories/AxiosUserRepository';

container.register('UserRepository', { useClass: AxiosUserRepository });
