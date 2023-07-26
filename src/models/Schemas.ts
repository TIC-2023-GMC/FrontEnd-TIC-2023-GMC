import { z } from 'zod';
export const PhotoSchema = z.object({
	_id: z.string(),
	img_path: z.string()
});

export const UserSchema = z.object({
	_id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	mobile_phone: z.string(),
	neighborhood: z.string(),
	email: z.string().email(),
	password: z.string(),
	num_previous_pets: z.number(),
	num_current_pets: z.number(),
	outdoor_hours: z.number(),
	house_space: z.number(),
	has_yard: z.boolean(),
	main_pet_food: z.string(),
	pet_expenses: z.number(),
	motivation: z.string(),
	favorite_adoption_publications: z.array(z.string()),
	photo: PhotoSchema
});

export const Like = z.object({
	_id: z.string()
});

export const Comment = z.object({
	_id: z.string(),
	comment_text: z.string(),
	comment_date: z.string()
});

export const AdoptionPublicationSchema = z.object({
	_id: z.string(),
	user: UserSchema,
	description: z.string().nonempty('La descripción es requerida'),
	publication_date: z.date(),
	photo: PhotoSchema,
	likes: z.optional(z.array(Like)),
	comments: z.optional(z.array(Comment)),
	species: z.string().nonempty('La especie del animal es requerida'),
	pet_size: z.string().nonempty('El tamaño del animal es requerido'),
	pet_breed: z.string().nonempty('La raza del animal es requerida'),
	pet_age: z.number().positive('La edad del animal debe ser un número positivo'),
	pet_sex: z.boolean({
		required_error: 'El sexo del animal es requerido'
	}),
	pet_location: z.string().nonempty('La ubicación del animal es requerida'),
	sterilized: z.boolean({ required_error: 'Selecciona si se encuentra esterilizado' }),
	vaccination_card: z.boolean({ required_error: 'Selecciona si posee carnet de vacunación' })
});

export const ExperiencePublicationSchema = z.object({
	_id: z.string(),
	user: UserSchema,
	description: z.string().nonempty('La descripción es requerida'),
	publication_date: z.string(),
	photo: PhotoSchema,
	likes: z.optional(z.array(Like)),
	comments: z.optional(z.array(Comment)),
	species: z.string().nonempty('La especie del animal es requerida')
});
