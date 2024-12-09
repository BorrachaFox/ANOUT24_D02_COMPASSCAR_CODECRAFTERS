import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetAllGenericResponses, resErrServer } from './responses.utils';

export function PostResponses() {
  return applyDecorators(
    responsesCreateAndUpdate,
    responsesCreateAndUpdate400,
    resErrServer,
  );
}

export function GetAllResponses() {
  return applyDecorators(
    GetAllGenericResponses('clients', 'Clients'),
    resErrServer,
  );
}

export function GetOneResponses() {
  return applyDecorators(clientNotExist, resErrServer);
}

export function PatchResponses() {
  return applyDecorators(
    clientNotExist,
    responsesCreateAndUpdate,
    responsesCreateAndUpdate400,
    resErrServer,
  );
}

export function DeleteResponses() {
  return applyDecorators(
    clientNotExist,
    ApiBadRequestResponse({
      description: 'Client contains pending or active order.',
    }),
    resErrServer,
  );
}

// Reutilizáveis

const responsesCreateAndUpdate = ApiResponse({
  status: 409,
  description:
    'Conflict: The resource could not be created due to duplicate data.',
  examples: {
    emailConflict: {
      summary: 'Email conflict',
      value: {
        message: 'Email already in use by an active client.',
        error: 'Conflict',
        statusCode: 409,
      },
    },
    cpfConflict: {
      summary: 'CPF conflict',
      value: {
        message: 'CPF already in use by an active client.',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  },
});

const responsesCreateAndUpdate400 = ApiResponse({
  status: 400,
  description: 'Validation errors for the provided data.',
  examples: {
    invalidEmail: {
      summary: 'Invalid email',
      value: {
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    invalidPhone: {
      summary: 'Invalid phone number',
      value: {
        message: ['phone must be a valid phone number'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    invalidBirthday: {
      summary: 'Invalid birthday format',
      value: {
        message: ['birthday must be a Date instance'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    underage: {
      summary: 'Underage user',
      value: {
        message: 'Client must be 18 years or older.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  },
});

const clientNotExist = ApiNotFoundResponse({
  description: 'Client does not exist.',
});
