import { IsNotEmpty, IsString } from "class-validator";

export class postDto{

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    desc: string

    @IsString()
    topics:string

    @IsString()
    related:string
}