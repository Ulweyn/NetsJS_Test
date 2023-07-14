import { Role } from "../enums/roles.enum";

export interface UserInterface {
	id: number;

	name: string;

	email: string;

	password?: string;

	role: Role;
}