import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ValidateStartDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const atualDate = new Date(new Date().toISOString().split('T')[0]);
          const startDate = new Date(value.toISOString().split('T')[0]);
          if (value && startDate < atualDate) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `The start date cannot be before today.`;
        },
      },
    });
  };
}
