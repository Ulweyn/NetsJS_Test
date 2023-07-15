import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "myemail@gmail.com"})
    email: string;
}