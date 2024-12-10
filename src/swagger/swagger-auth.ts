import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function PostLoginResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Email or password may be incorrect.',
    }),
    ApiResponse({
      status: 400,
      description: 'Validation errors for the provided fields.',
      examples: { ...resLoginAndPost },
    }),
  );
}

export function PostRegisterResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Email is already used.' }),
    ApiBadRequestResponse({ description: 'Password is not strong enough.' }),
    ApiResponse({
      status: 400,
      description: 'Validation errors for the provided fields.',
      examples: { ...resLoginAndPost, ...invalidName },
    }),
  );
}

// Reutilizáveis

const resLoginAndPost = {
  invalidEmail: {
    summary: 'Email is invalid',
    value: {
      message: ['Email must be an email.'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const invalidName = {
  invalidName: {
    summary: 'Invalid name',
    value: {
      message: ['name must be longer than or equal to 2 characters'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};
