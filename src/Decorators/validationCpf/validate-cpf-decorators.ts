import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    if (typeof cpf !== 'string') {
      return false;
    }
    const cpfNumbersOnly = cpf.replace(/\D/g, '');

    if (cpfNumbersOnly.length !== 11 || /^(\d)\1+$/.test(cpfNumbersOnly)) {
      return false;
    }

    const calculateDigit = (base: string, initialWeight: number): number => {
      const sum = base.split('').reduce((acc, num, idx) => {
        return acc + parseInt(num) * (initialWeight - idx);
      }, 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const base = cpfNumbersOnly.substring(0, 9);
    const digito1 = calculateDigit(base, 10);
    const digito2 = calculateDigit(base + digito1, 11);

    return cpfNumbersOnly === base + digito1.toString() + digito2.toString();
  }

  defaultMessage(): string {
    return 'Invalid CPF.';
  }
}

export function validatorCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfConstraint,
    });
  };
}
