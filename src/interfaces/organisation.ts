interface OrganisationUser {
  name: string;
  profile: {
    title: string | null;
    createdAt: string;
  };
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
}
