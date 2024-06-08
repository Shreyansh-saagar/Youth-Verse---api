import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { loginDto } from './login-dto/login.dto';
import * as bcrypt from 'bcrypt';
import { signupDto } from './signup-dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private _jwt: JwtService,
  ) {}

  async validateUser(loginDto: loginDto): Promise<any> {
    try {
      const { email, password } = loginDto;
      console.log(email + ' ' + password);
      if (!email) {
        throw new BadRequestException('email not found');
      }
      const user = await this._prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new BadRequestException('credential is incorrect');
      }

      const token = this._jwt.sign(
        { user: user.id, email: user.email, role: user.role },
        { secret: process.env.secret },
      );

      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createUser(signupDto: signupDto): Promise<any> {
    try {
      const { name, email, password, role } = signupDto;
      const existingUser = await this._prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this._prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      console.log(user);
      return { user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
