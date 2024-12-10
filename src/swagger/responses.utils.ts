import { ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';

export function GetAllGenericResponses(x: string, m: string) {
  return ApiResponse({
    status: 404,
    description: `Not Found: No ${x} matched the filters provided.`,
    examples: {
      noClientFound: {
        summary: `No ${x} found`,
        value: {
          message: `No ${x} found.`,
          error: 'Not found',
          statusCode: 404,
        },
      },
      filterNotFound: {
        summary: `${m} not found with this filter`,
        value: {
          message: `${m} not found with this filter.`,
          error: 'Not found',
          statusCode: 404,
        },
      },
    },
  });
}

export const resErrServer = ApiInternalServerErrorResponse({
  description: 'Internal server error.',
});
