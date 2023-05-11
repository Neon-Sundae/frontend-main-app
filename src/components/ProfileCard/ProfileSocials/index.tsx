import { FC } from 'react';
import { ReactComponent as InstagramIcon } from 'assets/illustrations/profile/instagram.svg';
import { ReactComponent as LinkedinIcon } from 'assets/illustrations/profile/linkedin.svg';
import { ReactComponent as TwitterIcon } from 'assets/illustrations/profile/twitter.svg';
import { ReactComponent as PortfolioIcon } from 'assets/illustrations/profile/portfolio.svg';
import { ReactComponent as GithubIcon } from 'assets/illustrations/profile/github.svg';
import { ReactComponent as DiscordIcon } from 'assets/illustrations/profile/discord.svg';
import { useParams } from 'react-router-dom';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import { useFetchUserDetailsWrapper } from 'queries/user';
import styles from './index.module.scss';

const ProfileSocials: FC = () => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const userData = useFetchUserDetailsWrapper();

  return (
    <div className={styles['profile-socials-container']}>
      <a href={`${profileData?.linkedin}`} target="_blank" rel="noreferrer">
        {profileData?.linkedin && <LinkedinIcon width={25.36} height={25.36} />}
      </a>
      <a href={`${profileData?.twitter}`} target="_blank" rel="noreferrer">
        {profileData?.twitter && <TwitterIcon width={25.36} height={25.36} />}
      </a>
      <a href={`${profileData?.instagram}`} target="_blank" rel="noreferrer">
        {profileData?.instagram && (
          <InstagramIcon width={25.36} height={25.36} />
        )}
      </a>
      <a href={`${profileData?.github}`} target="_blank" rel="noreferrer">
        {profileData?.github && <GithubIcon width={25.36} height={25.36} />}
      </a>
      <a href={`${profileData?.portfolio}`} target="_blank" rel="noreferrer">
        {profileData?.portfolio && (
          <PortfolioIcon width={25.36} height={25.36} />
        )}
      </a>
      <a href={`${userData?.user?.discordId}`} target="_blank" rel="noreferrer">
        {userData?.user?.discordId && (
          <DiscordIcon width={25.36} height={25.36} />
        )}
      </a>
    </div>
  );
};

export default ProfileSocials;
