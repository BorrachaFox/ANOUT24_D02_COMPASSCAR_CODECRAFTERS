import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { GetAllGenericResponses, resErrServer } from './responses.utils';

export function PostResponses() {
  return applyDecorators(
    resErrServer,
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid or missing input data.',
      examples: {
        ...responsesCreateAndUpdate,
        ...create400,
        ...createAndUpdate404,
        ...create404,
        ...createAndUpdate409,
        ...create409,
      },
    }),
  );
}

export function GetAllResponses() {
  return applyDecorators(GetAllGenericResponses, resErrServer);
}

export function GetOneResponses() {
  return applyDecorators(orderNotFound, resErrServer);
}

export function PatchResponses() {
  return applyDecorators(
    resErrServer,
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid or missing input data.',
      examples: {
        ...responsesCreateAndUpdate,
        ...createAndUpdate404,
        ...createAndUpdate409,
        ...update409,
        ...update400,
      },
    }),
  );
}

export function DeleteResponses() {
  return applyDecorators(
    orderNotFound,
    resErrServer,
    ApiConflictResponse({ description: 'Order cannot be canceled.' }),
  );
}

// Reutilizáveis

const responsesCreateAndUpdate = {
  startDateBeforeToday: {
    summary: 'Start date before today',
    value: {
      message: ['The start date cannot be before today.'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  endDateBeforeToday: {
    summary: 'End date before today',
    value: {
      message: ['The end date cannot be earlier than today.'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  endDateLessThanStartDate: {
    summary: 'End date less than start date',
    value: {
      message: ['The end date cannot be less than the start date.'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  cepMustBeString: {
    summary: 'CEP must be a string',
    value: {
      message: ['cep must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  invalidCepLength: {
    summary: 'Invalid CEP length',
    value: {
      message: 'Invalid CEP. The CEP must have 8 numbers.',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  invalidCepData: {
    summary: 'Invalid CEP data',
    value: {
      message: 'Invalid CEP. No data found for the provided CEP.',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  carIdMustBeInteger: {
    summary: 'Car ID must be an integer',
    value: {
      message: ['car_id must be an integer number'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const create400 = {
  clientIdMustBeInteger: {
    summary: 'Client ID must be an integer',
    value: {
      message: ['client_id must be an integer number'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  clientOrCarInUse: {
    summary: 'Client or Car in use in another order',
    value: {
      message: 'Client or Car using in another order',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const createAndUpdate404 = {
  carNotFound: {
    summary: 'Car not found',
    value: {
      message: 'Car not found.',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

const create404 = {
  clientNotFound: {
    summary: 'Client does not exist.',
    value: {
      message: 'Client does not exist.',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

const createAndUpdate409 = {
  carNotActive: {
    summary: 'Car is not active.',
    value: {
      message: 'Car is not active.',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};

const create409 = {
  clienNotActive: {
    summary: 'Client is not active.',
    value: {
      message: 'Client is not active.',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};

const update409 = {
  cepNotFound: {
    summary: 'CEP not found at ViaCEP.',
    value: {
      message: 'CEP not found at ViaCEP.',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};

const update400 = {
  carInUse: {
    summary: 'The car is already associated with an open or approved order.',
    value: {
      message: 'The car is already associated with an open or approved order.',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const orderNotFound = ApiNotFoundResponse({
  description: 'Order not found.',
});
