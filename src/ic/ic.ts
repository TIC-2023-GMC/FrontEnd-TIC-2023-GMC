import 'reflect-metadata';
import { container } from 'tsyringe';
import { AxiosRepository } from '../infrastructure/repositories/AxiosRepository';

container.register('UserRepository', { useClass: AxiosRepository });
