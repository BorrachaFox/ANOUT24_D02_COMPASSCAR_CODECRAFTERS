import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }
}
