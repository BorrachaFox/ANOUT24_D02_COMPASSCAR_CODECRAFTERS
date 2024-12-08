import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

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
    ApiResponse({
      status: 404,
      description: 'Not Found: No users matched the filters provided.',
      examples: {
        noClientFound: {
          summary: 'No users found',
          value: {
            statusCode: 404,
            message: 'No users found',
          },
        },
        filterNotFound: {
          summary: 'User not found with this filter.',
          value: {
            statusCode: 404,
            message: 'User not found with this filter.',
          },
        },
      },
    }),
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
  return applyDecorators(
    userNotFound,
    resErrServer,
    ApiOkResponse({ description: 'User desactivated successfully.' }),
  );
}

// Reutilizáveis

const responsesCreateAndUpdate = ApiResponse({
  status: 400,
  description: 'Bad Request: Invalid or missing input data.',
  examples: {
    weakPassword: {
      summary: 'Password',
      value: {
        statusCode: 400,
        message: 'password is not strong enough',
      },
    },
    invalidEmail: {
      summary: 'Email',
      value: {
        statusCode: 400,
        message: 'email must be an email',
      },
    },
  },
});

const resErrServer = ApiInternalServerErrorResponse({
  description: 'Internal server error.',
});

const userNotFound = ApiNotFoundResponse({
  description: 'User not found.',
});
