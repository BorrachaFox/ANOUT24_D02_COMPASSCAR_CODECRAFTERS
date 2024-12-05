import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsArrayUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyKey: string) {
    registerDecorator({
      name: 'isArrayUnique',
      target: object.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          const uniqueItems = new Set(value);
          return uniqueItems.size === value.length;
        },
        defaultMessage(): string {
          return 'Items must not contain duplicate values.';
        },
      },
    });
  };
}
