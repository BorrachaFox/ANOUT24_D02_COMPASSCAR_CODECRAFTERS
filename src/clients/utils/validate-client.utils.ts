import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export class ValidateClient {
  static validateAge(age: number): boolean {
    if (age <= 18) {
      throw new BadRequestException('Client must be 18 years or older');
    }
    return true;
  }

  static emailUsing(clientEmail: string, RequestEmail: string): boolean {
    if (clientEmail === RequestEmail) {
      throw new ConflictException('Email already in use by an active client.');
    }
    return true;
  }
  static cpfUsing(clientCPF: string, RequestCPF: string): boolean {
    if (clientCPF === RequestCPF) {
      throw new ConflictException('Cpf already in use by an active client.');
    }
    return true;
  }

  static clientFiltersFounded(clientFilters): boolean {
    if (clientFilters.length === 0) {
      throw new NotFoundException('Clients not found with this filters');
    }
    return true;
  }
}
