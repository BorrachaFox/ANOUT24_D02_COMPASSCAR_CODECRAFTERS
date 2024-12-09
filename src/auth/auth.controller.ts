import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserEmailActiveGuard } from 'src/guards/user/user-email-active.guard';
import {
  PostLoginResponses,
  PostRegisterResponses,
} from 'src/swagger/swagger-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostLoginResponses()
  @Post('login')
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @PostRegisterResponses()
  @Post('register')
  @UseGuards(UserEmailActiveGuard)
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }
}
