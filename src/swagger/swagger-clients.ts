import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function PostResponses() {
  return applyDecorators(responsesCreateAndUpdate, resBadAge, resErrServer);
}

export function GetAllResponses() {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'Not Found: No clients matched the filters provided.',
      examples: {
        noClientFound: {
          summary: 'No client found',
          value: {
            statusCode: 404,
            message: 'No client found',
          },
        },
        filterNotFound: {
          summary: 'Client not found with this filter.',
          value: {
            statusCode: 404,
            message: 'Client not found with this filter.',
          },
        },
      },
    }),
    resErrServer,
  );
}

export function GetOneResponses() {
  return applyDecorators(clientNotExist, resErrServer);
}

export function PatchResponses() {
  return applyDecorators(
    clientNotExist,
    resBadAge,
    responsesCreateAndUpdate,
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
        statusCode: 409,
        message: 'Email already in use by an active client.',
      },
    },
    cpfConflict: {
      summary: 'CPF conflict',
      value: {
        statusCode: 409,
        message: 'CPF already in use by an active client.',
      },
    },
  },
});

const resBadAge = ApiBadRequestResponse({
  description: 'Client must be 18 years or older.',
});
const resErrServer = ApiInternalServerErrorResponse({
  description: 'Internal server error.',
});

const clientNotExist = ApiNotFoundResponse({
  description: 'Client does not exist.',
});
