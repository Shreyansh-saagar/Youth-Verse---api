import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class signupDto{

    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @MinLength(6)
    password:string

    @IsNotEmpty()
    @IsString()
    role: string;
}