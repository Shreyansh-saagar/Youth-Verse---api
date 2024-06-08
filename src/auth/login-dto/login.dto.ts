import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsNotEmpty()
    @MinLength(6)
    password:string
}