import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail, IsNumber, IsOptional, IsString
} from "class-validator";

export class RegisterDto {
	@ApiProperty({example: "myname"})
	@IsString()
	name: string;

	@ApiProperty({example: "SomeEmail@email.com"})
	@IsEmail()
	email: string;

	@ApiProperty({example: "mypassword"})
	@IsString()
	password: string;

	@ApiProperty({example: 1})
	@IsOptional()
	@IsNumber()
	role?: number;
}