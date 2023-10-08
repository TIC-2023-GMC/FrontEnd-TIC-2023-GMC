import { z } from 'zod';
export const PhotoSchema = z.object({
	img_path: z.string()
});

export const UserSchema = z.object({
	_id: z.string(),
	first_name: z
		.string()
		.nonempty('El nombre es requerido')
		.regex(
			/^[A-ZÀ-ÿ][a-zA-ZÀ-ÿ'-]*(\s+[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'-]*)*$/,
			'Por favor, ingrese su nombre iniciando con mayúscula (evite caracteres especiales)'
		),
	last_name: z
		.string()
		.nonempty('El apellido es requerido')
		.regex(
			/^[A-ZÀ-ÿ][a-zA-ZÀ-ÿ'-]*(\s+[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'-]*)*$/,
			'Por favor, ingrese su apellido iniciando con mayúscula (evite caracteres especiales)'
		),
	mobile_phone: z.string().regex(/^09\d{8}$/, 'Por favor, ingrese un número de teléfono válido'),
	neighborhood: z.string().nonempty('El sector es requerido'),
	birth_date: z.date(),
	email: z.string().email('Por favor, ingrese un correo electrónico válido'),
	password: z.string().nonempty('La contraseña es requerida'),
	num_previous_pets: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
		.gte(0, 'El número de mascotas previas debe ser mayor o igual a 0'),
	num_current_pets: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
		.gte(0, 'El número de mascotas actuales debe ser mayor o igual a 0'),
	outdoor_hours: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
		.min(0, 'El número de horas fuera de casa deber estar entre 0 y 24')
		.max(24, 'El número de horas fuera de casa deber estar entre 0 y 24'),
	house_space: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor a 0' })
		.gt(0, 'La extensión del domicilio debe ser mayor a 0'),
	has_yard: z.boolean({
		required_error: 'Por favor, seleccione si su casa tiene patio o no'
	}),
	main_pet_food: z.string().nonempty('El principal tipo de alimento de sus mascotas es requerido'),
	pet_expenses: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
		.gte(0, 'El gasto promedio por mascota debe ser mayor o igual a 0'),
	motivation: z
		.string()
		.nonempty('Su motivación para adoptar es requerida')
		.max(150, 'Por favor, ingrese una motivación de 150 caracteres o menos')
		.refine(
			(value) => {
				const trimmedValue = value.trim();
				return trimmedValue.length > 0;
			},
			{
				message: 'Este campo no puede estar vacío'
			}
		),
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
	species: z.string().nonempty('La especie del animal es requerida'),
	pet_size: z.string().nonempty('El tamaño del animal es requerido'),
	pet_breed: z.string().nonempty('La raza del animal es requerida'),
	pet_age: z
		.number({ invalid_type_error: 'Por favor, ingrese un número entero en la edad' })
		.positive('La edad del animal debe ser un número positivo'),
	pet_sex: z.boolean({
		required_error: 'El sexo del animal es requerido'
	}),
	pet_location: z.string().nonempty('La ubicación del animal es requerida'),
	sterilized: z.boolean({ required_error: 'Selecciona si se encuentra esterilizado' }),
	vaccination_card: z.boolean({ required_error: 'Selecciona si posee carnet de vacunación' }),
	is_favorite: z.boolean().default(false)
});

export const ExperiencePublicationSchema = z.object({
	_id: z.string(),
	user: UserSchema,
	description: z.string().nonempty('La descripción es requerida'),
	publication_date: z.date(),
	photo: PhotoSchema,
	likes: z.optional(z.array(Like)),
	species: z.string().nonempty('La especie del animal es requerida')
});

export const UserAptitudeSchema = UserSchema.pick({
	num_previous_pets: true,
	num_current_pets: true,
	outdoor_hours: true,
	house_space: true,
	has_yard: true,
	main_pet_food: true,
	pet_expenses: true,
	motivation: true
});

export const UserPersonalDataSchema = UserSchema.pick({
	first_name: true,
	last_name: true,
	mobile_phone: true,
	neighborhood: true,
	email: true,
	password: true,
	photo: true
});

export const LoginSchema = z.object({
	email: z
		.string()
		.email('Por favor, ingrese un correo electrónico válido')
		.nonempty('Por favor, ingrese su correo electrónico'),
	password: z.string().nonempty('Por favor, ingrese su contraseña')
});


export const RegisterSchema = UserSchema.pick({
	first_name: true,
	last_name: true,
	mobile_phone: true,
	neighborhood: true,
	birth_date: true,
	email: true,
	password: true,
	photo: true
})

// export const RegisterSchema = z.object({
// 	first_name: z.string().nonempty('El nombre es requerido'),
// 	last_name: z.string().nonempty('El apellido es requerido'),
// 	mobile_phone: z.string().nonempty('El número de teléfono es requerido'),
// 	neighborhood: z.string().nonempty('El barrio es requerido'),
// 	birth_date: z.date().min(new Date('1900-01-01'), 'La fecha de nacimiento es requerida'),
// 	email: z.string().email('Por favor, ingrese un correo electrónico válido').nonempty('El correo electrónico es requerido'),
// 	password: z.string().nonempty('La contraseña es requerida'),
// 	num_previous_pets: z
// 		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
// 		.gte(0, 'El número de mascotas previas debe ser mayor o igual a 0'),
// 	num_current_pets: z
// 		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
// 		.gte(0, 'El número de mascotas actuales debe ser mayor o igual a 0'),
// 	outdoor_hours: z
// 		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
// 		.min(0, 'El número de horas fuera de casa deber estar entre 0 y 24')
// 		.max(24, 'El número de horas fuera de casa deber estar entre 0 y 24'),
// 	house_space: z
// 		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor a 0' })
// 		.gt(0, 'La extensión del domicilio debe ser mayor a 0'),
// 	has_yard: z.boolean({
// 		required_error: 'Por favor, seleccione si su casa tiene patio o no'
// 	}),
// 	main_pet_food: z.string().nonempty('El principal tipo de alimento de sus mascotas es requerido'),
// 	pet_expenses: z
// 		.number({ invalid_type_error: 'Por favor, ingrese un número entero mayor o igual a 0' })
// 		.gte(0, 'El gasto promedio por mascota debe ser mayor o igual a 0'),
// 	motivation: z
// 		.string()
// 		.nonempty('Su motivación para adoptar es requerida'),
// 	photo: PhotoSchema
// });

export const CommentTextSchema = z.object({
	comment_text: z
		.string()
		.nonempty('El comentario no puede estar vacío')
		.max(150, 'Máx. caracteres: 150')
		.refine(
			(value) => {
				const trimmedValue = value.trim();
				return trimmedValue.length > 0;
			},
			{
				message: 'El comentario no puede estar vacío'
			}
		)
});
