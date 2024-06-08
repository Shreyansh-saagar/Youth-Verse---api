import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){super({
        jwtFromRequest:ExtractJwt.fromExtractors([(request)=>{
            return request?.cookies?.token
        },]),
        secretOrKey:process.env.secret,
    })
    }

    validate(payload:any){
        console.log('Inside Jwt strategy' + payload);
        return payload
    }
}