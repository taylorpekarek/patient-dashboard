export interface IPatient {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  status: STATUS;
  addresses: IAddress[];
  additionalInfo?: string[];
}

export enum STATUS {
  INQUIRY = 'Inquiry',
  ONBOARDING = 'Onboarding',
  ACTIVE = 'Active',
  CHURNED = 'Churned'
}

export interface IAddress {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}
