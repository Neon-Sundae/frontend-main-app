interface OrganisationUser {
  user: {
    name: string;
    userId: number;
    profile: {
      profileId: number;
      title: string | null;
      createdAt: string;
      picture: string;
    };
  };
}

interface OrganisationProjects {
  flProject_uuid: string;
  flProjectName: string;
  flProjectDescription: string;
  taskCount: number;
}

export interface IOrganisation {
  organisationId: number;
  name: string;
  description: string | null;
  email: string | null;
  website: string | null;
  whitepaper: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  profileImage: string | null;
  bannerImage: string | null;
  OrganisationUser: OrganisationUser[];
  flProjects: OrganisationProjects[];
}

export interface IOwnerData {
  role: string;
  user: {
    name: string;
    email: string;
    userId: number;
    profile: {
      profileId: number;
      title: string | null;
      picture: string | null;
      createdAt: string;
    };
  };
}

export interface IMember {
  userId: number;
  role: string;
}

export interface IMemberData {
  managers: IMember[];
  owner: IMember[];
  all: IMember[];
}

export interface IOrganisationSelectData {
  label: string;
  value: string;
}

export interface ICreateOrganisationPayload {
  name: string;
  description: string;
  userId: string;
  industry?: string;
}

export interface IOrganisationDetails {
  bannerImage: string | null;
  description: string;
  flProjects: any[];
  industry: string | null;
  instagram: string | null;
  linkedin: string | null;
  name: string;
  organisationId: number;
  profileImage: string | null;
  twitter: string | null;
  website: string | null;
  whitepaper: string | null;
}
