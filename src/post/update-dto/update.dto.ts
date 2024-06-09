import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateDto{
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    title?:string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    desc?:string;
    
    @IsOptional()
    @IsString()
    topics?:string

    @IsOptional()
    @IsString()
    related?:string
}