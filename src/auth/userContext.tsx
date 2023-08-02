import React, { ReactNode, createContext, useState } from 'react';
import { User } from '../models/InterfacesModels';
const userDefault: User = {
	_id: '64c1b0ef0fd89c04b7114eb7',
	first_name: 'Test',
	last_name: 'Test',
	mobile_phone: '0983473043',
	neighborhood: 'Cumbayá',
	email: 'gandhygarcia@outlook.es',
	password: 'password123',
	num_previous_pets: 2,
	num_current_pets: 1,
	outdoor_hours: 6,
	house_space: 100,
	has_yard: false,
	main_pet_food: 'homemade',
	pet_expenses: 40.5,
	motivation: 'Love for animals',
	favorite_adoption_publications: [],
	photo: {
		_id: '2',
		img_path:
			'https://scontent.fgye1-1.fna.fbcdn.net/v/t1.6435-9/74242360_3195954163812838_4274861617784553472_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFRCjYsTZuQlf2PHyTPJ3HYymegSJbxrSjKZ6BIlvGtKPYIzlm5LEqBr9cR0tDl-FEvtHfkBqZQ6LHCgw-pkTlW&_nc_ohc=dye6H3TWD6QAX-v2xOF&_nc_ht=scontent.fgye1-1.fna&oh=00_AfCF85oDfvg1CEtIJ1We_mJ3gV49fRwyklxfDfl8SouHOA&oe=64D84DE2'
	}
};
export interface UserContextParams {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
}
export const UserContext = createContext<UserContextParams>({} as UserContextParams);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User>(userDefault);
	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
