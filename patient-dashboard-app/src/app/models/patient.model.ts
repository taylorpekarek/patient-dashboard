export interface IPatient {
  id?: string;
  firstName: string;
  middleName?: string;
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
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
