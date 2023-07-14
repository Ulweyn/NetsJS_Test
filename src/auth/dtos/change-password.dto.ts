import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {

    @ApiProperty({example: "somepassword"})
    @IsString()
    @IsNotEmpty()
	readonly password: string;
}
