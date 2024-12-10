import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { GetAllGenericResponses, resErrServer } from './responses.utils';

export function PostResponses() {
  return applyDecorators(
    alreadyPlate,
    resErrServer,
    ApiResponse({
      status: 400,
      description: 'Validation errors for the provided vehicle data.',
      examples: {
        ...responsesCreateAndUpdate,
      },
    }),
  );
}

export function GetAllResponses() {
  return applyDecorators(GetAllGenericResponses('cars', 'Cars'), resErrServer);
}

export function GetOneResponses() {
  return applyDecorators(carNotExist, resErrServer); //
}

export function PatchResponses() {
  return applyDecorators(
    carNotExist,
    alreadyPlate,
    resErrServer,
    ApiResponse({
      status: 400,
      description: 'Validation errors for the provided vehicle data.',
      examples: { ...responsesCreateAndUpdate, ...responsesUpdate },
    }),
  );
}

export function DeleteResponses() {
  return applyDecorators(carNotExist, resErrServer); //
}

// Reutilizáveis

const responsesCreateAndUpdate = {
  brandEmpty: {
    summary: 'Brand cannot be empty',
    value: {
      message: ['brand should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  modelEmpty: {
    summary: 'Model cannot be empty',
    value: {
      message: ['model should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  plateInvalid: {
    summary: 'Plate format is invalid',
    value: {
      message: 'plate must be in the correct format ABC-1C34 or ABC-1234',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  yearGreaterThan2025: {
    summary: 'Year cannot be greater than 2025',
    value: {
      message: ['year must not be greater than 2025'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  yearLessThan2015: {
    summary: 'Year cannot be less than 2015',
    value: {
      message: ['year must not be less than 2015'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  kmNotInteger: {
    summary: 'Kilometers must be an integer',
    value: {
      message: ['km must be an integer number'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  kmLessThanZero: {
    summary: 'Kilometers cannot be negative',
    value: {
      message: ['km must not be less than 0'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  dailyRatePositive: {
    summary: 'Daily rate must be positive',
    value: {
      message: [
        'daily_rate must be a positive number',
        'daily_rate must not be less than 1',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  itemsMinimum: {
    summary: 'Items must have at least one element',
    value: {
      message: ['items must contain at least 1 elements'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  itemsNoDuplicates: {
    summary: 'Items must not contain duplicate values',
    value: {
      message: ['Items must not contain duplicate values.'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  itemsMaximum: {
    summary: 'Items cannot contain more than five elements',
    value: {
      message: ['items must contain no more than 5 elements'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const responsesUpdate = {
  brandRequired: {
    summary: 'Brand is required when model is provided',
    value: {
      message: 'brand is required',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
  modelRequired: {
    summary: 'Model is required when brand is provided',
    value: {
      message: 'model is required',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

const alreadyPlate = ApiConflictResponse({
  description: 'There is already a car with that same license plate.',
});

const carNotExist = ApiNotFoundResponse({
  description: 'Car not found.',
});
