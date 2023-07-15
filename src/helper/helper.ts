import * as bcrypt from "bcrypt";

export class Helper {

	async hashPassword(
		password: string,
		saltRounds: number
	): Promise<string> {
		const salt = await bcrypt.genSalt(saltRounds);
		return await bcrypt.hash(
			password,
			salt
		);
	}

} 