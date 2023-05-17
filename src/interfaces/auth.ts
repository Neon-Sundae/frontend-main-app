export interface IChoice {
  id: number;
  value: string;
  type?: string;
}

export enum SignupSteps {
  'Welcome',
  'UserType',
  'WorkType',
  'Objective',
  'Email',
  'SignupOptions',
  'OrganisationOnboard',
  'OrganisationName',
  'OrganisationNameReply',
  'OrganisationIndustry',
  'OrganisationIndustryReply',
  'OrganisationLogo',
}

export interface IVerifySignature {
  message: string;
  walletId: string;
  isFirstTimeUser: boolean;
  signature: string | null;
}

export interface IUseSaveUserOnboardData {
  workType: string;
  name: string;
  email: string;
}
