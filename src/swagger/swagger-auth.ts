import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function PostLoginResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Email or password may be incorrect.',
    }),
    resLoginAndPost,
  );
}

export function PostRegisterResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Email is already used.' }),
    resLoginAndPost,
    ApiBadRequestResponse({ description: 'Password is not strong enough.' }),
  );
}

// Reutilizáveis

const resLoginAndPost = ApiResponse({
  status: 400,
  description: 'Validation errors for the provided fields.',
  examples: {
    invalidEmail: {
      summary: 'Email is invalid',
      value: {
        message: ['Email must be an email.'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  },
});
