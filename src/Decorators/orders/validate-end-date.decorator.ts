import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ValidateEndDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateEndDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value && new Date(value) < new Date()) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `The end date cannot be earlier than today.`;
        },
      },
    });
  };
}