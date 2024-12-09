import { NotFoundException } from '@nestjs/common';

export class ValidateUsers {
  static userFiltersFounded(user): boolean{
    if (user.length === 0) {
      throw new NotFoundException(
        'Users not found with this filters',
      );
    }
    return true;
  }
  static userFoundAll(users): boolean{
    if (users.length === 0) {
      throw new NotFoundException(
        'Users not found in Database',
      );
    }
    return true;
  }
}