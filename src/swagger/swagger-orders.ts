import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { GetAllGenericResponses, resErrServer } from './responses.utils';

export function PostResponses() {
  return applyDecorators(resErrServer);
}

export function GetAllResponses() {
  return applyDecorators(GetAllGenericResponses, resErrServer);
}

export function GetOneResponses() {
  return applyDecorators(orderNotFound, resErrServer);
}

export function PatchResponses() {
  return applyDecorators(resErrServer);
}

export function DeleteResponses() {
  return applyDecorators(orderNotFound, resErrServer);
}

// Reutilizáveis

const responsesCreateAndUpdate = ApiResponse({
  status: 400,
  description: 'Bad Request: Invalid or missing input data.',
  examples: {},
});

const orderNotFound = ApiNotFoundResponse({
  description: 'Order not found.',
});
