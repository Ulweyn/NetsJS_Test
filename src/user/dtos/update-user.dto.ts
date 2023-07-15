import {
	IsEmail, IsString, IsOptional, IsNumber
} from "class-validator";

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	name: string;

	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	password: string;

	@IsNumber()
	@IsOptional()
	imageId: number;
}