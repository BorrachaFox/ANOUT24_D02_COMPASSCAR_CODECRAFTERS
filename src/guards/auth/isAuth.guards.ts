import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const path = request.url;
    if (path.includes('clients')) {
      return true; //Temporario, apenas para testes
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const data = this.authService.checkToken(token);

      request.tokenPayload = data;
    } catch (_err) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
