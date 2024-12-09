import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ValidateDateRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const startDate = (args.object as any).start_date;
          const finalDate = (args.object as any).final_date;
          if (
            startDate &&
            finalDate &&
            new Date(finalDate) < new Date(startDate)
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `The end date cannot be less than the start date.`;
        },
      },
    });
  };
}
