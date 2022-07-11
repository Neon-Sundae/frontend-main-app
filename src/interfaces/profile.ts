export interface IProfile {
  profileId: number;
  title: string | null;
  description: string | null;
  picture: string | null;
  timezone: string | null;
  portfolio: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  github: string | null;
  userId: number;
}

export interface IProfile {
  profileId: number;
  title: string | null;
  description: string | null;
  picture: string | null;
  timezone: string | null;
  portfolio: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  github: string | null;
  userId: number;
}

export interface IProfileCertifications {
  certificationId: number;
  title: string;
  issueDate: string;
  url: string;
  issuingOrganisation: string;
  profileId: number;
}

export interface IProfileEducation {
  educationId: number;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  profileId: number;
}

export interface IProfileWorkplace {
  workplaceId: number;
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string;
  profileId?: number;
}

export interface IProfileSkills {
  skillsId: number;
  name: string;
}

export interface IProfileApiResponse extends IProfile {
  certifications: IProfileCertifications[];
  education: IProfileEducation[];
  workplaces: IProfileWorkplace[];
  profileSkills: IProfileSkills[];
}

export interface IProfileSmartContractApiResponse extends IProfile {
  profileSmartContractId: string;
}
