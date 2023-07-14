import { Role } from "../../user/enums/roles.enum";

export default interface TokenPayloadInterface {
	id: number;

	email: string;

	role: Role;
}