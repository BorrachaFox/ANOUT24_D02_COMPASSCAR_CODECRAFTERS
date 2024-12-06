import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserEmailActiveGuard } from '../guards/user/user-email-active.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @UseGuards(UserEmailActiveGuard)
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }
}
