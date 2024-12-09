import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCarPlateFormat implements ValidatorConstraintInterface {
  validate(plate: any): boolean {
    if (typeof plate !== 'string') return false;

    const newPlateRegex = /^[A-Z]{3}-\d{1}[A-J0-9]{1}\d{2}$/;
    const oldPlateRegex = /^[A-Z]{3}-\d{4}$/;

    return (
      newPlateRegex.test(plate.toUpperCase()) ||
      oldPlateRegex.test(plate.toUpperCase())
    );
  }

  defaultMessage(): string {
    return 'Plate must be in the correct format: ABC-1C34 or ABC-1234';
  }
}

export function IsCarPlate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCarPlateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCarPlateFormat,
    });
  };
}
