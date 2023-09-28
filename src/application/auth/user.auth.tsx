import React, { createContext } from 'react';
import { User } from '../../domain/models/InterfacesModels';

export interface UserContextParams {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	logOut: () => void;
}
export const UserContext = createContext<UserContextParams>({} as UserContextParams);
