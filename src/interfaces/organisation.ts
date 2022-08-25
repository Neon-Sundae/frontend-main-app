interface OrganisationUser {
  name: string;
  userId: number;
  profile: {
    profileId: number;
    title: string | null;
    createdAt: string;
    picture: string;
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
  organisationUser: OrganisationUser[];
  flProjects: OrganisationProjects[];
}
