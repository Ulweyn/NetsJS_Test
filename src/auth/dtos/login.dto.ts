import { ApiProperty } from "@nestjs/swagger";
import {
	IsString, IsNotEmpty, IsEmail
} from "class-validator";

export class LoginDto {

    @ApiProperty({example: "SomeEmail@email.com"})
    @IsEmail()
    @IsNotEmpty()
	 email: string;

    @ApiProperty({example: "mypassword"})
    @IsString()
    @IsNotEmpty()
    password: string;
}
