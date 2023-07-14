import { IsString, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
	readonly password: string;
}
