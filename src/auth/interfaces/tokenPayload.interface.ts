import { Role } from "../../user/enums/roles.enum";

export interface TokenPayloadInterface {
	id: number;

	email: string;

	role: Role;
}