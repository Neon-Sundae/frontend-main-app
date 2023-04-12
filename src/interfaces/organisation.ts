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

export interface IProjectPerson {
  profileId: number;
  picture: string | undefined;
}
export interface OrganisationProjects {
  flProject_uuid: string;
  flProjectName: string;
  flProjectDescription: string;
  taskCount: number;
  projectPeople: IProjectPerson[];
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
  customButtonLabel: string | null;
  customButtonLink: string | null;
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
      description: string | null;
      picture: string | null;
      createdAt: string;
    };
  };
}

export interface IMember {
  userId: number;
  role: string;
  user: {
    name: string;
    email: string;
    userId: number;
    profile: {
      profileId: number;
      title: string | null;
      description: string | null;
      picture: string | null;
      createdAt: string;
    };
  };
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
