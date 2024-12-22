import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IsEndDateGreaterThanStartDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isEndDateGreaterThanStartDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!relatedValue || !value) {
            return true; // Skip validation if either date is not provided
          }
          const [startDay, startMonth, startYear] = relatedValue
            .split("-")
            .map(Number);
          const [endDay, endMonth, endYear] = value.split("-").map(Number);
          const startDate = new Date(startYear, startMonth - 1, startDay);
          const endDate = new Date(endYear, endMonth - 1, endDay);
          return endDate > startDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than ${args.constraints[0]}`;
        },
      },
    });
  };
}
