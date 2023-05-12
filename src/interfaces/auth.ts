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
