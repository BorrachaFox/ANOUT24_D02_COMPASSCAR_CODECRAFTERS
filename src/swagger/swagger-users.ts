import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { GetAllGenericResponses, resErrServer } from './responses.utils';

export function PostResponses() {
  return applyDecorators(
    responsesCreateAndUpdate,
    ApiUnauthorizedResponse({
      description: 'email is already used',
    }),
    resErrServer,
  );
}

export function GetAllResponses() {
  return applyDecorators(
    GetAllGenericResponses('users', 'Users'),
    resErrServer,
  );
}

export function GetOneResponses() {
  return applyDecorators(userNotFound, resErrServer);
}

export function PatchResponses() {
  return applyDecorators(
    userNotFound,
    responsesCreateAndUpdate,
    ApiConflictResponse({
      description: 'Email already in use by an active user.',
    }),
    resErrServer,
  );
}

export function DeleteResponses() {
  return applyDecorators(userNotFound, resErrServer);
}

// Reutilizáveis

const responsesCreateAndUpdate = ApiResponse({
  status: 400,
  description: 'Bad Request: Invalid or missing input data.',
  examples: {
    weakPassword: {
      summary: 'Password',
      value: {
        message: ['password is not strong enough'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    invalidEmail: {
      summary: 'Email',
      value: {
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  },
});

const userNotFound = ApiNotFoundResponse({
  description: 'User not found.',
});
