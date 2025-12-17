import { IsEmail,IsString,IsNotEmpty,MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string

}