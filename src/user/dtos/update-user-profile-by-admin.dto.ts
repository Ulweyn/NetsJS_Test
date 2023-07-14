import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail, IsString, IsOptional, IsNumber
} from "class-validator";

export class UpdateUserProfileByAdminDto {
	@ApiProperty({example: 1})
	@IsNumber()
	id: number;

	@ApiProperty({example: "somename"})
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({example: "SomeEmail@email.com"})
	@IsEmail()
	@IsOptional()
	email: string;

	@ApiProperty({example: "somepassword"})
	@IsString()
	@IsOptional()
	password: string;
}