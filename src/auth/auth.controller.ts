import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { signupDto } from './signup-dto/signup.dto';
import { loginDto } from './login-dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService,private _jwt: JwtService) {}
  @Post('signup')
  async signUp(
    @Response() res,
    @Body() signupDto:signupDto
  ):Promise<any>{
    try {
      const {user}= await this._auth.createUser(signupDto)
      res.status(200).json({
        message:'user created successfully',
        user
      })

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  @Post('signin')
  async signin(
    @Request() req,
    @Response() res,
    @Body() loginDto:loginDto
  ):Promise<any>{
    try {
      const {user, token}= await this._auth.validateUser(loginDto)
      res.cookie('token',token,{httpOnly:true})
      res.status(200).json({
        message:'login successfully',
        id: user.id,
        email: user.email,
        role:user.role
      })

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  @Get('logout')
  async logout(
    @Response() res
  ){
    res.clearCookie('token');
    res.status(200).json({  
      message:'logout successful'
    })
  }

  @UseGuards(JwtGuard)
  @Get('check')
  async getProfile(
    @Request() req,
    @Response() res
  ){
    const decode = this._jwt.decode(req.cookies['token']);
    res.status(200).json({
      isAuthenticated:true,
      id:decode.user,
      eamil:decode.email
    })
  }
}
