import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ description: "Add the user's full name." })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Add user email.',
    example: 'qwerty@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `
    User's password. Requirements:
    - At least 8 characters.
    - At least 1 number.
    - The number of uppercase letters, lowercase letters and symbols are optional.
  `,
    example: 'password123',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}
